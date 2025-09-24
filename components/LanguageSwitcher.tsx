'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ]

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="group relative">
      <button
        aria-label="Change language"
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <span className="sm:hidden">{languages.find((lang) => lang.code === locale)?.flag}</span>
        <span className="hidden sm:inline">
          {languages.find((lang) => lang.code === locale)?.flag}{' '}
          {languages.find((lang) => lang.code === locale)?.name}
        </span>
      </button>

      <div className="absolute right-0 z-50 mt-2 hidden w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block">
        <div className="py-1">
          {languages.map((lang) => (
            <button
              className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                locale === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
