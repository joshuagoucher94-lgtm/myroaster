import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CoffeeProduct } from "@/src/db/catalogue-data";
import { formatMoney } from "@/src/db/catalogue-data";

type Props = {
  coffee: CoffeeProduct;
  fromPricePence: number | null;
};

export function CoffeeProductCard({ coffee, fromPricePence }: Props) {
  return (
    <Card className="soft-panel-sm group h-full overflow-hidden rounded-[1.5rem] transition hover:-translate-y-0.5">
      <Link href={`/shop/coffee/${coffee.slug}`} className="block">
        <div className="soft-inset relative m-4 mb-0 aspect-[4/3] rounded-[1.25rem]">
          <div className="absolute left-4 top-4 z-10 rounded-full bg-card/80 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
            Your label ready
          </div>
          <Image
            src={coffee.heroImagePath}
            alt={coffee.name}
            fill
            className="object-contain p-7 transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{coffee.roastLevel}</Badge>
          <Badge variant="outline" className="capitalize">
            {coffee.originType}
          </Badge>
        </div>
        <div>
          <Link href={`/shop/coffee/${coffee.slug}`} className="group/title">
            <h2 className="text-lg font-semibold tracking-tight group-hover/title:underline">
              {coffee.name}
            </h2>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{coffee.subtitle}</p>
        </div>
        <div className="grid gap-2 rounded-2xl bg-background/45 p-3 text-sm">
          <span className="flex items-center gap-2 font-medium">
            <Boxes className="size-4 text-muted-foreground" />
            1kg trade bags or 250g retail bags
          </span>
          <span className="text-muted-foreground">Template label included · upload your logo</span>
        </div>
        <p className="text-sm font-semibold">
          {fromPricePence != null ? (
            <>
              From {formatMoney(fromPricePence)}
              <span className="font-normal text-muted-foreground"> per unit</span>
            </>
          ) : (
            <span className="text-muted-foreground">Pricing on request</span>
          )}
        </p>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Button asChild>
            <Link href={`/shop/coffee/${coffee.slug}#customize`}>
              <ShoppingBag className="size-4" />
              Customize
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild aria-label={`View ${coffee.name}`}>
            <Link href={`/shop/coffee/${coffee.slug}`}>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
