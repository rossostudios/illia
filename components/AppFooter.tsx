'use client'

import { useState } from 'react'

export default function AppFooter() {
  const [lang, setLang] = useState('EN')

  return (
    <footer className="bg-teal-50 border-t border-teal-100 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 space-y-2">
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <span>© 2025 Illia.club. All rights reserved.</span>
          <a href="/privacy" className="hover:text-teal-600 underline">Privacy</a>
          <a href="/terms" className="hover:text-teal-600 underline">Terms</a>
          <a href="/support" className="hover:text-teal-600 underline">Support</a>
        </div>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Select language"
        >
          <option value="EN">English</option>
          <option value="ES">Español</option>
          <option value="PT">Português</option>
        </select>
      </div>
    </footer>
  )
}