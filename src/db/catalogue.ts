import { asc, eq } from "drizzle-orm";

import { fallbackCatalogue, type Catalogue, type CoffeeProduct } from "./catalogue-data";
import { getDb, hasDatabaseUrl } from "./index";
export {
  getBestPrice,
  getMinimumUnitPricePenceForCoffee,
} from "@/src/lib/catalogue-pricing";
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

export function getCoffeeBySlug(catalogue: Catalogue, slugOrId: string): CoffeeProduct | null {
  return (
    catalogue.coffees.find((coffee) => coffee.slug === slugOrId || coffee.id === slugOrId) ?? null
  );
}

export function getCoffeesInShopCategory(catalogue: Catalogue, categorySlug: string) {
  return catalogue.coffees.filter((coffee) => coffee.shopCategorySlug === categorySlug);
}
