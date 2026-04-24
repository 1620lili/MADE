export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-surface-lowest flex flex-col">
      {/* Navbar Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-lowest border-b border-outline-variant/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="w-24 h-8 bg-surface-low animate-pulse" />
          <div className="w-32 h-4 bg-surface-low animate-pulse" />
        </div>
      </nav>

      {/* Hero Skeleton */}
      <div className="relative w-full h-[60vh] mt-20 bg-surface-low animate-pulse flex flex-col items-center justify-end pb-16 px-6">
        <div className="w-24 h-24 bg-surface-container mb-6 shadow-2xl" />
        <div className="w-64 h-12 bg-surface-container mb-4" />
        <div className="w-48 h-4 bg-surface-container" />
      </div>

      {/* Contact Section Skeleton */}
      <div className="bg-surface-low border-b border-outline-variant/10 h-24 w-full animate-pulse" />

      {/* Products Grid Skeleton */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 w-full">
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="w-32 h-4 bg-surface-low animate-pulse" />
          <div className="w-64 h-10 bg-surface-low animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-6">
              <div className="relative aspect-[3/4] bg-surface-low animate-pulse shadow-sm" />
              <div className="space-y-3 flex flex-col items-center">
                <div className="w-20 h-3 bg-surface-low animate-pulse" />
                <div className="w-40 h-6 bg-surface-low animate-pulse" />
                <div className="w-32 h-4 bg-surface-low animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
