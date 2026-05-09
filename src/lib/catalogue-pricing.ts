import type { Catalogue } from "@/src/db/catalogue-data";

export function getBestPrice(
  catalogue: Catalogue,
  selection: {
    coffeeProductId: string;
    bagOptionId: string;
    bagSizeId: string;
    quantity: number;
  }
) {
  return catalogue.prices
    .filter(
      (price) =>
        price.coffeeProductId === selection.coffeeProductId &&
        price.bagOptionId === selection.bagOptionId &&
        price.bagSizeId === selection.bagSizeId &&
        price.minQuantity <= selection.quantity
    )
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];
}

export function getMinimumUnitPricePenceForCoffee(catalogue: Catalogue, coffeeProductId: string) {
  const amounts = catalogue.prices
    .filter((price) => price.coffeeProductId === coffeeProductId)
    .map((price) => price.unitAmountPence);

  if (!amounts.length) {
    return null;
  }

  return Math.min(...amounts);
}
