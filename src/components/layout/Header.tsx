import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Windsurf
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`nav-link ${router.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}>
            Home
          </Link>
          <Link href="/post-project" className={`nav-link ${router.pathname === '/post-project' ? 'text-blue-600' : 'text-gray-600'}`}>
            Post a Project
          </Link>
          <Link href="/find-work" className={`nav-link ${router.pathname === '/find-work' ? 'text-blue-600' : 'text-gray-600'}`}>
            Find Work
          </Link>
          <Link href="/how-it-works" className={`nav-link ${router.pathname === '/how-it-works' ? 'text-blue-600' : 'text-gray-600'}`}>
            How It Works
          </Link>
        </div>

        {/* Right Side - Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-800">
            Login
          </Link>
          <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Sign Up
          </Link>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
