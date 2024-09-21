"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ky from "ky";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    const [aiPrompt, setAiPrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateImage = async () => {
        setIsGenerating(true);
        await ky(`https://image.pollinations.ai/prompt/${aiPrompt}`, { searchParams: { width: 600, height: 600 }, timeout: 2147483647 })
            .blob()
            .then((blob) => {
                const objectUrl = URL.createObjectURL(blob);
                setGeneratedImage(objectUrl);
            })
            .finally(() => {
                setIsGenerating(false);
            });

        // setTimeout(() => {
        //     setGeneratedImage(`/placeholder.svg?height=512&width=512&text=${encodeURIComponent(aiPrompt)}`);
        //     setIsGenerating(false);
        // }, 2000);
    };

    return (
        <TabsContent value="create">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Create AI-Generated NFT</h2>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    AI Prompt
                                </label>
                                <Textarea
                                    id="ai-prompt"
                                    placeholder="Describe the image you want to generate..."
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <Button onClick={handleGenerateImage} disabled={isGenerating || !aiPrompt}>
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Image"
                                )}
                            </Button>
                            {generatedImage && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
                                    <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-lg">
                                        <Image src={generatedImage} alt="AI-generated image" layout="fill" objectFit="cover" />
                                    </div>
                                    <div className="mt-4 flex justify-center">
                                        <Button>Mint as NFT</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
