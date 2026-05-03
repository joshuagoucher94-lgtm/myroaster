import Link from "next/link";
import { notFound } from "next/navigation";

import { CoffeeProductCard } from "@/components/shop/coffee-product-card";
import { Button } from "@/components/ui/button";
import {
  getCatalogue,
  getCoffeesInShopCategory,
  getMinimumUnitPricePenceForCoffee,
} from "@/src/db/catalogue";
import { getShopCategory } from "@/src/lib/shop-categories";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ShopCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getShopCategory(slug);

  if (!category) {
    notFound();
  }

  const catalogue = await getCatalogue();
  const coffees = getCoffeesInShopCategory(catalogue, slug);

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl space-y-4 px-6 py-10">
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground hover:underline">
              Shop
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{category.name}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{category.name}</h1>
          <p className="max-w-2xl text-muted-foreground">{category.description}</p>
          <Button variant="outline" asChild>
            <Link href="/shop">All categories</Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10">
        {coffees.length === 0 ? (
          <p className="text-muted-foreground">No coffees in this category yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coffees.map((coffee) => (
              <CoffeeProductCard
                key={coffee.id}
                coffee={coffee}
                fromPricePence={getMinimumUnitPricePenceForCoffee(catalogue, coffee.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
