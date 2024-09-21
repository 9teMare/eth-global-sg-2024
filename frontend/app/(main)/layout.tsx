"use client";

import { BarChart3, Bell, Plus, Search, User, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import WorldIdModal from "@/components/world-id-modal";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: ReactNode }) {
    const router = useRouter();
    return (
        <main className="flex flex-col min-h-screen bg-white dark:bg-background items-center border-b pb-6">
            <header className="flex items-center w-full h-16 px-4 md:px-6">
                <nav className="flex-1 flex items-center space-x-4 lg:space-x-6">
                    <div className="font-bold text-xl text-primary">Meme That Matters</div>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
                        <Input className="pl-8" placeholder="Search memes..." type="search" />
                    </div>
                </nav>
                <div className="flex items-center space-x-4 text-primary">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Wallet className="h-4 w-4" />
                        <span className="sr-only">Wallet</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                        <span className="sr-only">Profile</span>
                    </Button>
                    <WorldIdModal />
                </div>
            </header>
            <Tabs
                defaultValue="marketplace"
                onValueChange={(value) => {
                    router.push("/" + value);
                }}
                className="w-full px-4 md:px-6"
            >
                <TabsList className="w-full justify-start h-12 bg-transparent">
                    <TabsTrigger value="marketplace" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Marketplace
                    </TabsTrigger>
                    <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Plus className="h-4 w-4 mr-2" />
                        Create
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Stats
                    </TabsTrigger>
                </TabsList>

                <Separator />

                {children}
            </Tabs>
        </main>
    );
}
