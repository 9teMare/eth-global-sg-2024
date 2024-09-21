import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import WorldIdModal from "@/components/world-id-modal";
import useSender from "@/hooks/useSender";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Mint({ prompt, blob, image }: { prompt: string; blob: Blob; image: string }) {
    const publicKey = useAccount().address!;
    const [nullifier, setNullifier] = useState<string>("");
    const [imageTitle, setImageTitle] = useState<string>("");

    const send = useSender({
        publicKey: publicKey,
        prompt: prompt,
        nullifier: nullifier,
        imageTitle: imageTitle,
        imageBlob: blob,
    });

    return (
        <Sheet>
            <SheetTrigger>
                <Button>That&apos;s the one, let&apos;s go!</Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col justify-between">
                <SheetHeader>
                    <SheetTitle>Let&apos;s pump!</SheetTitle>

                    <p>Prompt</p>
                    <Card className="w-full h-full">
                        <CardContent className="p-2 text-sm">{prompt}</CardContent>
                    </Card>

                    <p>Result</p>
                    <Image src={image} alt="AI-generated image" width={1000} height={1000} className="rounded-lg" />

                    <p>Give it a name</p>
                    <Input
                        type="text"
                        placeholder="Enter a name for your image"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </SheetHeader>

                <div>
                    <WorldIdModal setNullifier={setNullifier} />
                </div>

                <Button onClick={async () => await send()}>Send</Button>
            </SheetContent>
        </Sheet>
    );
}
