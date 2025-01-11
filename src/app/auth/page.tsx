'use client'

import AuthForm from '@/components/AuthForm'
import Link from 'next/link'
import { CloudDownload } from 'lucide-react'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2">
          <span className="text-[24px] font-semibold text-[#3c8dd5]">
            ScrapeNexus
          </span>
          <CloudDownload className="h-10 w-10 text-[#FF69B4]" />
        </Link>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to ScrapeNexus
        </h2>
      </div>
      <AuthForm />
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <Link href="/auth/signup" className="text-sm text-[#14a800] hover:text-[#14a800]/90">
          Sign up
        </Link>
      </div>
    </div>
  )
}
