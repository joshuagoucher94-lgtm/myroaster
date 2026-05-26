"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, FileUp, Package, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Catalogue, type CoffeeProduct, formatMoney } from "@/src/db/catalogue-data";
import { getBestPrice } from "@/src/lib/catalogue-pricing";
import { makeCartItemId } from "@/src/lib/cart";

type Props = {
  catalogue: Catalogue;
  coffee: CoffeeProduct;
};

export function ProductCustomizer({ catalogue, coffee }: Props) {
  const { addItem } = useCart();
  const size250g = catalogue.sizes.find((item) => item.slug === "250g") ?? catalogue.sizes[0];
  const size1kg = catalogue.sizes.find((item) => item.slug === "1kg") ?? catalogue.sizes[0];
  const fallbackLabel = catalogue.labels[0];
  const fallbackGrind = catalogue.grinds[0];

  const [weight, setWeight] = useState<"250g" | "1kg">("250g");
  const [bagOptionId, setBagOptionId] = useState(catalogue.bags[0]?.id ?? "");
  const [labelMode, setLabelMode] = useState<"plain" | "artwork">("plain");
  const [artworkFileName, setArtworkFileName] = useState("");
  const [artworkPreview, setArtworkPreview] = useState("");
  const [artworkStatus, setArtworkStatus] = useState("");
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const quantity = weight === "250g" ? 24 : 6;
  const size = weight === "250g" ? size250g : size1kg;
  const bag = catalogue.bags.find((item) => item.id === bagOptionId);

  const price = useMemo(
    () =>
      size
        ? getBestPrice(catalogue, {
            coffeeProductId: coffee.id,
            bagOptionId,
            bagSizeId: size.id,
            quantity,
          })
        : undefined,
    [bagOptionId, catalogue, coffee.id, quantity, size]
  );

  const unitAmountPence = price?.unitAmountPence ?? 0;
  const setupFeePence = price?.setupFeePence ?? 0;
  const subtotalPence = unitAmountPence * quantity;
  const totalPence = subtotalPence + setupFeePence;
  const canAddToCart = Boolean(size && bag && fallbackLabel && fallbackGrind);

  function handleArtworkChange(file: File | undefined) {
    if (!file) {
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setArtworkStatus("Please choose a PNG, JPG, SVG, or PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setArtworkStatus("Please keep artwork below 10MB.");
      return;
    }

    if (artworkPreview) {
      URL.revokeObjectURL(artworkPreview);
    }

    setArtworkFileName(file.name);
    setArtworkPreview(file.type === "application/pdf" ? "" : URL.createObjectURL(file));
    setArtworkStatus(
      file.type === "application/pdf"
        ? "PDF selected. Production upload is prepared for checkout."
        : "Artwork selected for this product."
    );
  }

  function clearArtwork() {
    if (artworkPreview) {
      URL.revokeObjectURL(artworkPreview);
    }
    setArtworkFileName("");
    setArtworkPreview("");
    setArtworkStatus("");
  }

  function handleAddToCart() {
    if (!size || !bag || !fallbackLabel || !fallbackGrind) {
      return;
    }

    const id = makeCartItemId();
    addItem({
      id,
      addedAt: new Date().toISOString(),
      coffeeProductId: coffee.id,
      coffeeName: coffee.name,
      coffeeSlug: coffee.slug,
      coffeeImagePath: coffee.heroImagePath,
      roastLevel: coffee.roastLevel,
      tastingNotes: coffee.tastingNotes,
      bagOptionId: bag.id,
      bagName: bag.name,
      bagFinish: bag.finish,
      bagMockupAssetPath: bag.mockupAssetPath,
      bagSizeId: size.id,
      bagSizeLabel: size.label,
      labelOptionId: fallbackLabel.id,
      labelName: labelMode === "plain" ? "Plain label" : "Artwork label",
      labelShape: fallbackLabel.shape,
      grindOptionId: fallbackGrind.id,
      grindName: fallbackGrind.name,
      quantity,
      unitAmountPence,
      setupFeePence,
      subtotalPence,
      totalPence,
      currency: price?.currency ?? "gbp",
      brandName: "",
      labelTitle: coffee.name,
      artworkFileName: labelMode === "artwork" ? artworkFileName : "",
      productionNotes: "",
    });
    setAddedItemId(id);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(23rem,0.62fr)] xl:gap-10">
      <div className="space-y-4">
        <Card className="overflow-hidden rounded-lg border-border/80 shadow-none">
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] bg-muted">
              <Image
                src={coffee.heroImagePath}
                alt={coffee.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:grid-cols-[9rem_1fr]">
          <div className="relative h-36 w-36 rounded-lg border border-border bg-card">
            {bag ? (
              <Image
                src={bag.mockupAssetPath}
                alt={`${bag.name} coffee bag`}
                fill
                className="object-contain p-4"
                sizes="9rem"
              />
            ) : null}
            {labelMode === "artwork" && artworkPreview ? (
              <div className="absolute left-[34%] top-[31%] h-[32%] w-[31%] overflow-hidden rounded border border-foreground/10 bg-[#f8f7f2]">
                <Image
                  src={artworkPreview}
                  alt="Selected artwork preview"
                  fill
                  className="object-cover"
                  sizes="5rem"
                  unoptimized
                />
              </div>
            ) : null}
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-semibold">Custom bag preview</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your selected bag colour and label option are applied after you choose options.
            </p>
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="rounded-lg border-border/80 shadow-none">
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div>
              <div className="mb-3 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                <span>{coffee.originType}</span>
                <span aria-hidden="true">/</span>
                <span>{coffee.roastLevel}</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">{coffee.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{coffee.subtitle}</p>
            </div>

            <div className="space-y-3">
              <Label>Weight</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <OptionButton
                  active={weight === "250g"}
                  title="250g"
                  subtitle="24 bags"
                  onClick={() => setWeight("250g")}
                />
                <OptionButton
                  active={weight === "1kg"}
                  title="1kg"
                  subtitle="6 bags"
                  onClick={() => setWeight("1kg")}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Bag color</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {catalogue.bags.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBagOptionId(item.id)}
                    className={`rounded-lg border p-3 text-left transition ${
                      bagOptionId === item.id ? "border-primary bg-secondary" : "bg-background hover:border-foreground/20"
                    }`}
                  >
                    <span
                      className="mb-3 block size-9 rounded border border-foreground/10"
                      style={{ backgroundColor: item.colour }}
                      aria-hidden="true"
                    />
                    <span className="block text-sm font-semibold">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Label</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <OptionButton
                  active={labelMode === "plain"}
                  title="Plain"
                  subtitle="Default label"
                  onClick={() => {
                    setLabelMode("plain");
                    clearArtwork();
                  }}
                />
                <OptionButton
                  active={labelMode === "artwork"}
                  title="Artwork"
                  subtitle="Upload your file"
                  onClick={() => setLabelMode("artwork")}
                />
              </div>

              {labelMode === "artwork" ? (
                <div className="rounded-lg border border-dashed border-foreground/20 bg-background p-4">
                  <Label htmlFor="artwork" className="flex cursor-pointer flex-col items-center justify-center text-center">
                    <FileUp className="mb-2 size-5 text-muted-foreground" />
                    <span className="font-semibold">Upload artwork</span>
                    <span className="mt-1 text-xs text-muted-foreground">PNG, JPG, SVG, or PDF under 10MB</span>
                  </Label>
                  <Input
                    id="artwork"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,application/pdf"
                    className="sr-only"
                    onChange={(event) => handleArtworkChange(event.target.files?.[0])}
                  />
                  {artworkFileName ? <p className="mt-3 text-sm text-muted-foreground">Selected: {artworkFileName}</p> : null}
                  {artworkStatus ? <p className="mt-1 text-xs text-muted-foreground">{artworkStatus}</p> : null}
                </div>
              ) : null}
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-3xl font-semibold tracking-tight">{formatMoney(totalPence)}</p>
                </div>
                <Badge variant="secondary">
                  {weight} x {quantity}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatMoney(unitAmountPence)} per unit
                {setupFeePence > 0 ? ` + ${formatMoney(setupFeePence)} setup` : ""}
              </p>
            </div>

            <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={!canAddToCart}>
              <ShoppingCart className="size-4" />
              Add to cart
            </Button>
            <div className="flex items-start gap-3 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <Package className="mt-0.5 size-4 shrink-0" />
              <p>Roasted, packed, and labelled to order. The coffee details and story are below.</p>
            </div>

            {addedItemId ? (
              <div className="rounded-lg border border-accent/40 bg-accent/15 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Check className="size-4" />
                  Added to cart
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" asChild>
                    <Link href="/cart">View cart</Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setAddedItemId(null)}>
                    Keep shopping
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function OptionButton({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition ${
        active ? "border-primary bg-secondary" : "bg-background hover:border-foreground/20"
      }`}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className="mt-1 block text-xs text-muted-foreground">{subtitle}</span>
    </button>
  );
}
