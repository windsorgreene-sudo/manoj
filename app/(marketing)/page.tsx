import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="container-cv py-32 text-center">
      <h1 className="font-heading text-5xl font-bold md:text-7xl">
        Learn. Practice. <span className="text-gradient">Compete.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-muted-foreground">The premium coding platform — the full landing arrives in Phase 2.</p>
      <Button asChild className="mt-8 rounded-xl">
        <Link href="/signup">Start free</Link>
      </Button>
    </section>
  );
}
