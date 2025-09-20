"use client";

import Link from "next/link";
import { Github, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex items-center">
                <span className="text-xl md:text-2xl font-bold text-teal-800 drop-shadow-sm transition-all group-hover:text-teal-900 group-hover:drop-shadow-md">
                  Illia
                </span>
              </div>
            </Link>

            <div className="ml-10 flex items-center space-x-8">
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center"
                  onMouseEnter={() => setActiveDropdown('products')}
                  onMouseLeave={() => setActiveDropdown(null)}
                  aria-expanded={activeDropdown === 'products'}
                  aria-haspopup="true"
                  aria-label="Products menu"
                >
                  Products
                  <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                </button>
                {activeDropdown === 'products' && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg py-2"
                    onMouseEnter={() => setActiveDropdown('products')}
                    onMouseLeave={() => setActiveDropdown(null)}
                    role="menu"
                    aria-label="Products submenu"
                  >
                    <Link href="/scrape" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Scrape</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Search</Link>
                    <Link href="/crawl" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Crawl</Link>
                    <Link href="/map" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Map</Link>
                  </div>
                )}
              </div>
              <Link href="/playground" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Playground
              </Link>
              <Link href="/docs" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Docs
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Pricing
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Blog
              </Link>
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center"
                  onMouseEnter={() => setActiveDropdown('extract')}
                  onMouseLeave={() => setActiveDropdown(null)}
                  aria-expanded={activeDropdown === 'extract'}
                  aria-haspopup="true"
                  aria-label="Extract menu"
                >
                  Extract
                  <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                </button>
                {activeDropdown === 'extract' && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg py-2"
                    onMouseEnter={() => setActiveDropdown('extract')}
                    onMouseLeave={() => setActiveDropdown(null)}
                    role="menu"
                    aria-label="Extract submenu"
                  >
                    <Link href="/extract/schema" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Extract with Schema</Link>
                    <Link href="/extract/llm" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">LLM Extract</Link>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center"
                  onMouseEnter={() => setActiveDropdown('resources')}
                  onMouseLeave={() => setActiveDropdown(null)}
                  aria-expanded={activeDropdown === 'resources'}
                  aria-haspopup="true"
                  aria-label="Resources menu"
                >
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                </button>
                {activeDropdown === 'resources' && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg py-2"
                    onMouseEnter={() => setActiveDropdown('resources')}
                    onMouseLeave={() => setActiveDropdown(null)}
                    role="menu"
                    aria-label="Resources submenu"
                  >
                    <Link href="/community" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Community</Link>
                    <Link href="/changelog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Changelog</Link>
                    <Link href="/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Support</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              aria-label="GitHub repository - 52.4K stars"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">52.4K</span>
            </a>
            <Link
              href="/signup"
              className="text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}