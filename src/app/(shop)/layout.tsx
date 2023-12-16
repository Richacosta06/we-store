import { Footer, Sidebar, TopMenu } from "@/components";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="bg-gray-100 min-h-screen pb-1">
            <TopMenu />
            <Sidebar/>

            <div className="px-0 sm:px-10">{children}</div>
            <Footer/>
        </main>
    );
}
