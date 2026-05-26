import Link from "next/link";

import { CoffeeProductCard } from "@/components/shop/coffee-product-card";
import { Button } from "@/components/ui/button";
import { getCatalogue, getMinimumUnitPricePenceForCoffee } from "@/src/db/catalogue";
import { SHOP_CATEGORIES } from "@/src/lib/shop-categories";

export default async function ShopPage() {
  const catalogue = await getCatalogue();
  const origins = new Set(catalogue.coffees.map((coffee) => coffee.originType)).size;

  return (
    <main className="min-h-screen pb-20">
      <section className="border-b border-border/60">
        <div className="section-shell grid gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Shop coffee</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Coffee catalogue
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Browse the full range, choose a coffee, then add the simple customization step:
              bag size, bag colour, and plain or artwork label.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Stat label="Products" value={catalogue.coffees.length.toString()} />
            <Stat label="Origins" value={origins.toString()} />
            <Stat label="Minimum" value="6kg" />
          </div>
        </div>
      </section>

      <div className="section-shell space-y-8 pt-8">
        <section className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" asChild>
            <Link href="/shop">All products</Link>
          </Button>
          {SHOP_CATEGORIES.map((category) => (
            <Button key={category.slug} variant="outline" size="sm" asChild>
              <Link href={`/shop/category/${category.slug}`}>{category.name}</Link>
            </Button>
          ))}
        </section>

        <section id="coffee-profiles" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">All coffee</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              250g x24 or 1kg x6. Plain label or artwork upload.
            </p>
          </div>
          <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {catalogue.coffees.map((coffee) => (
              <CoffeeProductCard
                key={coffee.id}
                coffee={coffee}
                fromPricePence={getMinimumUnitPricePenceForCoffee(catalogue, coffee.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
