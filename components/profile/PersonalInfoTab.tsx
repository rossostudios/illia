'use client'

import { Camera, ChevronDown, Globe, Mail, MapPin, UserCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { LANGUAGES, type UserProfile } from '@/types/profile'

type PersonalInfoTabProps = {
  profile: UserProfile
  onUpdate: (updates: Partial<UserProfile>) => void
}

export function PersonalInfoTab({ profile, onUpdate }: PersonalInfoTabProps) {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio,
    city: profile.city,
    language: profile.language,
  })

  const handleSave = () => {
    onUpdate(formData)
  }

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div>
        <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
          Profile Photo
        </label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20">
            <Image
              alt="Profile"
              className="rounded-full object-cover"
              fill
              sizes="80px"
              src={profile.avatar}
            />
            <button className="absolute right-0 bottom-0 rounded-full bg-teal-600 p-2 text-white shadow-lg hover:bg-teal-700">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <Button size="sm" variant="outline">
              Upload New Photo
            </Button>
            <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
              JPG, GIF or PNG. Max size 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
          <UserCircle className="mr-2 inline h-4 w-4" />
          Full Name
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          type="text"
          value={formData.name}
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
          <Mail className="mr-2 inline h-4 w-4" />
          Email Address
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
          disabled
          type="email"
          value={profile.email}
        />
        <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
          Contact support to change your email
        </p>
      </div>

      {/* Bio */}
      <div>
        <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
          Bio
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
          rows={4}
          value={formData.bio}
        />
        <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
          Brief description for your profile
        </p>
      </div>

      {/* City */}
      <div>
        <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
          <MapPin className="mr-2 inline h-4 w-4" />
          City
        </label>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          value={formData.city}
        >
          <option value="medellin">Medellín</option>
          <option value="florianopolis">Florianópolis</option>
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
          <Globe className="mr-2 inline h-4 w-4" />
          Language
        </label>
        <div className="relative">
          <button
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-left focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          >
            <span className="flex items-center gap-2 text-gray-900 dark:text-white">
              <span>{LANGUAGES.find((l) => l.code === formData.language)?.flag}</span>
              {LANGUAGES.find((l) => l.code === formData.language)?.label}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {showLanguageDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {LANGUAGES.map((lang) => (
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  key={lang.code}
                  onClick={() => {
                    setFormData({ ...formData, language: lang.code })
                    setShowLanguageDropdown(false)
                  }}
                >
                  <span>{lang.flag}</span>
                  <span className="text-gray-900 dark:text-white">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}
