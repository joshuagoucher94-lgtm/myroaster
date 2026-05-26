import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Check, ExternalLink, ShieldCheck, Truck } from "lucide-react";

import { ProductCustomizer } from "@/components/product/product-customizer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    return { title: "Coffee | myroaster" };
  }

  return {
    title: `${coffee.name} | myroaster`,
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
    <main className="min-h-screen pb-20">
      <section className="border-b border-border/60 bg-background/80">
        <div className="section-shell py-8 sm:py-10">
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground hover:underline">
              Shop
            </Link>
            {category ? (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/shop/category/${category.slug}`} className="hover:text-foreground hover:underline">
                  {category.name}
                </Link>
              </>
            ) : null}
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{coffee.name}</span>
          </div>
        </div>
      </section>

      <section id="customize" className="section-shell scroll-mt-24 py-8 sm:py-10">
        <ProductCustomizer catalogue={catalogue} coffee={coffee} />
      </section>

      <section className="section-shell grid gap-6 pb-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <div className="grid gap-6">
          <InfoCard title="Coffee story" body={coffee.description} />
          {coffee.tastingNotes.length ? <InfoCard title="Tasting notes" body={coffee.tastingNotes.join(" · ")} /> : null}
          <InfoCard
            title="Customization"
            body="Choose 250g bags with a 24 bag minimum or 1kg bags with a 6 bag minimum. Pick a bag colour, then choose a plain label or upload artwork."
          />
          {coffee.sourceName && coffee.sourceUrl ? <SourceCard name={coffee.sourceName} url={coffee.sourceUrl} /> : null}
        </div>
        <Card className="rounded-lg border-border/80 shadow-none">
          <CardContent className="space-y-5 p-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Buying info</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Simple ecommerce flow</h2>
            </div>
            <div className="space-y-4 text-sm">
              <FeatureRow
                icon={<Check className="size-4" />}
                title="Choose options"
                body="Select size, bag colour, and label type before adding to cart."
              />
              <FeatureRow
                icon={<Truck className="size-4" />}
                title="Six kilo minimum"
                body="Choose 24 x 250g bags or 6 x 1kg bags."
              />
              <FeatureRow
                icon={<ShieldCheck className="size-4" />}
                title="Plain or artwork label"
                body="Use the product plain, or add artwork only when the file is ready."
              />
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {fromPrice != null ? formatMoney(fromPrice) : "On request"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Unit pricing follows the selected weight minimum.</p>
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link href="/shop">Back to all products</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="rounded-lg border-border/80 shadow-none">
      <CardContent className="p-5">
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}

function SourceCard({ name, url }: { name: string; url: string }) {
  return (
    <Card className="rounded-lg border-border/80 shadow-none">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Catalogue source</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{name}</p>
        </div>
        <Button variant="outline" asChild>
          <a href={url} target="_blank" rel="noreferrer">
            View source
            <ExternalLink className="size-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function FeatureRow({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">{icon}</span>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 leading-6 text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
