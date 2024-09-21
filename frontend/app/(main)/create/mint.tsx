import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import WorldIdModal from "@/components/world-id-modal";
import useSender from "@/hooks/useSender";

import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePromptHash } from "@/store/hashStore";
import useReceiver from "@/hooks/useReceiver";

export default function Mint({ prompt, blob, image }: { prompt: string; blob: Blob; image: string }) {
    const publicKey = useAccount().address!;
    const [nullifier, setNullifier] = useState<string>("");
    const [imageTitle, setImageTitle] = useState<string>("");
    const [isHuman, setIsHuman] = useState<boolean>(false);

    const [selectedCrossChain, setSelectedCrossChain] = useState<"chainlink" | "layerzero">("chainlink");

    const send = useSender({
        crosschain: selectedCrossChain,
        publicKey: publicKey,
        prompt: prompt,
        nullifier: nullifier,
        imageTitle: imageTitle,
        imageBlob: blob,
    });

    const verify = useReceiver({ crosschain: selectedCrossChain });

    return (
        <Sheet>
            <SheetTrigger>
                <Button>That&apos;s the one, let&apos;s go!</Button>
            </SheetTrigger>

            <SheetContent className="flex w-full">
                <Tabs defaultValue="source" className="w-full">
                    <TabsList>
                        <TabsTrigger value="source">Source</TabsTrigger>
                        <TabsTrigger value="destination">Destination</TabsTrigger>
                    </TabsList>
                    <TabsContent value="source">
                        <div className="flex flex-col h-full justify-between">
                            <SheetHeader className="flex flex-col space-y-4 h-full">
                                <SheetTitle>Let&apos;s pump!</SheetTitle>

                                <div className="flex flex-col space-y-1">
                                    <p>Prompt</p>
                                    <Card className="w-full h-full">
                                        <CardContent className="p-2 text-sm text-muted-foreground">{prompt}</CardContent>
                                    </Card>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <p>Result</p>
                                    <Image src={image} alt="AI-generated image" width={300} height={300} className="rounded-lg" />
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <p>Give it a name</p>
                                    <Input
                                        type="text"
                                        placeholder="Enter a name for your image"
                                        value={imageTitle}
                                        onChange={(e) => setImageTitle(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <p>Cross-chain Protocol</p>
                                    <Select
                                        value={selectedCrossChain}
                                        onValueChange={(value) => setSelectedCrossChain(value as "chainlink" | "layerzero")}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Cross-chain protocol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="chainlink">Chainlink</SelectItem>
                                            <SelectItem value="layerzero">LayerZero</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </SheetHeader>

                            <div className="mt-10">
                                <WorldIdModal setNullifier={setNullifier} setIsHuman={setIsHuman} />
                            </div>

                            {isHuman && <Button onClick={async () => await send()}>Send</Button>}
                        </div>
                    </TabsContent>
                    <TabsContent value="destination">
                        <div className="flex flex-col h-full justify-between">
                            <div className="mt-10">
                                <WorldIdModal setNullifier={setNullifier} setIsHuman={setIsHuman} />
                            </div>

                            {isHuman && <Button onClick={async () => await verify()}>verify</Button>}
                        </div>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
