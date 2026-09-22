// A template re-mounts on every navigation, so this gives each page a subtle
// fade-in. Kept fast (250ms) so it feels responsive, not sluggish.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
