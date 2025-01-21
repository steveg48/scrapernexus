import SupabaseProvider from '@/components/providers/SupabaseProvider'

export default function BuyerLayout({
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
