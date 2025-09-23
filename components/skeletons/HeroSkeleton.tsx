export default function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          <div className="space-y-8">
            <div className="h-8 w-48 bg-gray-200 rounded-full" />
            <div className="space-y-4">
              <div className="h-16 bg-gray-200 rounded w-3/4" />
              <div className="h-16 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="h-12 bg-gray-200 rounded w-full max-w-xl" />
            <div className="flex gap-4">
              <div className="h-14 w-40 bg-gray-200 rounded-xl" />
              <div className="h-14 w-40 bg-gray-200 rounded-xl" />
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
