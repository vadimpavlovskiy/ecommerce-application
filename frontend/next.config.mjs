/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: process.env.DO_URL
            }
        ]
    }
};

export default nextConfig;
