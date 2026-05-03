import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SHOP_CATEGORIES } from "@/src/lib/shop-categories";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            MyRoaster
          </Link>
          <nav className="hidden flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground md:flex">
            <Link href="/shop" className="font-medium text-foreground hover:underline">
              Shop
            </Link>
            {SHOP_CATEGORIES.slice(0, 3).map((category) => (
              <Link
                key={category.slug}
                href={`/shop/category/${category.slug}`}
                className="hover:text-foreground hover:underline"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/configure" className="hover:text-foreground hover:underline">
              Configure bags
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/shop">All coffee</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/configure">White-label order</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
