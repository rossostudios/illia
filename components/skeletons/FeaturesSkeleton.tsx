export default function FeaturesSkeleton() {
  return (
    <section className="animate-pulse bg-gradient-to-b from-white via-gray-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mx-auto mb-4 h-8 w-40 rounded-full bg-gray-200" />
          <div className="mx-auto mb-4 h-12 w-96 rounded bg-gray-200" />
          <div className="mx-auto h-6 w-2/3 rounded bg-gray-200" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...new Array(6)].map((_, i) => (
            <div className="rounded-2xl bg-white p-8 shadow-sm" key={i}>
              <div className="mb-6 h-14 w-14 rounded-xl bg-gray-200" />
              <div className="mb-3 h-6 w-3/4 rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
