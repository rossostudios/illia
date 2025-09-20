'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Github } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('signup')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Set demo login flag
    sessionStorage.setItem('isLoggedIn', 'true')
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-orange-600">IL</span>
              <span className="text-2xl font-semibold">Illia</span>
            </Link>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            {/* Tab switcher */}
            <div className="flex mb-8">
              <button
                className={`flex-1 pb-3 text-center font-medium transition-all ${
                  activeTab === 'login'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 border-b border-gray-200'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Log In
              </button>
              <button
                className={`flex-1 pb-3 text-center font-medium transition-all ${
                  activeTab === 'signup'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 border-b border-gray-200'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {activeTab === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Social auth buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem('isLoggedIn', 'true')
                  window.location.href = '/dashboard'
                }}
                className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Github className="h-5 w-5" />
                <span>Continue with GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem('isLoggedIn', 'true')
                  window.location.href = '/dashboard'
                }}
                className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-gray-500">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-orange-600">IL</span>
              <span className="text-xl font-semibold">Illia</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>curated by</span>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                <span className="font-semibold text-white">Mobbin</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}