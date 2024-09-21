import "reflect-metadata";
import { TestingAppChain } from "@proto-kit/sdk";
import {
  Airdrop,
  AirdropProof,
  AirdropPublicOutput,
  canClaim,
  message,
  airdrop as airdropProgram,
  PromptVerifier,
  PreimageVerifierProof,
  PromptVerifierOutput,
  verifyPreimage,
  preimageVerifier,
} from "../../../src/runtime/modules/airdrop";
import {
  PrivateKey,
  Nullifier,
  MerkleMap,
  Poseidon,
  Bool,
  Field,
  setNumberOfWorkers,
} from "o1js";
import { Balances } from "../../../src/runtime/modules/balances";
import { Balance, BalancesKey, TokenId } from "@proto-kit/library";

describe("Airdrop adn PromptVerifier", () => {
  let appChain = TestingAppChain.fromRuntime({
    Airdrop: Airdrop,
    Balances: Balances,
    PromptVerifier: PromptVerifier
  });
  let airdrop: Airdrop;
  let airdropProof: AirdropProof;
  let promptVerifier: PromptVerifier;

  const aliceKey = PrivateKey.random();
  const alice = aliceKey.toPublicKey();

  const map = new MerkleMap();
  const key = Poseidon.hash(alice.toFields());
  map.set(key, Bool(true).toField());

  const witness = map.getWitness(key);

  const nullifier = Nullifier.fromJSON(
    Nullifier.createTestNullifier(message, aliceKey)
  );
  // PromptVerifier setup
  const preimage = Field(1234);  // Example preimage
  const expectedHash = Poseidon.hash([preimage]);
  let preimageVerifierProof: PreimageVerifierProof;

  async function mockProof(
    publicOutput: AirdropPublicOutput
  ): Promise<AirdropProof> {
    console.log("generating mock proof");
    console.time("mockProof");
    const proof = await AirdropProof.dummy(undefined, publicOutput, 0);
    console.timeEnd("mockProof");
    return proof;
  }

   async function mockPreimageProof(
    publicOutput: PromptVerifierOutput
  ): Promise<PreimageVerifierProof> {
    console.log("generating mock preimage proof");
    console.time("mockPreimageProof");
    const proof = await PreimageVerifierProof.dummy(undefined, publicOutput, 0);
    console.timeEnd("mockPreimageProof");
    return proof;
  }


  async function realProof(
    publicOutput: AirdropPublicOutput
  ): Promise<AirdropProof> {
    console.log("compiling airdrop program");
    console.time("compile");
    await airdropProgram.compile();
    console.timeEnd("compile");

    console.log("generating airdrop proof");
    console.time("proof");
    const proof = await airdropProgram.canClaim(witness, nullifier);
    console.timeEnd("proof");
    return proof;
  }

  beforeAll(async () => {
    appChain = TestingAppChain.fromRuntime({
      Airdrop: Airdrop,
      Balances: Balances,
      PromptVerifier: PromptVerifier
    });

    appChain.configurePartial({
      Runtime: {
        Airdrop: {},
        Balances: {
          totalSupply: Balance.from(10000),
        },
        PromptVerifier: {},
      },
    });

    await appChain.start();

    appChain.setSigner(aliceKey);

    airdrop = appChain.runtime.resolve("Airdrop");
    promptVerifier = appChain.runtime.resolve("PromptVerifier");

    // we can also set the number of worker threads to prevent efficiency cores
    // from being used on apple silicon
    // setNumberOfWorkers(7);

    // either use the dummy proof here, or generate a real proof like below
    // M1 macs seem to have issues generating the mock proofs,
    // so i've used a real proof instead
    airdropProof = await mockProof(await canClaim(witness, nullifier));
    const preimageVerifierProof = await mockPreimageProof(await verifyPreimage(expectedHash, expectedHash));

    // airdropProof = await realProof(await canClaim(witness, nullifier));
  }, 1_000_000);

 

 

  it("should set the preimage", async () => {
    const tx = await appChain.transaction(alice, async () => {
      await promptVerifier.setPreimage(expectedHash);
    });

    await tx.sign();
    await tx.send();

    await appChain.produceBlock();

    const storedPreimage = await appChain.query.runtime.PromptVerifier.preimage.get();

    expect(storedPreimage?.toBigInt()).toBe(expectedHash.toBigInt());
  });
  it("should verify a valid preimage", async () => {
    const Preimage = Field(1234);
    const PreimageProof = await mockPreimageProof(await verifyPreimage(Preimage, expectedHash));
    const tx = await appChain.transaction(alice, async () => {
      await promptVerifier.verifyPreimage(PreimageProof);
    });

    await tx.sign();
    await tx.send();

    const block = await appChain.produceBlock();

    expect(block?.transactions[0].status.toBoolean()).toBe(true);
    // We can't directly check the console.log output, but we can verify that the transaction was successful
  });

});

