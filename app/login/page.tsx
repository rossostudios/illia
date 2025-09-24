'use client'

import { Eye, EyeOff } from 'lucide-react'
import { unstable_noStore } from 'next/cache'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaApple, FaGoogle, FaLinkedin } from 'react-icons/fa'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ToastProvider, useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

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

function LoginForm() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<'apple' | 'google' | 'linkedin' | null>(null)
  const [error, setError] = useState<string | Error | null>(null)
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
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      success('Welcome back!', 'You have successfully logged in.')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err)
      showError('Login failed', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'linkedin') => {
    setSocialLoading(provider)
    try {
      // Note: Apple provider isn't directly supported by Supabase
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'apple' ? 'google' : (provider as string),
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) {
        throw error
      }
    } catch (err: any) {
      setError(err)
      showError('Social login failed', err.message)
      setSocialLoading(null)
    }
    // Note: Don't reset socialLoading on success as the page will redirect
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Desktop: two columns, Mobile: stacked */}
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Auth Form */}
        <div className="flex items-center justify-center px-6 py-8 md:px-10 lg:px-16">
          <div className="w-full max-w-[480px] space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="font-semibold text-2xl text-gray-900 md:text-3xl dark:text-white">
                Login to your account
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Enter your details to login.</p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                aria-busy={socialLoading === 'apple'}
                aria-label="Sign in with Apple"
                className="relative flex h-12 min-h-[44px] items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
                disabled={loading || socialLoading !== null}
                onClick={() => handleSocialLogin('apple')}
                type="button"
                
              >
                {socialLoading === 'apple' ? (
                  <LoadingSpinner color="gray" size="sm" />
                ) : (
                  <FaApple className="text-xl" />
                )}
              </button>
              <button
                aria-busy={socialLoading === 'google'}
                aria-label="Sign in with Google"
                className="relative flex h-12 min-h-[44px] items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
                disabled={loading || socialLoading !== null}
                onClick={() => handleSocialLogin('google')}
                type="button"
                
              >
                {socialLoading === 'google' ? (
                  <LoadingSpinner color="gray" size="sm" />
                ) : (
                  <FaGoogle className="text-red-500 text-xl" />
                )}
              </button>
              <button
                aria-busy={socialLoading === 'linkedin'}
                aria-label="Sign in with LinkedIn"
                className="relative flex h-12 min-h-[44px] items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
                disabled={loading || socialLoading !== null}
                onClick={() => handleSocialLogin('linkedin')}
                type="button"
                
              >
                {socialLoading === 'linkedin' ? (
                  <LoadingSpinner color="gray" size="sm" />
                ) : (
                  <FaLinkedin className="text-blue-600 text-xl" />
                )}
              </button>
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-gray-300 border-t dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  OR
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <ErrorMessage error={error} variant="banner" />}

              <div className="space-y-4">
                <div>
                  <label
                    className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
                    htmlFor="email"
                  >
                    Email Address
                    <span aria-label="required" className="ml-0.5 text-red-500">
                      *
                    </span>
                  </label>
                  <input
                    aria-describedby={error ? 'email-error' : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                    autoComplete="email"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
                    htmlFor="password"
                  >
                    Password
                    <span aria-label="required" className="ml-0.5 text-red-500">
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      aria-describedby={error ? 'password-error' : undefined}
                      aria-invalid={error ? 'true' : 'false'}
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                      id="password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                    />
                    <button
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none dark:text-gray-400 dark:focus:text-gray-300 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    checked={rememberMe}
                    className="h-4 w-4 rounded border-gray-300 bg-white text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-teal-400"
                    onChange={(e) => setRememberMe(e.target.checked)}
                    type="checkbox"
                  />
                  <span className="ml-2 text-gray-700 text-sm dark:text-gray-300">Remember me</span>
                </label>
                <Link
                  className="text-gray-700 text-sm hover:text-gray-900 focus:underline focus:outline-none dark:text-gray-300 dark:hover:text-white"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 font-medium text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-600 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:bg-teal-700"
                disabled={loading}
                type="submit"
              >
                {loading && <LoadingSpinner color="white" size="sm" />}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Sign up link */}
            <p className="text-center text-gray-600 text-sm dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                className="font-medium text-gray-900 hover:underline focus:underline focus:outline-none"
                href="/signup"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column - Testimonial */}
        <div className="hidden items-center justify-center bg-gradient-to-br from-warmth-50 to-white px-6 py-12 md:px-10 lg:flex lg:px-16 xl:px-24">
          <div className="w-full max-w-4xl">
            <div className="space-y-8">
              {/* Avatar */}
              <div className="flex justify-start">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-teal-400 to-teal-600">
                  {testimonials[currentTestimonial].avatar ? (
                    <img
                      alt={testimonials[currentTestimonial].name}
                      className="h-full w-full object-cover"
                      src={testimonials[currentTestimonial].avatar}
                    />
                  ) : (
                    <span className="font-semibold text-2xl text-white">
                      {testimonials[currentTestimonial].initials}
                    </span>
                  )}
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote>
                <p className="font-semibold text-3xl text-gray-900 leading-tight lg:text-4xl xl:text-5xl">
                  "{testimonials[currentTestimonial].quote}"
                </p>
              </blockquote>

              {/* Author */}
              <div className="pt-4">
                <p className="font-semibold text-gray-900 text-lg">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-gray-600">{testimonials[currentTestimonial].title}</p>
              </div>

              {/* Pagination dots */}
              <div className="flex gap-2 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      currentTestimonial === index
                        ? 'w-8 bg-teal-600'
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - positioned absolutely */}
      <div className="absolute bottom-4 left-6 text-gray-500 text-sm">© 2025 Illia.club</div>
    </div>
  )
}

export default function LoginPage() {
  // Prevent static generation for this page
  unstable_noStore()

  return (
    <ToastProvider>
      <LoginForm />
    </ToastProvider>
  )
}

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'
