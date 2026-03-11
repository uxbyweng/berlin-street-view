import Link from "next/link";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-sm font-semibold tracking-tight">
            STREETLENS
          </span>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/artworks" className="hover:underline">
              Artworks
            </Link>
            <Link href="/artworks/new" className="hover:underline">
              Add Artwork
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
