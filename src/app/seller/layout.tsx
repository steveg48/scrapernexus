import SupabaseProvider from '@/components/providers/SupabaseProvider'

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  )
}
