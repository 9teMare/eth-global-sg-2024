"use client";

import { Filter, User, Wallet } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TabsContent } from "@/components/ui/tabs";
import Marquee from "@/components/magicui/marquee";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { createClient } from "@/utils/supabase/client";

export default function Component() {
    const supabase = createClient();
    const [selectedChains, setSelectedChains] = useState<string[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    const [nfts, setNfts] = useState<any[]>([]);
    const chains = ["Ethereum", "Binance Smart Chain", "Polygon", "Solana"];
    const topics = ["Art", "Music", "Sports", "Politics", "Gaming", "Bitcoin"];

    const toggleChain = (chain: string) => {
        setSelectedChains((prev) => (prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]));
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
    };

    const fetchNfts = async () => {
        const {data, error} = await supabase.from("asset").select("*").limit(20);
        if (error) {
            console.error(error);
        }
        setNfts(data || []);
    };
    
    useEffect(() => {
        fetchNfts();
    }, []);

    return (
        <TabsContent value="marketplace">
            <h2 className="mt-4 mb-4 text-2xl font-bold">Trending memes</h2>
            <Marquee pauseOnHover horizontal className="[--duration:60s]">
                    {nfts.map((nft) => (
                            <Card key={nft.id} className="bg-black/20 border-none hover:bg-black/30">
                                <CardContent className="bg-transparent p-0 hover:bg-gray-950/[.05] dark:hover:bg-gray-50/[.05] rounded-lg backdrop-blur-sm">
                                    <Image
                                        alt={`NFT ${nft.id}`}
                                        className="w-full h-48 object-cover"
                                        height="200"
                                        src={`https://udhrubteotgugzsxqbgf.supabase.co/storage/v1/object/public/${nft.image_url}`}
                                        style={{
                                            aspectRatio: "300/200",
                                            objectFit: "cover",
                                            borderTopLeftRadius: "10px",
                                            borderTopRightRadius: "10px",
                                        }}
                                        width="300"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-bold">{nft.image_title}</h3>
                                        <p className="text-sm ">Floor: 2.5 ETH</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-sm font-semibold">Current Bid: 3.2 ETH</span>
                                            <Button size="sm">Bid</Button>
                                        </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </Marquee>
            {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"> */}
            {/* </div> */}
            <div className="flex justify-between items-center mt-6 mb-6 text-primary">
                <div className="flex space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-white/20 border-none hover:bg-white/30 text-white hover:text-primary">
                                <Filter className="h-4 w-4 mr-2" />
                                Chains
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black border-none hover:bg-black">
                            <DropdownMenuLabel>Select Chains</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {chains.map((chain) => (
                                <DropdownMenuCheckboxItem
                                    key={chain}
                                    checked={selectedChains.includes(chain)}
                                    onCheckedChange={() => toggleChain(chain)}
                                >
                                    {chain}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-white/20 border-none hover:bg-white/30 text-white hover:text-primary">
                                <Filter className="h-4 w-4 mr-2" />
                                Topics
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black border-none hover:bg-black">
                            <DropdownMenuLabel>Select Topics</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {topics.map((topic) => (
                                <DropdownMenuCheckboxItem
                                    key={topic}
                                    checked={selectedTopics.includes(topic)}
                                    onCheckedChange={() => toggleTopic(topic)}
                                >
                                    {topic}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-white/20 border-none hover:bg-white/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                        <Wallet className="w-4 h-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12.4M</div>
                        <p className="text-xs ">+20% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/20 border-none hover:bg-white/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <User className="w-4 h-4 " />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8,942</div>
                        <p className="text-xs ">+15% from last week</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/20 border-none hover:bg-white/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Floor Price</CardTitle>
                        <svg
                            className=" w-4 h-4 "
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 2v20" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.5 ETH</div>
                        <p className="text-xs ">-3% from last week</p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
