import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CoffeeProduct } from "@/src/db/catalogue-data";
import { formatMoney } from "@/src/db/catalogue-data";

type Props = {
  coffee: CoffeeProduct;
  fromPricePence: number | null;
};

export function CoffeeProductCard({ coffee, fromPricePence }: Props) {
  return (
    <Link href={`/shop/coffee/${coffee.slug}`} className="group block">
      <Card className="h-full overflow-hidden border-border/80 transition-shadow group-hover:shadow-lg">
        <div className="relative aspect-[4/3] bg-muted">
          <Image
            src={coffee.heroImagePath}
            alt={coffee.name}
            fill
            className="object-contain p-6 transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <CardContent className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{coffee.roastLevel}</Badge>
            <Badge variant="outline" className="capitalize">
              {coffee.shopCategorySlug.replace(/-/g, " ")}
            </Badge>
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight group-hover:underline">{coffee.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{coffee.subtitle}</p>
          </div>
          <p className="text-sm font-medium">
            {fromPricePence != null ? (
              <>
                From {formatMoney(fromPricePence)}
                <span className="font-normal text-muted-foreground"> / bag (MOQ applies)</span>
              </>
            ) : (
              <span className="text-muted-foreground">Pricing on request</span>
            )}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
