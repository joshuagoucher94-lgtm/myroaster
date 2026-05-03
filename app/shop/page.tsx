import Link from "next/link";

import { CoffeeProductCard } from "@/components/shop/coffee-product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCatalogue,
  getMinimumUnitPricePenceForCoffee,
} from "@/src/db/catalogue";
import { SHOP_CATEGORIES } from "@/src/lib/shop-categories";

export default async function ShopPage() {
  const catalogue = await getCatalogue();

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl space-y-4 px-6 py-12">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Shop</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance">
            Wholesale coffee, one product per lot.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Every coffee below is its own product with a dedicated page, notes, and a configure link
            so you can quote and order white-label bags without ambiguity.
          </p>
          <Button asChild>
            <Link href="/configure">Skip to bag configurator</Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-6 pt-10">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHOP_CATEGORIES.map((category) => (
            <Link key={category.slug} href={`/shop/category/${category.slug}`}>
              <Card className="h-full border-border/80 transition-shadow hover:shadow-md">
                <CardContent className="space-y-2 p-5">
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <p className="text-sm font-medium text-primary">Browse category →</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">All coffees</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {catalogue.coffees.length} SKUs · prices shown as lowest unit from published tiers (MOQ
              applies).
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
