'use client'

import { CheckCircle, Loader2, Upload, User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const CITIES = [
  { value: 'medellin', label: 'Medellín, Colombia' },
  { value: 'florianopolis', label: 'Florianópolis, Brazil' },
]

const SERVICES = [
  { value: 'cleaning', label: 'House Cleaning' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'meal_prep', label: 'Meal Prep' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'pet_care', label: 'Pet Care' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'other', label: 'Other' },
]

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
]

export default function ProviderOnboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    city: 'medellin',
    services: [] as string[],
    languages: ['spanish'] as string[],
    specialties: '',
    rate_hourly: '',
    rate_weekly: '',
    rate_monthly: '',
    currency: 'COP',
    years_experience: '',
    whatsapp_number: '',
    email: '',
    phone: '',
    photo: null as File | null,
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo must be less than 5MB', {
          description: 'Please choose a smaller image file',
        })
        return
      }
      setFormData({ ...formData, photo: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!(formData.name && formData.bio && formData.email)) {
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (formData.services.length === 0) {
        toast.error('Please select at least one service')
        setLoading(false)
        return
      }

      if (formData.languages.length === 0) {
        toast.error('Please select at least one language')
        setLoading(false)
        return
      }

      let avatarUrl = null

      // Upload photo if provided
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `provider-avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, formData.photo)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(filePath)

        avatarUrl = publicUrl
      }

      // Insert provider data
      const { error: insertError } = await supabase
        .from('service_providers')
        .insert({
          name: formData.name,
          bio: formData.bio,
          avatar_url: avatarUrl,
          city: formData.city as 'medellin' | 'florianopolis',
          languages: formData.languages as (
            | 'english'
            | 'spanish'
            | 'portuguese'
            | 'french'
            | 'german'
            | 'italian'
          )[],
          services: formData.services as (
            | 'cleaning'
            | 'cooking'
            | 'meal_prep'
            | 'childcare'
            | 'pet_care'
            | 'gardening'
            | 'handyman'
            | 'other'
          )[],
          specialties: formData.specialties
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          rate_hourly: formData.rate_hourly ? Number.parseFloat(formData.rate_hourly) : null,
          rate_weekly: formData.rate_weekly ? Number.parseFloat(formData.rate_weekly) : null,
          rate_monthly: formData.rate_monthly ? Number.parseFloat(formData.rate_monthly) : null,
          currency: formData.currency,
          years_experience: formData.years_experience
            ? Number.parseInt(formData.years_experience, 10)
            : null,
          whatsapp_number: formData.whatsapp_number,
          email: formData.email,
          phone: formData.phone,
          status: 'pending' as 'pending' | 'verified' | 'suspended',
        })
        .select()

      if (insertError) {
        throw insertError
      }

      setSuccess(true)
      toast.success('Application submitted successfully!', {
        description: "We'll review your application and get back to you within 24-48 hours.",
      })

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/providers/success')
      }, 3000)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong', {
        description: 'Please try again or contact support',
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-white p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-2 font-bold text-2xl text-gray-900">Application Submitted!</h1>
          <p className="mb-4 text-gray-600">
            Thank you for joining Illia.club! We'll review your application and get back to you
            within 24-48 hours.
          </p>
          <p className="text-gray-500 text-sm">Redirecting you to the success page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-2 font-bold text-3xl text-gray-900">Become a Service Provider</h1>
          <p className="mb-8 text-gray-600">
            Join Illia.club and connect with expats in Medellín and Florianópolis. Get approved and
            receive a $50 bonus after your first completed service!
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Photo Upload */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm">Profile Photo</label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      alt="Preview"
                      className="h-24 w-24 rounded-full object-cover"
                      src={photoPreview}
                    />
                    <button
                      className="-top-2 -right-2 absolute rounded-full bg-red-500 p-1 text-white"
                      onClick={() => {
                        setPhotoPreview(null)
                        setFormData({ ...formData, photo: null })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                    type="file"
                  />
                  <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                    <Upload className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700 text-sm">Upload Photo</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm">Full Name *</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="María Rodríguez"
                required
                type="text"
                value={formData.name}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm">About You *</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about your experience, what makes you special, and why expats love working with you..."
                required
                rows={4}
                value={formData.bio}
              />
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm">City *</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                value={formData.city}
              >
                {CITIES.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Services */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm">
                Services You Offer *
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {SERVICES.map((service) => (
                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                      formData.services.includes(service.value)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                    key={service.value}
                  >
                    <input
                      checked={formData.services.includes(service.value)}
                      className="sr-only"
                      onChange={() => handleServiceToggle(service.value)}
                      type="checkbox"
                    />
                    <span className="text-sm">{service.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm">
                Languages You Speak *
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {LANGUAGES.map((language) => (
                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                      formData.languages.includes(language.value)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                    key={language.value}
                  >
                    <input
                      checked={formData.languages.includes(language.value)}
                      className="sr-only"
                      onChange={() => handleLanguageToggle(language.value)}
                      type="checkbox"
                    />
                    <span className="text-sm">{language.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm">
                Specialties (comma-separated)
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                placeholder="eco-friendly, pet-friendly, vegan cooking, etc."
                type="text"
                value={formData.specialties}
              />
            </div>

            {/* Rates */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm">
                Your Rates ({formData.city === 'medellin' ? 'COP' : 'BRL'})
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-gray-600 text-xs">Hourly</label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setFormData({ ...formData, rate_hourly: e.target.value })}
                    placeholder="50000"
                    type="number"
                    value={formData.rate_hourly}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-600 text-xs">Weekly</label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setFormData({ ...formData, rate_weekly: e.target.value })}
                    placeholder="180000"
                    type="number"
                    value={formData.rate_weekly}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-600 text-xs">Monthly</label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setFormData({ ...formData, rate_monthly: e.target.value })}
                    placeholder="650000"
                    type="number"
                    value={formData.rate_monthly}
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm">
                Years of Experience
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                placeholder="5"
                type="number"
                value={formData.years_experience}
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Contact Information</h3>

              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">Email *</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="maria@email.com"
                  required
                  type="email"
                  value={formData.email}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">
                  WhatsApp Number
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="+57 300 123 4567"
                  type="text"
                  value={formData.whatsapp_number}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">Phone Number</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+57 300 123 4567"
                  type="text"
                  value={formData.phone}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3 font-medium text-white transition-all hover:from-teal-700 hover:to-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
