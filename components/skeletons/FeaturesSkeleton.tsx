export default function FeaturesSkeleton() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-8 w-40 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-gray-200 rounded-xl mb-6" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
