"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { getBestPrice } from "@/src/db/catalogue";
import { type Catalogue, formatMoney } from "@/src/db/catalogue-data";

type Props = {
  catalogue: Catalogue;
  initialCoffeeSlugOrId?: string | null;
};

function resolveCoffeeProductId(catalogue: Catalogue, slugOrId?: string | null) {
  if (!slugOrId) {
    return catalogue.coffees[0]?.id ?? "";
  }

  const bySlug = catalogue.coffees.find((coffee) => coffee.slug === slugOrId);
  if (bySlug) {
    return bySlug.id;
  }

  const byId = catalogue.coffees.find((coffee) => coffee.id === slugOrId);
  return byId?.id ?? catalogue.coffees[0]?.id ?? "";
}

export function CoffeeConfigurator({ catalogue, initialCoffeeSlugOrId }: Props) {
  const [coffeeProductId, setCoffeeProductId] = useState(() =>
    resolveCoffeeProductId(catalogue, initialCoffeeSlugOrId)
  );
  const [bagOptionId, setBagOptionId] = useState(catalogue.bags[0]?.id ?? "");
  const [bagSizeId, setBagSizeId] = useState(catalogue.sizes[0]?.id ?? "");
  const [labelOptionId, setLabelOptionId] = useState(catalogue.labels[0]?.id ?? "");
  const [grindOptionId, setGrindOptionId] = useState(catalogue.grinds[0]?.id ?? "");
  const [quantity, setQuantity] = useState(50);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [productionNotes, setProductionNotes] = useState("");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coffee = catalogue.coffees.find((item) => item.id === coffeeProductId);
  const bag = catalogue.bags.find((item) => item.id === bagOptionId);
  const size = catalogue.sizes.find((item) => item.id === bagSizeId);
  const label = catalogue.labels.find((item) => item.id === labelOptionId);
  const grind = catalogue.grinds.find((item) => item.id === grindOptionId);
  const price = useMemo(
    () => getBestPrice(catalogue, { coffeeProductId, bagOptionId, bagSizeId, quantity }),
    [bagOptionId, bagSizeId, catalogue, coffeeProductId, quantity]
  );
  const subtotalPence = price ? price.unitAmountPence * quantity : 0;
  const totalPence = subtotalPence + (price?.setupFeePence ?? 0);

  function handleArtworkChange(file: File | undefined) {
    if (!file) {
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setStatus("Please upload a PNG, JPG, SVG, or PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatus("Please keep artwork below 10MB.");
      return;
    }

    if (artworkPreview) {
      URL.revokeObjectURL(artworkPreview);
    }

    setArtworkFile(file);
    setArtworkPreview(file.type === "application/pdf" ? "" : URL.createObjectURL(file));
    setStatus(file.type === "application/pdf" ? "PDF uploaded. Preview uses a placeholder label." : "");
  }

  function handleSampleArtwork() {
    const brandName = businessName || "My Cafe";
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
        <rect width="900" height="1200" fill="#fff8ed"/>
        <rect x="70" y="70" width="760" height="1060" rx="48" fill="none" stroke="#2a1a10" stroke-width="18"/>
        <text x="450" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#2a1a10">${brandName}</text>
        <text x="450" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" fill="#7b4a24">${coffee?.name ?? "House Blend"}</text>
        <circle cx="450" cy="620" r="120" fill="#b88752"/>
        <text x="450" y="665" text-anchor="middle" font-family="Arial, sans-serif" font-size="110" fill="#fff8ed">MR</text>
        <text x="450" y="900" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" letter-spacing="8" fill="#2a1a10">WHITE LABEL COFFEE</text>
      </svg>`;
    const file = new File([svg], "sample-myroaster-label.svg", { type: "image/svg+xml" });

    handleArtworkChange(file);
  }

  async function handleCheckout() {
    if (!artworkFile) {
      setStatus("Upload label artwork before checkout.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Uploading artwork...");

    try {
      const uploadForm = new FormData();
      uploadForm.set("file", artworkFile);
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });
      const uploadResult = (await uploadResponse.json()) as { url?: string; error?: string };

      if (!uploadResponse.ok || !uploadResult.url) {
        throw new Error(uploadResult.error ?? "Artwork upload failed.");
      }

      setStatus("Creating checkout...");
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coffeeProductId,
          bagOptionId,
          bagSizeId,
          labelOptionId,
          grindOptionId,
          quantity,
          artworkUrl: uploadResult.url,
          businessName,
          contactName,
          customerEmail,
          productionNotes,
        }),
      });
      const checkoutResult = (await checkoutResponse.json()) as { url?: string; error?: string };

      if (!checkoutResponse.ok || !checkoutResult.url) {
        throw new Error(checkoutResult.error ?? "Checkout creation failed.");
      }

      window.location.href = checkoutResult.url;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Coffee and bag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Coffee offering</Label>
              <RadioGroup value={coffeeProductId} onValueChange={setCoffeeProductId} className="grid gap-3">
                {catalogue.coffees.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border p-4 has-[[data-state=checked]]:border-primary"
                  >
                    <RadioGroupItem id={item.id} value={item.id} />
                    <Label htmlFor={item.id} className="block flex-1 cursor-pointer space-y-1">
                      <span className="block font-medium">{item.name}</span>
                      <span className="block text-sm text-muted-foreground">{item.description}</span>
                      <span className="flex flex-wrap gap-2 pt-1">
                        {item.tastingNotes.map((note) => (
                          <Badge key={note} variant="secondary">
                            {note}
                          </Badge>
                        ))}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Bag colour</Label>
                <Select value={bagOptionId} onValueChange={setBagOptionId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogue.bags.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} · {item.finish}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bag size</Label>
                <Select value={bagSizeId} onValueChange={setBagSizeId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogue.sizes.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Grind</Label>
                <Select value={grindOptionId} onValueChange={setGrindOptionId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogue.grinds.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Label shape</Label>
                <Select value={labelOptionId} onValueChange={setLabelOptionId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogue.labels.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} · {item.widthMm} x {item.heightMm}mm
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Quantity</Label>
                <span className="text-sm font-medium">{quantity} bags</span>
              </div>
              <Slider
                value={[quantity]}
                min={25}
                max={250}
                step={25}
                onValueChange={([value]) => setQuantity(value ?? 25)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Artwork and business details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-8 text-center">
              <UploadCloud className="size-8 text-muted-foreground" />
              <span className="font-medium">Upload label artwork</span>
              <span className="text-sm text-muted-foreground">
                PNG, JPG, SVG, or PDF. Recommended: 300dpi with 3mm bleed.
              </span>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,application/pdf"
                className="hidden"
                onChange={(event) => handleArtworkChange(event.target.files?.[0])}
              />
            </Label>

            {artworkFile ? (
              <p className="text-sm text-muted-foreground">Selected: {artworkFile.name}</p>
            ) : null}
            <Button type="button" variant="outline" className="w-full" onClick={handleSampleArtwork}>
              Use sample artwork for demo checkout
            </Button>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input id="businessName" value={businessName} onChange={(event) => setBusinessName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <Input id="contactName" value={contactName} onChange={(event) => setContactName(event.target.value)} />
              </div>
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
            <div className="space-y-2">
              <Label htmlFor="productionNotes">Production notes</Label>
              <Textarea
                id="productionNotes"
                placeholder="Anything we should know about your label, coffee use, or delivery?"
                value={productionNotes}
                onChange={(event) => setProductionNotes(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Live bag mockup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto aspect-[7/9] max-w-md">
              {bag ? (
                <Image src={bag.mockupAssetPath} alt={`${bag.name} coffee bag`} fill priority className="object-contain" />
              ) : null}
              {label ? (
                <div
                  className="absolute overflow-hidden border bg-white shadow-xl"
                  style={{
                    left: `${label.mockupPlacement.x}%`,
                    top: `${label.mockupPlacement.y}%`,
                    width: `${label.mockupPlacement.width}%`,
                    height: `${label.mockupPlacement.height}%`,
                    borderRadius:
                      label.mockupPlacement.radius >= 999 ? "999px" : `${label.mockupPlacement.radius * 3}px`,
                    backgroundImage: artworkPreview ? `url(${artworkPreview})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!artworkPreview ? (
                    <div className="flex h-full flex-col items-center justify-center p-4 text-center text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{businessName || "Your brand"}</span>
                      <span>{coffee?.name ?? "Coffee label"}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SummaryRow label="Coffee" value={coffee?.name} />
            <SummaryRow label="Bag" value={bag ? `${bag.name}, ${size?.label}` : undefined} />
            <SummaryRow label="Grind" value={grind?.name} />
            <SummaryRow label="Label" value={label?.name} />
            <SummaryRow label="Quantity" value={`${quantity} bags`} />
            <Separator />
            <SummaryRow label="Unit price" value={price ? formatMoney(price.unitAmountPence) : "Unavailable"} />
            <SummaryRow label="Subtotal" value={formatMoney(subtotalPence)} />
            <SummaryRow label="Setup fee" value={formatMoney(price?.setupFeePence ?? 0)} />
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatMoney(totalPence)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isSubmitting || !price}>
              {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Continue to checkout
            </Button>
            {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value ?? "Not selected"}</span>
    </div>
  );
}
