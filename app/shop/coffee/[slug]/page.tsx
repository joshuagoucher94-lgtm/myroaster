import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Check, ShieldCheck, Truck } from "lucide-react";

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
          <InfoCard title="Product description" body={coffee.description} />
          <InfoCard title="Tasting notes" body={coffee.tastingNotes.join(" · ")} />
          <InfoCard
            title="What you’re ordering"
            body="Choose either 1kg trade bags for service or 250g retail bags for shelves, gifting, and grab-and-go sales. Every order includes bag selection, grind choice, label placement, and optional logo upload."
          />
        </div>
        <Card className="soft-panel-sm rounded-[1.5rem]">
          <CardContent className="space-y-5 p-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Buying info
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Why it feels familiar</h2>
            </div>
            <div className="space-y-4 text-sm">
              <FeatureRow
                icon={<Check className="size-4" />}
                title="Standard product flow"
                body="Gallery first, core product details at the top, then all supporting information below."
              />
              <FeatureRow
                icon={<Truck className="size-4" />}
                title="Tiered delivery pricing"
                body="Larger trade and retail tiers move into delivered pricing automatically."
              />
              <FeatureRow
                icon={<ShieldCheck className="size-4" />}
                title="Brand-safe setup"
                body="Template label options work without artwork, or upload your logo when you’re ready."
              />
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {fromPrice != null ? formatMoney(fromPrice) : "On request"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Unit pricing updates based on bag, size, and tier.</p>
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
    <Card className="soft-panel-sm rounded-[1.5rem]">
      <CardContent className="p-5">
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
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
      <span className="soft-inset flex size-9 shrink-0 items-center justify-center rounded-full">{icon}</span>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 leading-6 text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
