import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Only use in server components or API routes
export const supabaseServer = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
  }
)

// Use this in client components
export const createBrowserClient = () => {
  return createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
    options: {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb:token',
        debug: true
      },
      global: {
        headers: {
          'X-Client-Info': '@supabase/auth-helpers-nextjs'
        },
      },
    },
  })
}

// Create a singleton instance for the browser client
let browserInstance: ReturnType<typeof createClientComponentClient> | null = null

export const getBrowserClient = () => {
  if (typeof window === 'undefined') return null
  if (!browserInstance) {
    browserInstance = createBrowserClient()
  }
  return browserInstance
}