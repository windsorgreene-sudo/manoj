export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="shimmer h-24 rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="shimmer h-40 rounded-2xl" />)}</div>
      <div className="shimmer h-64 rounded-2xl" />
    </div>
  );
}
