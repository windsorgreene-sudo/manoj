export default function Loading() {
  return (
    <div className="container-cv py-12 md:py-16" aria-busy="true" aria-label="Loading quizzes">
      <div className="shimmer h-10 w-64 rounded-xl" />
      <div className="shimmer mt-4 h-5 w-96 max-w-full rounded-lg" />
      <div className="mt-10 grid gap-4 md:grid-cols-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="shimmer h-32 rounded-2xl" />)}</div>
    </div>
  );
}
