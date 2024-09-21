import { TabsContent } from "@/components/ui/tabs";

export default function Page() {
    return (
        <TabsContent value="stats">
            <div className="flex items-center justify-center h-full">
                <h2 className="text-2xl font-bold">Stats</h2>
            </div>
        </TabsContent>
    );
}
