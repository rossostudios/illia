'use client'

import { useState } from 'react'

export default function AppFooter() {
  const [lang, setLang] = useState('EN')

  return (
    <footer className="border-teal-100 border-t bg-teal-50 px-4 py-4 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl space-y-2 text-center text-gray-600 text-sm dark:text-gray-400">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span>© 2025 Illia.club. All rights reserved.</span>
          <a className="underline hover:text-teal-600 dark:hover:text-teal-400" href="/privacy">
            Privacy
          </a>
          <a className="underline hover:text-teal-600 dark:hover:text-teal-400" href="/terms">
            Terms
          </a>
          <a className="underline hover:text-teal-600 dark:hover:text-teal-400" href="/support">
            Support
          </a>
        </div>
        <select
          aria-label="Select language"
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:ring-teal-400"
          onChange={(e) => setLang(e.target.value)}
          value={lang}
        >
          <option value="EN">English</option>
          <option value="ES">Español</option>
          <option value="PT">Português</option>
        </select>
      </div>
    </footer>
  )
}
