import { asc, eq } from "drizzle-orm";

import { fallbackCatalogue, type Catalogue, type CoffeeProduct } from "./catalogue-data";
import { getDb, hasDatabaseUrl } from "./index";
import {
  bagOptions,
  bagSizes,
  coffeeProducts,
  grindOptions,
  labelOptions,
  productPrices,
} from "./schema";

export async function getCatalogue(): Promise<Catalogue> {
  if (!hasDatabaseUrl()) {
    return fallbackCatalogue;
  }

  try {
    const db = getDb();
    const [coffees, bags, sizes, labels, grinds, prices] = await Promise.all([
      db.select().from(coffeeProducts).where(eq(coffeeProducts.active, true)).orderBy(asc(coffeeProducts.name)),
      db.select().from(bagOptions).where(eq(bagOptions.active, true)).orderBy(asc(bagOptions.name)),
      db.select().from(bagSizes).where(eq(bagSizes.active, true)).orderBy(asc(bagSizes.grams)),
      db.select().from(labelOptions).where(eq(labelOptions.active, true)).orderBy(asc(labelOptions.name)),
      db.select().from(grindOptions).where(eq(grindOptions.active, true)).orderBy(asc(grindOptions.name)),
      db.select().from(productPrices).orderBy(asc(productPrices.minQuantity)),
    ]);

    return { coffees, bags, sizes, labels, grinds, prices };
  } catch (error) {
    console.warn("Falling back to seeded catalogue because database read failed.", error);
    return fallbackCatalogue;
  }
}

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

export function getCoffeeBySlug(catalogue: Catalogue, slugOrId: string): CoffeeProduct | null {
  return (
    catalogue.coffees.find((coffee) => coffee.slug === slugOrId || coffee.id === slugOrId) ?? null
  );
}

export function getCoffeesInShopCategory(catalogue: Catalogue, categorySlug: string) {
  return catalogue.coffees.filter((coffee) => coffee.shopCategorySlug === categorySlug);
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
