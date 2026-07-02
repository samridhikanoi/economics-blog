import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-black/10 bg-paper/95 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-ink">
          The Economics Desk
        </Link>
        <nav className="flex gap-5 text-sm font-medium text-muted">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
