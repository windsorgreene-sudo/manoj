export default function Loading() {
  return (
    <div className="container-cv py-10 md:py-14" aria-busy="true" aria-label="Loading problems">
      <div className="shimmer h-10 w-64 rounded-xl" />
      <div className="shimmer mt-6 h-16 rounded-2xl" />
      <div className="mt-6 space-y-2">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="shimmer h-12 rounded-xl" />)}</div>
    </div>
  );
}
