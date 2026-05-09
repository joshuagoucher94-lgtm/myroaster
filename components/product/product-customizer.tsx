"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, FileUp, ShoppingCart } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Catalogue, type CoffeeProduct, formatMoney } from "@/src/db/catalogue-data";
import { getBestPrice } from "@/src/lib/catalogue-pricing";
import { makeCartItemId } from "@/src/lib/cart";

type Props = {
  catalogue: Catalogue;
  coffee: CoffeeProduct;
};

type Tier = {
  label: string;
  quantity: number;
  totalPence: number;
  helper: string;
  badge?: string;
};

const tradeTiers: Tier[] = [
  { label: "1kg Trial", quantity: 1, totalPence: 2800, helper: "+ delivery" },
  { label: "3kg Mini", quantity: 3, totalPence: 7200, helper: "+ delivery" },
  { label: "6kg Starter", quantity: 6, totalPence: 12600, helper: "delivered" },
  { label: "12kg Trade", quantity: 12, totalPence: 21600, helper: "delivered", badge: "Best value" },
  { label: "24kg Trade Plus", quantity: 24, totalPence: 40800, helper: "delivered" },
];

const retailTiers: Tier[] = [
  { label: "12 bags", quantity: 12, totalPence: 8700, helper: "+ delivery" },
  { label: "24 bags", quantity: 24, totalPence: 15600, helper: "delivered" },
  { label: "48 bags", quantity: 48, totalPence: 28800, helper: "delivered", badge: "Best value" },
  { label: "96 bags", quantity: 96, totalPence: 52800, helper: "delivered" },
  { label: "192 bags", quantity: 192, totalPence: 96000, helper: "delivered" },
];

