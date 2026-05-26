import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

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
    <Card className="group h-full overflow-hidden rounded-lg border-border/80 bg-card shadow-none transition hover:border-foreground/20">
      <Link href={`/shop/coffee/${coffee.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-muted">
          <Image
            src={coffee.heroImagePath}
            alt={coffee.name}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="space-y-3 p-4">
        <div>
          <Link href={`/shop/coffee/${coffee.slug}`} className="group/title">
            <h2 className="line-clamp-2 text-base font-semibold tracking-tight group-hover/title:underline">
              {coffee.name}
            </h2>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{coffee.originType}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-sm">
            {coffee.roastLevel}
          </Badge>
          <Badge variant="outline" className="rounded-sm">
            Custom label
          </Badge>
        </div>
        <p className="text-base font-semibold">
          {fromPricePence != null ? (
            <>
              From {formatMoney(fromPricePence)}
              <span className="text-sm font-normal text-muted-foreground"> per bag</span>
            </>
          ) : (
            <span className="text-muted-foreground">Pricing on request</span>
          )}
        </p>
        <Button asChild className="w-full">
          <Link href={`/shop/coffee/${coffee.slug}#customize`}>
            <ShoppingBag className="size-4" />
            Choose options
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
