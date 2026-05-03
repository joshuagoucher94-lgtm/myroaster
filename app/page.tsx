import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,var(--muted),transparent_34rem)]">
      <main className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <section className="space-y-8">
          <Badge variant="secondary" className="w-fit">
            White-label coffee without the production headache
          </Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              Your branding on speciality coffee bags, packed and shipped by us.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Choose the coffee, bag colour, label shape, size, grind, and quantity.
              Upload your artwork, preview the finished bag, and place an order for
              your cafe, restaurant, hotel, office, or retail shelf.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/shop">Browse coffee</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/configure">Build your bag</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:hello@myroaster.co.uk">Talk to us</a>
            </Button>
          </div>
        </section>

        <Card className="overflow-hidden border-border/70 bg-card/80 shadow-2xl">
          <CardContent className="p-6">
            <div className="rounded-3xl bg-muted p-6">
              <div className="mx-auto aspect-[7/9] max-w-sm rounded-[2rem] border bg-[#b88752] p-8 shadow-inner">
                <div className="h-16 rounded-t-3xl bg-black/15" />
                <div className="mt-16 rounded-2xl bg-white p-8 text-center shadow-xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Your cafe
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold">House Blend</h2>
                  <Separator className="my-5" />
                  <p className="text-sm text-muted-foreground">
                    Chocolate, hazelnut, brown sugar. Roasted and packed by
                    MyRoaster.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Shop coffee by the bag</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Each coffee is its own SKU with its own product page, tasting notes, and white-label
              configure flow.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/shop">View full shop</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-20 md:grid-cols-3">
        {[
          ["Configure", "Pick coffee, bag, size, grind, label shape, and order quantity."],
          ["Preview", "Upload artwork and see it positioned on the selected bag mockup."],
          ["Checkout", "Pay by Stripe Checkout while we store the production-ready order details."],
        ].map(([title, description]) => (
          <Card key={title}>
            <CardContent className="space-y-3 p-6">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
