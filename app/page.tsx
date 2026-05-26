import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, PackageCheck, Repeat, Upload } from "lucide-react";

import { CoffeeProductCard } from "@/components/shop/coffee-product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCatalogue, getMinimumUnitPricePenceForCoffee } from "@/src/db/catalogue";

const steps = ["Choose coffee", "Pick bag size", "Select bag colour", "Add label artwork", "Add to cart"];

const useCases = ["Cafes", "Offices", "Hotels", "Salons", "Gyms", "Estate agents", "Creators", "Events"];

export default async function Home() {
  const catalogue = await getCatalogue();
  const featuredCoffees = catalogue.coffees.slice(0, 3);
  const heroCoffee = catalogue.coffees[1] ?? catalogue.coffees[0];

  return (
    <main className="min-h-screen">
      <section className="section-shell grid min-h-[calc(100svh-4.5rem)] gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="space-y-7">
          <Badge variant="secondary" className="w-fit rounded-sm px-3 py-1">
            {catalogue.coffees.length} coffees from the new catalogue
          </Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              Branded coffee, ordered like ecommerce.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Browse the product range, choose a coffee, then add the one extra customization step:
              bag size, bag colour, and plain or artwork label.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/shop">
                View products
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">How it works</Link>
            </Button>
          </div>
          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {["250g x24", "1kg x6", "Plain or artwork label"].map((highlight) => (
              <div key={highlight} className="flex items-center gap-2 text-sm font-medium">
                <span className="flex size-7 items-center justify-center rounded bg-muted">
                  <Check className="size-3.5" />
                </span>
                {highlight}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
              {heroCoffee ? (
                <Image
                  src={heroCoffee.heroImagePath}
                  alt="Neutral branded coffee bag preview"
                  fill
                  priority
                  className="object-contain p-12"
                  sizes="(max-width: 1024px) 100vw, 44vw"
                />
              ) : null}
              <div className="absolute left-[31%] top-[38%] flex h-[28%] w-[38%] flex-col items-center justify-center rounded border border-foreground/10 bg-[#f8f7f2] p-3 text-center shadow-xl">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Your logo
                </span>
                <span className="mt-2 text-sm font-semibold">Your Coffee</span>
                <span className="mt-2 text-[0.65rem] text-muted-foreground">Roasted for your brand</span>
              </div>
            </div>

            <div className="grid gap-3">
              <PreviewNote icon={<Upload className="size-4" />} title="Upload logo" text="Use your mark, label copy, and product name." />
              <PreviewNote icon={<PackageCheck className="size-4" />} title="Pick format" text="Trade service or retail-ready bags." />
              <PreviewNote icon={<Repeat className="size-4" />} title="Reorder" text="Saved configuration, clear line items." />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="grid gap-5 md:grid-cols-2">
          <FormatCard
            title="1kg bags"
            description="Six bags per order for service, offices, and house coffee."
            price="Priced from the catalogue roasted selling price."
            tags={["6 bag minimum", "Service", "Simple"]}
          />
          <FormatCard
            title="250g bags"
            description="Twenty-four bags per order for retail shelves, gifting, and events."
            price="Same 6kg coffee fit, split into retail bags."
            tags={["24 bag minimum", "Retail", "Artwork ready"]}
          />
        </div>
      </section>

      <section id="how-it-works" className="section-shell py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Build your branded coffee order.</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/shop">Start order</Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step} className="soft-panel-sm rounded-[1.25rem] p-4">
              <span className="soft-inset mb-4 flex size-9 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <p className="font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="section-shell py-12">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Product catalog
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Choose a coffee profile, then customize.</h2>
        </div>
        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCoffees.map((coffee) => (
            <CoffeeProductCard
              key={coffee.id}
              coffee={coffee}
              fromPricePence={getMinimumUnitPricePenceForCoffee(catalogue, coffee.id)}
            />
          ))}
        </div>
      </section>

      <section id="about" className="section-shell py-12">
        <Card className="rounded-lg border-border/80 shadow-none">
          <CardContent className="grid gap-8 p-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                About
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">A quiet production layer for many brands.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The interface stays neutral so your logo, label, and product decisions become the main signal.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {useCases.map((item) => (
                <Badge key={item} variant="secondary" className="rounded-sm px-3 py-1.5">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function FormatCard({
  title,
  description,
  price,
  tags,
}: {
  title: string;
  description: string;
  price: string;
  tags: string[];
}) {
  return (
    <Link href="/shop" className="group rounded-lg border border-border bg-card p-6 shadow-sm transition hover:border-foreground/20">
      <div className="mb-6 flex aspect-[16/9] items-center justify-center rounded-lg bg-muted">
        <span className="rounded bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm">
          Your brand label
        </span>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <p className="mt-4 font-semibold">{price}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="rounded-sm">
            {tag}
          </Badge>
        ))}
      </div>
    </Link>
  );
}

function PreviewNote({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <span className="mb-3 flex size-9 items-center justify-center rounded bg-muted">{icon}</span>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}
