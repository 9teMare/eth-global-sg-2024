import { ThemeProvider } from "@/components/provider/theme-provider";
import WagmiContextProvider from "@/components/provider/wagmi-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Prompt Fun",
    description: "Created for ETH Global Singapore 2024",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookies = headers().get("cookie");

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <WagmiContextProvider cookies={cookies}>{children}</WagmiContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
