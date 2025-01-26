import { getBrowserClient } from '@/lib/supabase'

// Create a single instance of the Supabase client
const supabaseClient = getBrowserClient()

export default supabaseClient
