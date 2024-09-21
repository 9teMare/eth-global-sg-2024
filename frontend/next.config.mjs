/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "udhrubteotgugzsxqbgf.supabase.co",
                protocol: "https",
            },
        ],
    },
};

export default nextConfig;
