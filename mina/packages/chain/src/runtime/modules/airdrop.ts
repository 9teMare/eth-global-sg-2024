import {
  RuntimeModule,
  runtimeMethod,
  state,
  runtimeModule,
} from "@proto-kit/module";
import { State, StateMap, assert } from "@proto-kit/protocol";
import {
  Bool,
  ZkProgram,
  Field,
  MerkleMapWitness,
  Nullifier,
  Poseidon,
  Struct,
} from "o1js";
import { inject } from "tsyringe";
import { Balances } from "./balances";
import { Balance, TokenId } from "@proto-kit/library";

export class AirdropPublicOutput extends Struct({
  root: Field,
  nullifier: Field,
}) {}

export const message: Field[] = [Field(0)];

export async function canClaim(
  witness: MerkleMapWitness,
  nullifier: Nullifier
): Promise<AirdropPublicOutput> {
  const key = Poseidon.hash(nullifier.getPublicKey().toFields());
  const [computedRoot, computedKey] = witness.computeRootAndKeyV2(
    Bool(true).toField()
  );
  computedKey.assertEquals(key);

  nullifier.verify(message);

  return new AirdropPublicOutput({
    root: computedRoot,
    nullifier: nullifier.key(),
  });
}

export const airdrop = ZkProgram({
  name: "airdrop",
  publicOutput: AirdropPublicOutput,

  methods: {
    canClaim: {
      privateInputs: [MerkleMapWitness, Nullifier],
      method: canClaim,
    },
  },
});

export class AirdropProof extends ZkProgram.Proof(airdrop) {}

type AirdropConfig = Record<string, never>;

@runtimeModule()
export class Airdrop extends RuntimeModule<AirdropConfig> {
  @state() public commitment = State.from<Field>(Field);
  @state() public nullifiers = StateMap.from<Field, Bool>(Field, Bool);

  public constructor(@inject("Balances") public balances: Balances) {
    super();
  }

  @runtimeMethod()
  public async setCommitment(commitment: Field) {
    await this.commitment.set(commitment);
  }

  @runtimeMethod()
  public async claim(airdropProof: AirdropProof) {
    airdropProof.verify();
    const commitment = await this.commitment.get();

    assert(
      airdropProof.publicOutput.root.equals(commitment.value),
      "Airdrop proof does not contain the correct commitment"
    );

    const isNullifierUsed = await this.nullifiers.get(
      airdropProof.publicOutput.nullifier
    );

    assert(isNullifierUsed.value.not(), "Nullifier has already been used");

    await this.nullifiers.set(airdropProof.publicOutput.nullifier, Bool(true));

    await this.balances.mint(
      TokenId.from(0),
      this.transaction.sender.value,
      Balance.from(1000)
    );
  }
}
export class PromptVerifierOutput extends Struct({
  hash: Field,
  isValid: Bool,
}) {}

export async function verifyPreimage(
  preimage: Field,
  expectedHash: Field
): Promise<PromptVerifierOutput> {
  const computedHash = Poseidon.hash([preimage]);
  const isValid = computedHash.equals(expectedHash);

  return new PromptVerifierOutput({
    hash: expectedHash,
    isValid: isValid,
  });
}
export const preimageVerifier = ZkProgram({
  name: "preimageVerifier",
  publicOutput: PromptVerifierOutput,

  methods: {
    verifyPreimage: {
      privateInputs: [Field, Field],
      method: verifyPreimage,
    },
  },
});

export class PreimageVerifierProof extends ZkProgram.Proof(preimageVerifier) {}

type PromptVerifierConfig = Record<string, never>;

@runtimeModule()
export class PromptVerifier extends RuntimeModule<PromptVerifierConfig> {
  @state() public preimage = State.from<Field>(Field);
  
  @runtimeMethod()
  public async setPreimage(preimage: Field) {
    await this.preimage.set(preimage);
  }

  @runtimeMethod()
  public async verifyPreimage(preimageVerifierProof: PreimageVerifierProof) {
    preimageVerifierProof.verify();
    const preimage = await this.preimage.get();
    assert(preimageVerifierProof.publicOutput.hash.equals(preimage.value), "Preimage does not match");
    //log
    console.log("Preimage verified");
    return true;
  }

}
