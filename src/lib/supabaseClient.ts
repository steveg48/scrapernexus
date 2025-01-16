import { createBrowserClient } from '@/lib/supabase'

// Create a single instance of the Supabase client
const supabaseClient = createBrowserClient()

export default supabaseClient
