import SellerNavigation from '@/components/SellerNavigation';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SellerNavigation />
      <main>
        <div className="max-w-5xl mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
}
