import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";
import { Button } from "@/components/ui/button";

const primaryLinks = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop/category/blends", label: "House picks" },
  { href: "/shop/category/single-origin", label: "Single origins" },
  { href: "/shop/category/decaf", label: "Decaf" },
  { href: "/#how-it-works", label: "How it works" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            myroaster
          </Link>
          <nav className="hidden flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground md:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-medium hover:text-foreground hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <CartLink />
          <Button size="sm" variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