export function ProductCustomizer({ catalogue, coffee }: Props) {
  const { addItem } = useCart();
  const tradeSize = catalogue.sizes.find((item) => item.slug === "1kg") ?? catalogue.sizes[0];
  const retailSize = catalogue.sizes.find((item) => item.slug === "250g") ?? catalogue.sizes[0];
  const [format, setFormat] = useState<"trade" | "retail">("trade");
  const [bagOptionId, setBagOptionId] = useState(catalogue.bags[0]?.id ?? "");
  const [labelOptionId, setLabelOptionId] = useState(catalogue.labels[0]?.id ?? "");
  const [grindOptionId, setGrindOptionId] = useState(catalogue.grinds[0]?.id ?? "");
  const [selectedTierIndex, setSelectedTierIndex] = useState(3);
  const [brandName, setBrandName] = useState("");
  const [labelTitle, setLabelTitle] = useState("House Espresso");
  const [productionNotes, setProductionNotes] = useState("");
  const [artworkFileName, setArtworkFileName] = useState("");
  const [artworkPreview, setArtworkPreview] = useState("");
  const [artworkStatus, setArtworkStatus] = useState("");
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<"format" | "options" | "brand">("format");

  const tiers = format === "trade" ? tradeTiers : retailTiers;
  const tier = tiers[Math.min(selectedTierIndex, tiers.length - 1)] ?? tiers[0];
  const size = format === "trade" ? tradeSize : retailSize;
  const bag = catalogue.bags.find((item) => item.id === bagOptionId);
  const label = catalogue.labels.find((item) => item.id === labelOptionId);
  const grind = catalogue.grinds.find((item) => item.id === grindOptionId);
  const price = useMemo(
    () =>
      size
        ? getBestPrice(catalogue, {
            coffeeProductId: coffee.id,
            bagOptionId,
            bagSizeId: size.id,
            quantity: tier.quantity,
          })
        : undefined,
    [bagOptionId, catalogue, coffee.id, size, tier.quantity]
  );
  const unitAmountPence = price?.unitAmountPence ?? Math.round(tier.totalPence / tier.quantity);
  const setupFeePence = price?.setupFeePence ?? 0;
  const subtotalPence = unitAmountPence * tier.quantity;
  const totalPence = subtotalPence + setupFeePence;
  const canAddToCart = Boolean(bag && size && label && grind);

  function handleFormatChange(nextFormat: "trade" | "retail") {
    setFormat(nextFormat);
    setSelectedTierIndex(nextFormat === "trade" ? 3 : 2);
    setOpenSection("options");
  }

  function handleAddToCart() {
    if (!bag || !size || !label || !grind) {
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
      labelOptionId: label.id,
      labelName: label.name,
      labelShape: label.shape,
      grindOptionId: grind.id,
      grindName: grind.name,
      quantity: tier.quantity,
      unitAmountPence,
      setupFeePence,
      subtotalPence,
      totalPence,
      currency: price?.currency ?? "gbp",
      brandName: brandName.trim(),
      labelTitle: labelTitle.trim() || coffee.name,
      artworkFileName,
      productionNotes: productionNotes.trim(),
    });
    setAddedItemId(id);
  }

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
        : "Logo selected for this preview."
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.82fr)] xl:gap-10">
      <div className="space-y-6">
        <div className="grid gap-4">
          <Card className="soft-panel overflow-hidden rounded-[1.75rem]">
            <CardContent className="p-4 sm:p-6">
              <div className="soft-inset relative aspect-square rounded-[1.5rem]">
                {bag ? (
                  <Image
                    src={bag.mockupAssetPath}
                    alt={`${bag.name} coffee bag`}
                    fill
                    priority
                    className="object-contain p-8 sm:p-10"
                    sizes="(max-width: 1024px) 100vw, 52vw"
                  />
                ) : null}
                {label ? (
                  <div
                    className="absolute overflow-hidden border border-foreground/10 bg-[#f8f7f2] shadow-[0_16px_30px_oklch(0.2_0.02_245_/_0.18)]"
                    style={{
                      left: `${label.mockupPlacement.x}%`,
                      top: `${label.mockupPlacement.y}%`,
                      width: `${label.mockupPlacement.width}%`,
                      height: `${label.mockupPlacement.height}%`,
                      borderRadius:
                        label.mockupPlacement.radius >= 999 ? "999px" : `${label.mockupPlacement.radius * 3}px`,
                    }}
                  >
                    <div className="relative flex h-full flex-col items-center justify-center p-3 text-center">
                      {artworkPreview ? (
                        <Image
                          src={artworkPreview}
                          alt="Selected logo preview"
                          fill
                          className="object-cover"
                          sizes="10rem"
                          unoptimized
                        />
                      ) : (
                        <>
                          <span className="line-clamp-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {brandName || "Your logo"}
                          </span>
                          <span className="mt-2 line-clamp-2 text-sm font-semibold leading-tight text-foreground">
                            {labelTitle || "Your Coffee"}
                          </span>
                          <span className="mt-2 text-[0.64rem] text-muted-foreground">
                            Roasted for your brand
                          </span>
                          <span className="mt-1 text-[0.64rem] text-muted-foreground">{size?.label}</span>
                        </>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <GalleryTile
              title="Bag style"
              body={bag ? `${bag.name} · ${bag.finish}` : "Choose your preferred bag finish."}
              badge={size?.label ?? "Bag size"}
            />
            <GalleryTile
              title="Coffee profile"
              body={coffee.tastingNotes.join(" · ")}
              badge={coffee.roastLevel}
            />
            <GalleryTile
              title="Branding"
              body={artworkFileName ? `Logo selected: ${artworkFileName}` : "Template label or logo upload supported."}
              badge={artworkFileName ? "Custom logo" : "Template ready"}
            />
          </div>
        </div>

        <Card className="soft-panel-sm rounded-[1.5rem]">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailBlock label="Coffee profile" value={coffee.name} description={coffee.subtitle} />
            <DetailBlock
              label="Bag format"
              value={format === "trade" ? "1kg trade bags" : "250g retail bags"}
              description={format === "trade" ? "Built for service and house espresso." : "Built for shelves, gifting, and resale."}
            />
            <DetailBlock label="Grind option" value={grind?.name ?? "Not selected"} description="Change this before adding to cart." />
            <DetailBlock
              label="Label template"
              value={label?.name ?? "Not selected"}
              description={label ? `${label.widthMm} x ${label.heightMm}mm` : "Choose a placement style."}
            />
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <Card className="soft-panel-sm rounded-[1.5rem]">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">myroaster</p>
              <div className="flex flex-wrap gap-2">
                <Badge>{coffee.roastLevel}</Badge>
                <Badge variant="outline">{coffee.originType}</Badge>
                <Badge variant="secondary">Custom label ready</Badge>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{coffee.name}</h1>
                <p className="mt-2 text-base leading-7 text-muted-foreground">{coffee.subtitle}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
                <p className="text-sm text-muted-foreground">Price</p>
                <div className="mt-1 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">{formatMoney(totalPence)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMoney(unitAmountPence)} per unit
                      {setupFeePence > 0 ? ` + ${formatMoney(setupFeePence)} setup` : ""}
                    </p>
                  </div>
                  {tier.badge ? <Badge variant="secondary">{tier.badge}</Badge> : null}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {tier.helper} for the selected tier. Standard template labels avoid setup fees.
                </p>
              </div>
              <div className="grid gap-2 text-sm">
                <ValuePoint text="Choose trade or retail packaging" />
                <ValuePoint text="Upload a logo or use a clean template label" />
                <ValuePoint text="Live pricing updates as you configure" />
              </div>
            </div>

            <div className="space-y-4 border-t border-border/70 pt-5">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <SummaryRow label="Selected product" value={format === "trade" ? "1kg branded trade bags" : "250g branded retail bags"} />
                <SummaryRow label="Coffee profile" value={coffee.name} />
                <SummaryRow label="Quantity" value={tier.label} />
                <SummaryRow label="Grind" value={grind?.name} />
                <SummaryRow label="Label" value={artworkFileName ? "Logo selected" : "Template label included"} />
              </div>
              <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={!canAddToCart}>
                <ShoppingCart className="size-4" />
                Add to cart
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Taxes and final shipping are calculated at checkout if applicable.
              </p>
              {addedItemId ? (
                <div className="rounded-2xl border border-accent/40 bg-accent/15 p-3 text-sm">
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
            </div>
          </CardContent>
        </Card>

        <Card className="soft-panel-sm rounded-[1.5rem]">
          <CardContent className="space-y-3 p-4 sm:p-5">
            <SectionPanel
              step="01"
              title="Format and quantity"
              summary={`${format === "trade" ? "Trade" : "Retail"} · ${tier.label}`}
              subtitle="Pick the pack type and tier first."
              open={openSection === "format"}
              onToggle={() => setOpenSection(openSection === "format" ? "options" : "format")}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <FormatButton
                  active={format === "trade"}
                  title="1kg Branded Trade Bags"
                  description="For serving your own house coffee."
                  meta="Best from 12kg"
                  onClick={() => handleFormatChange("trade")}
                />
                <FormatButton
                  active={format === "retail"}
                  title="250g Branded Retail Bags"
                  description="Retail-ready bags with your brand on the label."
                  meta="Best from 48 bags"
                  onClick={() => handleFormatChange("retail")}
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {tiers.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedTierIndex(index);
                      setOpenSection("options");
                    }}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selectedTierIndex === index
                        ? "soft-inset border-primary/35"
                        : "bg-background/75 hover:border-foreground/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-sm font-medium">{formatMoney(item.totalPence)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{item.helper}</span>
                      {item.badge ? <span>{item.badge}</span> : null}
                    </div>
                  </button>
                ))}
              </div>
            </SectionPanel>

            <SectionPanel
              step="02"
              title="Pack options"
              summary={`${bag?.name ?? "Bag"} · ${grind?.name ?? "Grind"} · ${label?.name ?? "Label"}`}
              subtitle="Choose finish, grind, and label style."
              open={openSection === "options"}
              onToggle={() => setOpenSection(openSection === "options" ? "brand" : "options")}
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Bag finish</Label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {catalogue.bags.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setBagOptionId(item.id);
                          setOpenSection("brand");
                        }}
                        className={`rounded-2xl border p-3 text-left transition ${
                          bagOptionId === item.id ? "soft-inset border-primary/35" : "bg-background/75 hover:border-foreground/20"
                        }`}
                      >
                        <span
                          className="mb-3 block size-9 rounded-full border border-foreground/10"
                          style={{ backgroundColor: item.colour }}
                          aria-hidden="true"
                        />
                        <span className="block text-sm font-semibold">{item.name}</span>
                        <span className="block text-xs text-muted-foreground">{item.finish}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <SelectorGroup
                  label="Grind"
                  options={catalogue.grinds}
                  value={grindOptionId}
                  onChange={(value) => {
                    setGrindOptionId(value);
                    setOpenSection("brand");
                  }}
                />
                <SelectorGroup
                  label="Label template"
                  options={catalogue.labels.map((item) => ({
                    id: item.id,
                    name: item.name,
                    description: `${item.widthMm} x ${item.heightMm}mm`,
                  }))}
                  value={labelOptionId}
                  onChange={(value) => {
                    setLabelOptionId(value);
                    setOpenSection("brand");
                  }}
                />
              </div>
            </SectionPanel>

            <SectionPanel
              step="03"
              title="Brand details"
              summary={brandName || artworkFileName ? `${brandName || "Brand added"}${artworkFileName ? " · Logo uploaded" : ""}` : "Optional"}
              subtitle="Add label text, upload artwork, and leave notes."
              open={openSection === "brand"}
              onToggle={() => setOpenSection(openSection === "brand" ? "format" : "brand")}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand name</Label>
                  <Input
                    id="brandName"
                    value={brandName}
                    placeholder="Your cafe, office, or shop"
                    onChange={(event) => setBrandName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labelTitle">Coffee name on label</Label>
                  <Input
                    id="labelTitle"
                    value={labelTitle}
                    onChange={(event) => setLabelTitle(event.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-dashed border-foreground/20 bg-background/60 p-5">
                <Label htmlFor="artwork" className="flex cursor-pointer flex-col items-center justify-center text-center">
                  <FileUp className="mb-3 size-6 text-muted-foreground" />
                  <span className="font-semibold">Upload your logo</span>
                  <span className="mt-1 text-sm text-muted-foreground">PNG, JPG, SVG, or PDF under 10MB</span>
                </Label>
                <Input
                  id="artwork"
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,application/pdf"
                  className="sr-only"
                  onChange={(event) => handleArtworkChange(event.target.files?.[0])}
                />
                {artworkFileName ? <p className="mt-3 text-sm text-muted-foreground">Selected: {artworkFileName}</p> : null}
                {artworkStatus ? <p className="mt-2 text-sm text-muted-foreground">{artworkStatus}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="productionNotes">Optional notes</Label>
                <Textarea
                  id="productionNotes"
                  placeholder="Artwork direction, label copy, delivery preferences, or anything we should confirm."
                  value={productionNotes}
                  onChange={(event) => setProductionNotes(event.target.value)}
                />
              </div>
            </SectionPanel>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function SectionPanel({
  step,
  title,
  summary,
  subtitle,
  open,
  onToggle,
  children,
}: {
  step: string;
  title: string;
  summary: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.4rem] border border-border/70 bg-background/70">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 p-4 text-left sm:p-5"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground">
              {step}
            </span>
            <h2 className="font-semibold">{title}</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <p className="mt-2 truncate text-sm font-medium text-foreground/80">{summary}</p>
        </div>
        <span className={`mt-1 rounded-full border border-border/80 p-2 transition ${open ? "rotate-180" : ""}`}>
          <ChevronDown className="size-4" />
        </span>
      </button>
      {open ? <div className="space-y-4 border-t border-border/70 p-4 pt-4 sm:p-5">{children}</div> : null}
    </section>
  );
}

function DetailBlock({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function GalleryTile({ title, body, badge }: { title: string; body: string; badge: string }) {
  return (
    <Card className="soft-panel-sm rounded-[1.35rem]">
      <CardContent className="space-y-3 p-4">
        <Badge variant="secondary" className="w-fit rounded-full">
          {badge}
        </Badge>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FormatButton({
  active,
  title,
  description,
  meta,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active ? "soft-inset border-primary/35" : "bg-background/75 hover:border-foreground/20"
      }`}
    >
      <span className="text-sm font-semibold tracking-tight sm:text-base">{title}</span>
      <span className="mt-2 block text-sm leading-6 text-muted-foreground">{description}</span>
      <span className="mt-4 inline-flex rounded-full bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
        {meta}
      </span>
    </button>
  );
}

function SelectorGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; name: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              value === option.id ? "soft-inset border-primary/35" : "bg-background/75 hover:border-foreground/20"
            }`}
          >
            <span className="block text-sm font-semibold">{option.name}</span>
            {option.description ? (
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">{option.description}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value ?? "Not selected"}</span>
    </div>
  );
}

function ValuePoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-5 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
        <Check className="size-3.5" />
      </span>
      <span>{text}</span>
    </div>
  );
}
