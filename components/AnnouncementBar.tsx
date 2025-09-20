import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-2">
      <div className="flex items-center justify-center text-sm">
        <span className="text-gray-700">
          We just raised our Series A and shipped Illia v2.{' '}
          <Link href="/blog" className="font-semibold text-orange-600 hover:text-orange-700">
            Read the blog
          </Link>
        </span>
      </div>
    </div>
  )
}