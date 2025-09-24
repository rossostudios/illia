'use client'

import { useState } from 'react'

export default function AppFooter() {
  const [lang, setLang] = useState('EN')

  return (
    <footer className="border-gray-900 border-t bg-gray-900 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-sm sm:flex-row sm:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/70">
          <span>© 2025 Illia.club. All rights reserved.</span>
          <a className="transition hover:text-white" href="/privacy">
            Privacy
          </a>
          <a className="transition hover:text-white" href="/terms">
            Terms
          </a>
          <a className="transition hover:text-white" href="/support">
            Support
          </a>
        </div>
        <select
          aria-label="Select language"
          className="rounded-full border border-white/20 bg-gray-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
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
