export default function Loading() {
  return (
    <div className="container-cv py-12 md:py-16" aria-busy="true" aria-label="Loading courses">
      <div className="shimmer h-10 w-72 rounded-xl" />
      <div className="shimmer mt-4 h-5 w-96 max-w-full rounded-lg" />
      <div className="shimmer mt-8 h-[72px] rounded-2xl" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shimmer h-80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
