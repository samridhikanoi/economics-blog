export default function Footer() {
  return (
    <footer className="border-t border-black/10 mt-16">
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p>&copy; {new Date().getFullYear()} Samridhi Kanoi. All rights reserved.</p>
        <p>Analytical writing on economics, markets, and policy.</p>
      </div>
    </footer>
  );
}
