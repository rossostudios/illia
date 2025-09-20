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
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-2xl">🔥</span>
                <span className="ml-2 text-xl font-semibold">Firecrawl</span>
              </div>
            </Link>

            <div className="ml-10 flex items-center space-x-8">
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center"
                  onMouseEnter={() => setActiveDropdown('products')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'products' && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg py-2"
                    onMouseEnter={() => setActiveDropdown('products')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link href="/scrape" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Scrape</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Search</Link>
                    <Link href="/crawl" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Crawl</Link>
                    <Link href="/map" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Map</Link>
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
                >
                  Extract
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'extract' && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg py-2"
                    onMouseEnter={() => setActiveDropdown('extract')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link href="/extract/schema" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Extract with Schema</Link>
                    <Link href="/extract/llm" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">LLM Extract</Link>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center"
                  onMouseEnter={() => setActiveDropdown('resources')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeDropdown === 'resources' && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg py-2"
                    onMouseEnter={() => setActiveDropdown('resources')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link href="/community" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Community</Link>
                    <Link href="/changelog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Changelog</Link>
                    <Link href="/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Support</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <Github className="h-5 w-5" />
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