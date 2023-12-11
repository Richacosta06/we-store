
export default function LogingLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <main className="bg-gray-100 min-h-screen">
      {children}
    </main>
  );
}