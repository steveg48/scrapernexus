import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Only use in server components or API routes
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
)

// Use this in client components
export const createBrowserClient = () => {
  return createClientComponentClient({
    options: {
      auth: {
        persistSession: true,
        storageKey: 'supabase-auth',
        storage: {
          getItem: (key) => {
            try {
              const value = localStorage.getItem(key)
              return value
            } catch (error) {
              // Handle cases where localStorage is not available
              console.warn('LocalStorage not available:', error)
              return null
            }
          },
          setItem: (key, value) => {
            try {
              localStorage.setItem(key, value)
            } catch (error) {
              console.warn('LocalStorage not available:', error)
            }
          },
          removeItem: (key) => {
            try {
              localStorage.removeItem(key)
            } catch (error) {
              console.warn('LocalStorage not available:', error)
            }
          },
        },
      },
    },
  })
}