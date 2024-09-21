import ccipReceiver from "@/contract/ccip/ReceiverAbi.json";
import layerzeroReceiver from "@/contract/layerzero/Destination.json";

import { usePromptHash } from "@/store/hashStore";
import { useSwitchChain, useWriteContract } from "wagmi";

export default function useReceiver({ crosschain }: { crosschain: "chainlink" | "layerzero_op" | "layerzero_morph" }) {
    const { writeContractAsync } = useWriteContract();
    const { switchChainAsync } = useSwitchChain();

    const verify = async () => {
        const { hash, image_url } = usePromptHash();

        if (crosschain === "chainlink") {
            await switchChainAsync({ chainId: 11155111 });

            await writeContractAsync({
                abi: ccipReceiver,
                address: "0x4c94a4b3fA89B438A8974b288fE31e85cf264532",
                functionName: "storeInferenceResult",
                args: [hash, `flux|${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public${image_url}`],
            });
        } else if (crosschain === "layerzero_op") {
            // await switchChainAsync({ chainId: 11155111 });
            // await writeContractAsync({
            //     abi: layerzeroReceiver,
            //     value: BigInt(5000000000000000),
            //     address: "0x67abB8eBB917f8D2D9FeA7d3Cb596895dffDE15d",
            //     functionName: "receive",
            //     args: [40232, `${promptHash}|${nullifier}|${publicKey}`],
            // });
        }
    };

    return verify;
}
