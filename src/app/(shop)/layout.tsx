import { Footer, Sidebar, TopMenu } from "@/components";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="bg-gray-100 min-h-screen pb-1">
            <div className="flex flex-col min-h-screen bg-gray-100">
                <TopMenu />
                <Sidebar />

                
                <main className="flex-grow px-0 sm:px-10">
                    {children}
                </main>

                <Footer />
            </div>
        </main>
    );
}
