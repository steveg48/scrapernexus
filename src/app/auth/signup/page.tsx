'use client'

import AuthForm from '@/components/AuthForm'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <AuthForm isSignUp />
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <Link href="/auth" className="text-sm text-[#14a800] hover:text-[#14a800]/90">
          Sign in
        </Link>
      </div>
    </div>
  )
}
