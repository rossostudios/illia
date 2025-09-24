'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaApple, FaGoogle, FaLinkedin } from 'react-icons/fa'
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

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      setError('Please accept the terms and conditions')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        throw error
      }
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
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop: two columns, Mobile: stacked */}
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Auth Form */}
        <div className="flex items-center justify-center px-6 py-8 md:px-10 lg:px-16">
          <div className="w-full max-w-[480px] space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="font-semibold text-2xl text-gray-900 md:text-3xl">
                Create your account
              </h1>
              <p className="text-gray-600">Enter your details to get started.</p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                aria-label="Sign up with Apple"
                className="flex h-12 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
                onClick={() => handleSocialLogin('apple')}
                type="button"
              >
                <FaApple className="text-xl" />
              </button>
              <button
                aria-label="Sign up with Google"
                className="flex h-12 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
                onClick={() => handleSocialLogin('google')}
                type="button"
              >
                <FaGoogle className="text-red-500 text-xl" />
              </button>
              <button
                aria-label="Sign up with LinkedIn"
                className="flex h-12 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
                onClick={() => handleSocialLogin('linkedin')}
                type="button"
              >
                <FaLinkedin className="text-blue-600 text-xl" />
              </button>
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-gray-300 border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">OR</span>
              </div>
            </div>

            {/* Signup Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div
                  aria-live="polite"
                  className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-medium text-gray-700 text-sm" htmlFor="email">
                    Email Address
                    <span aria-label="required" className="ml-0.5 text-red-500">
                      *
                    </span>
                  </label>
                  <input
                    aria-describedby={error ? 'email-error' : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                    autoComplete="email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                    className="mb-1 block font-medium text-gray-700 text-sm"
                    htmlFor="password"
                  >
                    Password
                    <span aria-label="required" className="ml-0.5 text-red-500">
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      aria-describedby="password-requirements"
                      aria-invalid={error ? 'true' : 'false'}
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                      className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-gray-500 text-xs" id="password-requirements">
                    Must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label
                    className="mb-1 block font-medium text-gray-700 text-sm"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                    <span aria-label="required" className="ml-0.5 text-red-500">
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      aria-invalid={error ? 'true' : 'false'}
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                    />
                    <button
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  aria-describedby="terms-description"
                  checked={acceptTerms}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  id="terms"
                  name="terms"
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  type="checkbox"
                />
                <label
                  className="ml-2 text-gray-700 text-sm"
                  htmlFor="terms"
                  id="terms-description"
                >
                  I agree to the{' '}
                  <Link
                    className="font-medium text-gray-900 hover:underline focus:underline focus:outline-none"
                    href="/terms"
                  >
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link
                    className="font-medium text-gray-900 hover:underline focus:underline focus:outline-none"
                    href="/privacy"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                className="w-full rounded-lg bg-gray-900 py-3 font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading || !acceptTerms}
                type="submit"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                className="font-medium text-gray-900 hover:underline focus:underline focus:outline-none"
                href="/login"
              >
                Sign in
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
