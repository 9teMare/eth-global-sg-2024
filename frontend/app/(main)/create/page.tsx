"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ky from "ky";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Mint from "./mint";
// import { useReadContract, useWriteContract } from "wagmi";

export default function Page() {
    const [aiPrompt, setAiPrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState("");
    const [blob, setBlob] = useState<Blob | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // const { writeContrct } = useWriteContract();

    const handleGenerateImage = async () => {
        setIsGenerating(true);
        await ky(`https://image.pollinations.ai/prompt/${aiPrompt}`, {
            searchParams: { width: 1000, height: 1000 },
            timeout: 2147483647,
            cache: "no-cache",
        })
            .blob()
            .then((blob) => {
                setBlob(blob);
                const objectUrl = URL.createObjectURL(blob);
                setGeneratedImage(objectUrl);
            })
            .finally(() => {
                setIsGenerating(false);
            });
    };

    return (
        <TabsContent value="create" className="flex flex-col h-[82vh] my-auto w-full pt-3">
            <div className="flex w-full justify-center items-center space-x-8 h-full">
                <Card className="w-full h-full">
                    <CardContent className="flex w-full h-full flex-col p-6 text-center items-center justify-center">
                        {!isGenerating && generatedImage ? (
                            <div className="mt-6">
                                <div className="relative aspect-square w-full max-w-full mx-auto overflow-hidden rounded-lg shadow-lg">
                                    <Image src={generatedImage} alt="AI-generated image" width={1000} height={1000} />
                                </div>
                            </div>
                        ) : isGenerating ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Magic awaits</h3>
                                <p className="text-sm text-muted-foreground">Start by describing the art you want to generate</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="w-full h-full">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="ai-prompt" className="block text-sm font-medium mb-1">
                                    Prompt
                                </label>
                                <Textarea
                                    id="ai-prompt"
                                    placeholder="Describe the image you want to generate..."
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-4">
                                <Button onClick={handleGenerateImage} disabled={isGenerating || !aiPrompt}>
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : !generatedImage ? (
                                        "Generate Image"
                                    ) : (
                                        "Regenerate Image"
                                    )}
                                </Button>
                                {generatedImage && <Mint prompt={aiPrompt} blob={blob!} image={generatedImage} />}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
