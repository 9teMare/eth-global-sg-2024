import { SupabaseContext } from "@/components/provider/supabase-provider";
import ccipSender from "@/contract/ccip/SenderAbi.json";
import layerzeroSender from "@/contract/layerzero/Source.json";

import { hash } from "@/lib/utils";

import { useContext } from "react";
import { useWriteContract, useSwitchChain } from "wagmi";
import { v4 as uuidv4 } from "uuid";
import { usePromptHash } from "@/store/hashStore";

export default function useSender({
    crosschain,
    publicKey,
    prompt,
    nullifier,
    imageTitle,
    imageBlob,
}: {
    crosschain: "chainlink" | "layerzero";
    publicKey: string;
    prompt: string;
    nullifier: string;
    imageTitle: string;
    imageBlob: Blob;
}) {
    const { writeContractAsync } = useWriteContract();
    const { switchChainAsync } = useSwitchChain();
    const { updateHash, updateImageUrl } = usePromptHash();

    const supabase = useContext(SupabaseContext);

    const send = async () => {
        const promptHash = await hash(prompt);
        updateHash(promptHash);

        const id = uuidv4();

        const s3result = await supabase?.storage.from("images").upload(`${id}.png`, imageBlob);

        if (!s3result || s3result.error) {
            console.error(s3result?.error);
            return;
        }

        updateImageUrl(s3result.data.fullPath);

        const insertDbResult = await supabase?.from("asset").insert([
            {
                public_key: publicKey,
                image_title: imageTitle,
                prompt: prompt,
                hash: promptHash,
                nullifier: nullifier,
                image_url: s3result.data.fullPath,
            },
        ]);

        if (!insertDbResult || insertDbResult.error) {
            console.error("Error inserting into db");
            return;
        }

        if (crosschain === "chainlink") {
            await switchChainAsync({ chainId: 43113 });

            await writeContractAsync({
                abi: ccipSender,
                address: "0xb0A71Afd378A5A22AA4C92B89F9714C8ccB5B51E",
                functionName: "sendMessage",
                args: ["16015286601757825753", "0x4c94a4b3fA89B438A8974b288fE31e85cf264532", `${promptHash}|${nullifier}|${publicKey}`],
            });
        } else if (crosschain === "layerzero") {
            await switchChainAsync({ chainId: 11155111 });

            await writeContractAsync({
                abi: layerzeroSender,
                value: BigInt(5000000000000000),
                address: "0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff",
                functionName: "send",
                args: [40322, `${promptHash}|${nullifier}|${publicKey}`],
            });
        }
    };

    return send;
}
