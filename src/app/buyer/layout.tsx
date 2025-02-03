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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {children}
      </div>
    </SupabaseProvider>
  )
}
