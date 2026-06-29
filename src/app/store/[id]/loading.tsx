export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Navbar Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="w-24 h-8 bg-white/5 rounded-sm animate-pulse" />
          <div className="w-32 h-4 bg-white/5 rounded-sm animate-pulse" />
        </div>
      </nav>

      {/* Hero Skeleton - High Epic Style */}
      <div className="relative w-full min-h-[85vh] bg-gradient-to-b from-[#0a0a0a] to-[#050505] flex items-center px-6 md:px-12 pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#00FFC2]/5 animate-pulse" />
        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="w-48 h-4 bg-white/5 rounded-sm animate-pulse" />
            <div className="space-y-4">
              <div className="w-full max-w-md h-24 bg-white/10 rounded-sm animate-pulse" />
              <div className="w-3/4 max-w-sm h-24 bg-white/10 rounded-sm animate-pulse" />
            </div>
            <div className="w-64 h-6 bg-white/5 rounded-sm animate-pulse" />
          </div>
          <div className="hidden md:flex justify-end">
            <div className="w-[320px] h-[320px] bg-black/60 border border-white/5 rounded-sm animate-pulse" />
          </div>
        </div>
      </div>

      {/* Contact Section Skeleton */}
      <div className="bg-[#0e0e0e] border-y border-white/5 h-32 w-full animate-pulse" />

      {/* Products Grid Skeleton */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-32 w-full">
        <div className="flex justify-between items-end mb-24">
          <div className="space-y-4">
            <div className="w-32 h-4 bg-white/5 rounded-sm animate-pulse" />
            <div className="w-64 h-12 bg-white/10 rounded-sm animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111111]/40 border border-white/5 p-10 flex flex-col gap-8 rounded-sm animate-pulse">
              <div className="relative h-72 bg-[#0a0a0a]/50 rounded-sm" />
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="w-32 h-6 bg-white/10 rounded-sm" />
                    <div className="w-20 h-3 bg-white/5 rounded-sm" />
                  </div>
                  <div className="w-16 h-6 bg-[#00FFC2]/10 rounded-sm" />
                </div>
                <div className="flex gap-2">
                  <div className="w-24 h-6 bg-white/5 rounded-sm" />
                  <div className="w-24 h-6 bg-white/5 rounded-sm" />
                </div>
                <div className="w-full h-12 bg-white/5 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
