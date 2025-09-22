"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Illia.club
                </span>
              </div>
            </Link>

            <div className="ml-10 hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-900 hover:text-green-600 text-sm font-semibold transition-colors">
                Home
              </Link>
              <Link href="/features" className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="/dashboard/explore" className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors">
                Explore
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-green-600 text-sm font-medium transition-colors">
                Blog
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/dashboard/explore"
              className="text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Find Your Helper Today
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}