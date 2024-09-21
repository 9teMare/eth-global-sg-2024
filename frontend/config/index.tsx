import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia, polygon } from "@reown/appkit/networks";
import { CaipNetwork } from "@reown/appkit";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
    throw new Error("Project ID is not defined");
}

const fuji: CaipNetwork = {
    id: "eip155:43113",
    chainId: 43113,
    chainNamespace: "eip155",
    name: "Avalanche Fuji",
    currency: "AVAX",
    explorerUrl: "https://testnet.snowtrace.io",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    imageUrl: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
};

export const networks = [sepolia, fuji];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks,
});

export const config = wagmiAdapter.wagmiConfig;
