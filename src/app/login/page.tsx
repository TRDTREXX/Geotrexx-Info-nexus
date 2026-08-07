import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Sign In | GEOTREXX',
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-[#1a1b23] p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
        
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <img src="/geotrexx-logo.png" alt="GEOTREXX" className="h-16 w-16 mx-auto object-cover rounded-full shadow-md bg-gray-100 dark:bg-gray-800 p-1" />
          </Link>
          <h2 className="text-3xl font-black uppercase tracking-widest text-gray-900 dark:text-white">Sign In</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">Access your premium analytics and saved articles.</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#0a0b10] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent transition-colors shadow-sm" 
              placeholder="editor@geotrexx.com" 
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-bold text-[#C8102E] hover:opacity-80 transition-opacity">Forgot Password?</a>
            </div>
            <input 
              type="password" 
              required 
              className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#0a0b10] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent transition-colors shadow-sm" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="button" 
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-md text-sm font-black uppercase tracking-widest text-white bg-[#C8102E] hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8102E] transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <Link href="/subscribe" className="font-bold text-[#C8102E] hover:underline">Subscribe Now</Link>
        </div>
      </div>
    </div>
  )
}