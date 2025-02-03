import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function PostJob() {
  const cookieStore = cookies()

  const {
    data: { session },
  } = await supabaseServer.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  redirect('/buyer/post-job/title')
}
