"use client";

import { BarChart3, Bell, Plus, Search, User, Wallet } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAppKit } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
export default function Layout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { open } = useAppKit();

    const [hue, setHue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setHue((prevHue) => (prevHue + 0.5) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const color = `hsl(${hue}, 100%, 50%)`;
    const lightColor = `hsl(${hue}, 100%, 70%)`;

    return (
        <main style={{ 
            background: `
                linear-gradient(
                     180deg,
                     black 0%,
                     ${color} 25%,
                     ${lightColor} 30%,
                     ${lightColor} 35%,
                     ${lightColor} 40%,
                     ${lightColor} 45%,
                     ${color} 50%,
                     black 70%,
                     black 100%
                )
            `,
            backgroundSize: '400% 100%',
            animation: 'moveGradient 60s linear infinite',
        }}>
            <div className="flex flex-col min-h-screen bg-transparent items-center border-b pb-6 backdrop-blur-lg">
                <header className="flex items-center w-full h-16 px-4 md:px-6">
                    <nav className="flex-1 flex items-center space-x-4 lg:space-x-6">
                        <div className="font-bold text-xl text-primary">Prompt Fun</div>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
                            <Input className="pl-8 bg-white/10 border-none" placeholder="Search memes..." type="search" />
                        </div>
                    </nav>
                    <div className="flex items-center space-x-4 text-primary">
                        <ThemeToggle />
                        <Button variant="ghost" size="icon">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={async () => await open()}>
                            <Wallet className="h-4 w-4" />
                            <span className="sr-only">Wallet</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <User className="h-4 w-4" />
                            <span className="sr-only">Profile</span>
                        </Button>
                    </div>
                </header>
                <Tabs
                    defaultValue="marketplace"
                    onValueChange={(value) => {
                        router.push("/" + value);
                    }}
                    className="w-full px-4 md:px-6"
                >
                    <TabsList className="w-full justify-start h-12 bg-transparent backdrop-blur-md rounded-lg overflow-hidden space-x-2">
                        <TabsTrigger 
                            value="marketplace" 
                            className={cn(
                                "transition-all duration-300 ease-in-out",
                                "data-[state=active]:bg-white/20 data-[state=active]:text-white",
                                "data-[state=inactive]:text-white/70 hover:bg-white/10"
                            )}
                        >
                            Marketplace
                        </TabsTrigger>
                        <TabsTrigger 
                            value="create" 
                            className={cn(
                                "transition-all duration-300 ease-in-out",
                                "data-[state=active]:bg-white/20 data-[state=active]:text-white",
                                "data-[state=inactive]:text-white/70 hover:bg-white/10"
                            )}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create
                        </TabsTrigger>
                        <TabsTrigger 
                            value="stats" 
                            className={cn(
                                "transition-all duration-300 ease-in-out",
                                "data-[state=active]:bg-white/20 data-[state=active]:text-white",
                                "data-[state=inactive]:text-white/70 hover:bg-white/10"
                            )}
                        >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Stats
                        </TabsTrigger>
                    </TabsList>
                    {children}
                </Tabs>
            </div>
        </main>
    );
}
