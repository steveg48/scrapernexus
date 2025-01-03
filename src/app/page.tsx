'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function checkUserType() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      // Get user's role from their metadata
      const userRole = user.user_metadata.role

      if (userRole === 'buyer') {
        router.push('/buyer/dashboard')
      } else if (userRole === 'seller') {
        router.push('/seller/dashboard')
      } else {
        // If role is not set, default to auth page
        router.push('/auth')
      }
    }

    checkUserType()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}