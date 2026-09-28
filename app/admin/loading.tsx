export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="shimmer h-10 w-64 rounded-xl" />
      <div className="grid gap-4 md:grid-cols-5">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="shimmer h-28 rounded-2xl" />)}</div>
      <div className="shimmer h-80 rounded-2xl" />
    </div>
  );
}
