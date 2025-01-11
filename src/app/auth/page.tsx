'use client'

import AuthForm from '@/components/AuthForm'
import Link from 'next/link'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
