import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PostJob() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const redirectUrl = new URL('/auth/login', 'http://localhost:3000')
    redirectUrl.searchParams.set('returnUrl', '/buyer/post-job')
    redirect(redirectUrl.toString())
  }

  redirect('/buyer/post-job/title')
}
