import SupabaseProvider from '@/components/providers/SupabaseProvider'
import Navigation from '@/components/Navigation'

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupabaseProvider>
      <Navigation />
      <main>
        {children}
      </main>
    </SupabaseProvider>
  )
}
