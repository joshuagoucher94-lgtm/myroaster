import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCatalogue, getCoffeeBySlug, getMinimumUnitPricePenceForCoffee } from "@/src/db/catalogue";
import { formatMoney } from "@/src/db/catalogue-data";
import { getShopCategory } from "@/src/lib/shop-categories";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalogue = await getCatalogue();
  const coffee = getCoffeeBySlug(catalogue, slug);

  if (!coffee) {
    return { title: "Coffee | MyRoaster" };
  }

  return {
    title: `${coffee.name} | MyRoaster`,
    description: coffee.description,
  };
}

export default async function CoffeeProductPage({ params }: Props) {
  const { slug } = await params;
  const catalogue = await getCatalogue();
  const coffee = getCoffeeBySlug(catalogue, slug);

  if (!coffee) {
    notFound();
  }

  const category = getShopCategory(coffee.shopCategorySlug);
  const fromPrice = getMinimumUnitPricePenceForCoffee(catalogue, coffee.id);

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl space-y-4 px-6 py-8">
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground hover:underline">
              Shop
            </Link>
            {category ? (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/shop/category/${category.slug}`}
                  className="hover:text-foreground hover:underline"
                >
                  {category.name}
                </Link>
              </>
            ) : null}
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{coffee.name}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{coffee.roastLevel}</Badge>
            <Badge variant="outline">{coffee.originType}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{coffee.name}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{coffee.subtitle}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href={`/configure?coffee=${encodeURIComponent(coffee.slug)}`}>
                Configure white-label bags with this coffee
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop">Back to shop</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_1.05fr]">
        <Card className="overflow-hidden">
          <div className="relative aspect-square bg-muted">
            <Image
              src={coffee.heroImagePath}
              alt={coffee.name}
              fill
              className="object-contain p-10"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="text-3xl font-semibold">
                    {fromPrice != null ? formatMoney(fromPrice) : "On request"}
                  </p>
                  <p className="text-sm text-muted-foreground">per bag before VAT · MOQ tiers apply</p>
                </div>
                <Button asChild>
                  <Link href={`/configure?coffee=${encodeURIComponent(coffee.slug)}`}>Start order</Link>
                </Button>
              </div>
              <Separator />
              <p className="leading-7 text-muted-foreground">{coffee.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold">Tasting notes</h2>
              <div className="flex flex-wrap gap-2">
                {coffee.tastingNotes.map((note) => (
                  <Badge key={note} variant="secondary">
                    {note}
                  </Badge>
                ))}
              </div>
              <Separator />
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Roast level: {coffee.roastLevel}</li>
                <li>Product slug: {coffee.slug}</li>
                <li>Internal SKU id: {coffee.id}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
