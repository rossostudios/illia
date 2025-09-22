'use client'

export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Gradient Text */}
        <header className="text-center space-y-4 animate-in">
          <h1 className="text-gradient">Tailwind CSS v4 Optimized</h1>
          <p className="text-gray-600 text-lg">Modern styling with Illia's brand colors</p>
        </header>

        {/* Component Showcase */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Buttons */}
          <div className="card hover-lift">
            <h3 className="mb-4">Button Styles</h3>
            <div className="space-y-3">
              <button className="btn-primary w-full">Primary Button</button>
              <button className="btn-secondary w-full">Secondary Button</button>
              <button className="btn-outline w-full">Outline Button</button>
            </div>
          </div>

          {/* Badges */}
          <div className="card hover-lift">
            <h3 className="mb-4">Badge Components</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge-success">Success</span>
              <span className="badge-warning">Warning</span>
              <span className="badge-error">Error</span>
              <span className="badge bg-primary-100 text-primary-800">Custom</span>
            </div>
          </div>

          {/* Input Fields */}
          <div className="card hover-lift">
            <h3 className="mb-4">Form Inputs</h3>
            <div className="space-y-3">
              <input type="text" className="input" placeholder="Standard input field" />
              <textarea className="input min-h-[100px]" placeholder="Textarea with same styling" />
            </div>
          </div>

          {/* Glass Morphism Card */}
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600" />
            <div className="relative glass p-6 text-white">
              <h3 className="mb-2 text-white">Glass Morphism</h3>
              <p className="text-white/90 text-sm">Modern glassmorphic design with backdrop blur</p>
            </div>
          </div>

          {/* Loading States */}
          <div className="card hover-lift">
            <h3 className="mb-4">Loading States</h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="spinner w-8 h-8" />
              <div className="spinner w-10 h-10" />
              <div className="spinner w-12 h-12" />
            </div>
          </div>

          {/* Typography */}
          <div className="card hover-lift">
            <h3 className="mb-4">Typography Scale</h3>
            <div className="prose">
              <p className="text-xs">Extra Small Text</p>
              <p className="text-sm">Small Text</p>
              <p className="text-base">Base Text</p>
              <p className="text-lg">Large Text</p>
              <p className="text-xl">Extra Large Text</p>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="card">
          <h3 className="mb-4">Illia Color Palette</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="space-y-2">
                <div
                  className={`w-full aspect-square rounded-lg bg-teal-${shade}`}
                  title={`teal-${shade}`}
                />
                <p className="text-xs text-center text-gray-600">{shade}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Animations */}
        <section className="card">
          <h3 className="mb-4">Animations</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-50 rounded-lg animate-in">
              <p className="text-primary-900">Fade In Animation</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg hover-lift cursor-pointer">
              <p className="text-primary-900">Hover to Lift</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg transition-all hover:scale-105">
              <p className="text-primary-900">Scale on Hover</p>
            </div>
          </div>
        </section>

        {/* Responsive Grid */}
        <section className="card">
          <h3 className="mb-4">Responsive Grid System</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-gray-100 rounded-lg text-center">
                <p className="font-medium">Item {i}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="card">
          <h3 className="mb-4">Accessibility</h3>
          <div className="space-y-4">
            <button className="btn-primary focus-visible-ring">Tab to see focus ring</button>
            <p className="text-sm text-gray-600">
              All interactive elements have proper focus states and ARIA labels
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
