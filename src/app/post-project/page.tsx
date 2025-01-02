import Image from 'next/image'
import Link from 'next/link'

export default function PostProject() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
              Post a job today,
              <br />
              hire tomorrow
            </h1>
            <p className="text-xl text-gray-600">
              Connect with talent that gets you, and hire them to take
              your business to the next level.
            </p>
            <Link 
              href="/auth"
              className="inline-block bg-green-600 text-white text-lg font-medium px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/images/tablet-user.jpg"
              alt="Person using tablet"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-2xl"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  )
}
