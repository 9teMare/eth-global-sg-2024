import { SupabaseContext } from "@/components/provider/supabase-provider";
import abi from "@/contract/SenderAbi.json";
import { hash } from "@/lib/utils";
import { useContext } from "react";
import { useWriteContract } from "wagmi";

export default function useSender({
    publicKey,
    prompt,
    nullifier,
    imageTitle,
    imageBlob,
}: {
    publicKey: string;
    prompt: string;
    nullifier: string;
    imageTitle: string;
    imageBlob: Blob;
}) {
    const { writeContractAsync } = useWriteContract();

    const supabase = useContext(SupabaseContext);

    const send = async () => {
        const promptHash = await hash(prompt);

        const s3result = await supabase?.storage.from("images").upload(`${imageTitle}.png`, imageBlob);

        if (!s3result || s3result.error) {
            console.error(s3result?.error);
            return;
        }

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

        await writeContractAsync({
            abi,
            address: "0xd3761Dc1B35087583CF96a4c28C4581A145Ee823",
            functionName: "sendMessage",
            args: ["16015286601757825753", "0x4c94a4b3fA89B438A8974b288fE31e85cf264532", `${promptHash}|${nullifier}|${publicKey}`],
        });
    };

    return send;
}
