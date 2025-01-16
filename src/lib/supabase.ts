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

let browserClient: ReturnType<typeof createClientComponentClient> | null = null;

// Use this in client components
export const createBrowserClient = () => {
  if (typeof window === 'undefined') {
    return null; // Return null if we're on the server side
  }

  if (!browserClient) {
    browserClient = createClientComponentClient({
      options: {
        auth: {
          persistSession: true,
          storageKey: 'supabase-auth',
          storage: {
            getItem: (key) => {
              try {
                return localStorage.getItem(key)
              } catch (error) {
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

  return browserClient;
}