"use client";

import { Filter, User, Wallet } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

export default function Component() {
    const [selectedChains, setSelectedChains] = useState<string[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    const chains = ["Ethereum", "Binance Smart Chain", "Polygon", "Solana"];
    const topics = ["Art", "Music", "Sports", "Politics", "Gaming", "Bitcoin"];

    const toggleChain = (chain: string) => {
        setSelectedChains((prev) => (prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]));
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
    };

    return (
        <TabsContent value="marketplace">
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Chains
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Topics
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                        <Wallet className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12.4M</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">+20% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8,942</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">+15% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Floor Price</CardTitle>
                        <svg
                            className=" w-4 h-4 text-gray-500 dark:text-gray-400"
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">-3% from last week</p>
                    </CardContent>
                </Card>
            </div>
            <h2 className="mt-10 mb-4 text-2xl font-bold">Trending memes</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-0">
                            <Image
                                alt={`NFT ${i}`}
                                className="w-full h-48 object-cover"
                                height="200"
                                src={`/placeholder.svg?height=200&width=300`}
                                style={{
                                    aspectRatio: "300/200",
                                    objectFit: "cover",
                                }}
                                width="300"
                            />
                            <div className="p-4">
                                <h3 className="font-bold">CryptoPunk #{i}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Floor: 2.5 ETH</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm font-semibold">Current Bid: 3.2 ETH</span>
                                    <Button size="sm">Bid</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
    );
}
