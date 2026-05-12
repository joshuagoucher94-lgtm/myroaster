import Link from "next/link";

import { CoffeeProductCard } from "@/components/shop/coffee-product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCatalogue, getMinimumUnitPricePenceForCoffee } from "@/src/db/catalogue";
import { SHOP_CATEGORIES } from "@/src/lib/shop-categories";

export default async function ShopPage() {
  const catalogue = await getCatalogue();

  return (
    <main className="min-h-screen pb-20">
      <section className="border-b border-border/60">
        <div className="section-shell space-y-5 py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Products</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            White-label coffee products built around your brand.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Choose a coffee profile, then pick 250g bags with a 24 bag minimum or 1kg bags with a
            6 bag minimum. Select bag colour, then choose plain label or artwork upload.
          </p>
        </div>
      </section>

      <div className="section-shell space-y-12 pt-10">
        <section className="grid gap-5 md:grid-cols-2">
          <ProductFormat
            title="1kg Bags"
            description="Six bag minimum for service, offices, and house coffee."
            price="Priced from the catalogue’s 6kg fit."
            badges={["Min 6", "Service", "Simple"]}
          />
          <ProductFormat
            title="250g Bags"
            description="Twenty-four bag minimum for shelves, gifting, and small retail runs."
            price="Priced from the same 6kg total fit."
            badges={["Min 24", "Retail", "Artwork ready"]}
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHOP_CATEGORIES.map((category) => (
            <Link key={category.slug} href={`/shop/category/${category.slug}`}>
              <Card className="soft-panel-sm h-full rounded-[1.5rem] transition hover:-translate-y-0.5">
                <CardContent className="space-y-2 p-5">
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{category.description}</p>
                  <p className="text-sm font-semibold text-foreground">Browse category</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <section id="coffee-profiles" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Coffee profiles</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {catalogue.coffees.length} profiles from the catalogue. Each product page keeps the
              choice to weight, bag colour, and plain or artwork label.
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

function ProductFormat({
  title,
  description,
  price,
  badges,
}: {
  title: string;
  description: string;
  price: string;
  badges: string[];
}) {
  return (
    <Card className="soft-panel rounded-[1.75rem]">
      <CardContent className="p-6">
        <div className="soft-inset mb-5 flex aspect-[16/8] items-center justify-center rounded-[1.35rem]">
          <span className="rounded-full bg-card/80 px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm">
            Preview label
          </span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <p className="mt-4 font-semibold">{price}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary" className="rounded-full">
              {badge}
            </Badge>
          ))}
        </div>
        <Button className="mt-6" asChild>
          <Link href="#coffee-profiles">Customize</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
