import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function PostJob() {
  redirect('/buyer/post-job/title')
}
