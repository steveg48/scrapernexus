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

// Create a singleton instance for the browser client
let browserInstance: ReturnType<typeof createClientComponentClient> | null = null

// Use this in client components
export const createBrowserClient = () => {
  if (typeof window === 'undefined') return null
  if (!browserInstance) {
    browserInstance = createClientComponentClient()
  }
  return browserInstance
}

export const getBrowserClient = createBrowserClient