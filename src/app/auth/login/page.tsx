import AuthForm from '@/components/AuthForm'
import Link from 'next/link'
import { CloudDownload } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col py-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-12">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <span className="text-[24px] font-semibold text-[#3c8dd5]">
            ScrapeNexus
          </span>
          <CloudDownload className="h-10 w-10 text-[#FF69B4]" />
        </Link>
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm isSignUp={false} />
        </div>
      </div>
    </div>
  )
}
