'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaApple, FaGoogle, FaLinkedin } from 'react-icons/fa'
import { supabase } from '@/utils/supabase/client'

const testimonials = [
  {
    quote:
      'Illia.club saved my sanity in my first month in Medellín—found a reliable cleaner who cooks amazing arepas too. No more FB group hunts!',
    name: 'Sarah M.',
    title: 'Digital Nomad Mom, Medellín',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    initials: 'SM',
  },
  {
    quote:
      'As a retiree in Floripa, trusting local help was tough—Illia matched me with an English-speaking cook. Hired on day 3, total game-changer.',
    name: 'Mike D.',
    title: 'Retiree, Florianópolis',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    initials: 'MD',
  },
  {
    quote:
      "From visa stress to seamless setup: Illia's vetted pros made our move to Medellín feel like home. Unlimited matches for the win!",
    name: 'Emma & Alex',
    title: 'Remote Couple, Medellín',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    initials: 'EA',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'linkedin') => {
    try {
      // Note: Apple provider isn't directly supported by Supabase
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'apple' ? 'google' : (provider as any),
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop: two columns, Mobile: stacked */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Auth Form */}
        <div className="flex items-center justify-center px-6 md:px-10 lg:px-16 py-8">
          <div className="w-full max-w-[480px] space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Login to your account
              </h1>
              <p className="text-gray-600">Enter your details to login.</p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialLogin('apple')}
                disabled={loading}
                aria-label="Sign in with Apple"
                className="flex items-center justify-center h-12 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaApple className="text-xl" />
              </button>
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                aria-label="Sign in with Google"
                className="flex items-center justify-center h-12 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="text-xl text-red-500" />
              </button>
              <button
                onClick={() => handleSocialLogin('linkedin')}
                disabled={loading}
                aria-label="Sign in with LinkedIn"
                className="flex items-center justify-center h-12 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaLinkedin className="text-xl text-blue-600" />
              </button>
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">OR</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                >
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                    <span className="text-red-500 ml-0.5" aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'email-error' : undefined}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    placeholder="hello@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                    <span className="text-red-500 ml-0.5" aria-label="required">
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={error ? 'true' : 'false'}
                      aria-describedby={error ? 'password-error' : undefined}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-gray-900 hover:underline focus:outline-none focus:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column - Testimonial */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-warmth-50 to-white px-6 md:px-10 lg:px-16 xl:px-24 py-12">
          <div className="max-w-4xl w-full">
            <div className="space-y-8">
              {/* Avatar */}
              <div className="flex justify-start">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                  {testimonials[currentTestimonial].avatar ? (
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-white">
                      {testimonials[currentTestimonial].initials}
                    </span>
                  )}
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote>
                <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight text-gray-900">
                  "{testimonials[currentTestimonial].quote}"
                </p>
              </blockquote>

              {/* Author */}
              <div className="pt-4">
                <p className="font-semibold text-lg text-gray-900">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-gray-600">{testimonials[currentTestimonial].title}</p>
              </div>

              {/* Pagination dots */}
              <div className="flex gap-2 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentTestimonial === index
                        ? 'w-8 bg-teal-600'
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - positioned absolutely */}
      <div className="absolute bottom-4 left-6 text-sm text-gray-500">© 2025 Illia.club</div>
    </div>
  )
}
