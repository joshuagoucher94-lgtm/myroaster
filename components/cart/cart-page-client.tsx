"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/src/db/catalogue-data";

export function CartPageClient() {
  const { items, totals, removeItem, clearCart, isReady } = useCart();
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCheckout() {
    setIsSubmitting(true);
    setStatus("Creating checkout...");

    try {
      const response = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          contactName,
          customerEmail,
          items: items.map((item) => ({
            coffeeProductId: item.coffeeProductId,
            bagOptionId: item.bagOptionId,
            bagSizeId: item.bagSizeId,
            labelOptionId: item.labelOptionId,
            grindOptionId: item.grindOptionId,
            quantity: item.quantity,
            brandName: item.brandName,
            labelTitle: item.labelTitle,
            artworkFileName: item.artworkFileName,
            productionNotes: item.productionNotes,
          })),
        }),
      });
      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Unable to create checkout.");
      }

      clearCart();
      window.location.href = result.url;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create checkout.");
      setIsSubmitting(false);
    }
  }

  if (!isReady) {
    return (
      <main className="min-h-screen">
        <div className="section-shell py-12">
          <p className="text-sm text-muted-foreground">Loading cart...</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <div className="section-shell py-12">
          <Card className="soft-panel mx-auto max-w-2xl rounded-[2rem] text-center">
            <CardContent className="space-y-5 p-10">
              <span className="soft-inset mx-auto flex size-14 items-center justify-center rounded-full">
                <ShoppingBag className="size-6" />
              </span>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Your cart is empty.</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Choose a coffee profile, configure your branded format, and add it here when it is ready.
                </p>
              </div>
              <Button asChild>
                <Link href="/shop">View products</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="border-b border-border/60">
        <div className="section-shell space-y-3 py-10">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Cart</p>
          <h1 className="text-4xl font-semibold tracking-tight">Configured branded coffee cart</h1>
          <p className="max-w-2xl text-muted-foreground">
            Review each product configuration. Different formats, grinds, and label setups are kept
            as separate line items for clearer reorders.
          </p>
        </div>
      </div>

      <div className="section-shell grid gap-8 pt-10 lg:grid-cols-[1fr_24rem]">
        <section className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="soft-panel-sm rounded-[1.5rem]">
              <CardContent className="grid gap-5 p-5 md:grid-cols-[8rem_1fr_auto]">
                <Link
                  href={`/shop/coffee/${item.coffeeSlug}#customize`}
                  className="soft-inset relative aspect-square rounded-[1.2rem]"
                >
                  <Image
                    src={item.coffeeImagePath}
                    alt={item.coffeeName}
                    fill
                    className="object-contain p-3"
                    sizes="8rem"
                  />
                </Link>

                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{item.roastLevel}</Badge>
                      <Badge variant="outline">{item.bagSizeLabel}</Badge>
                      <Badge variant="outline">{item.grindName}</Badge>
                    </div>
                    <Link href={`/shop/coffee/${item.coffeeSlug}#customize`}>
                      <h2 className="mt-3 text-xl font-semibold tracking-tight hover:underline">
                        {item.coffeeName}
                      </h2>
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.quantity} units · {item.bagSizeLabel} · {item.bagName} bag · {item.labelName} label
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <CartDetail label="Brand" value={item.brandName || "Not set"} />
                    <CartDetail label="Label title" value={item.labelTitle} />
                    <CartDetail label="Artwork" value={item.artworkFileName || "Not selected"} />
                    <CartDetail label="Unit price" value={formatMoney(item.unitAmountPence)} />
                    <CartDetail label="Setup fee" value={formatMoney(item.setupFeePence)} />
                  </div>
                  {item.productionNotes ? (
                    <p className="soft-inset rounded-2xl p-3 text-sm text-muted-foreground">
                      {item.productionNotes}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-start justify-between gap-4 md:flex-col md:items-end">
                  <div className="text-left md:text-right">
                    <p className="text-sm text-muted-foreground">Line total</p>
                    <p className="text-xl font-semibold">{formatMoney(item.totalPence)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.coffeeName} from cart`}
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="soft-panel rounded-[1.5rem]">
            <CardHeader>
              <CardTitle>Cart summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SummaryRow label="Configured items" value={`${totals.itemCount}`} />
              <SummaryRow label="Total bags" value={`${totals.bagCount}`} />
              <Separator />
              <SummaryRow label="Subtotal" value={formatMoney(totals.subtotalPence)} />
              <SummaryRow label="Setup fees" value={formatMoney(totals.setupFeePence)} />
              <div className="soft-inset flex items-center justify-between rounded-2xl p-4 text-lg font-semibold">
                <span>Total</span>
                <span>{formatMoney(totals.totalPence)}</span>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business name</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact name</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleCheckout} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Checkout
              </Button>
              {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/shop">
                  Continue shopping
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="ghost" className="w-full" onClick={clearCart}>
                Clear cart
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function CartDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
