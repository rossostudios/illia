export default function HeroSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          <div className="space-y-8">
            <div className="h-8 w-48 rounded-full bg-gray-200" />
            <div className="space-y-4">
              <div className="h-16 w-3/4 rounded bg-gray-200" />
              <div className="h-16 w-2/3 rounded bg-gray-200" />
            </div>
            <div className="h-12 w-full max-w-xl rounded bg-gray-200" />
            <div className="flex gap-4">
              <div className="h-14 w-40 rounded-xl bg-gray-200" />
              <div className="h-14 w-40 rounded-xl bg-gray-200" />
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="aspect-[4/3] rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
