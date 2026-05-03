import { eq } from "drizzle-orm";

import { fallbackCatalogue } from "./catalogue-data";
import { getDb } from "./index";
import {
  bagOptions,
  bagSizes,
  coffeeProducts,
  grindOptions,
  labelOptions,
  productPrices,
} from "./schema";

async function upsertCatalogue() {
  const db = getDb();

  for (const coffee of fallbackCatalogue.coffees) {
    await db
      .insert(coffeeProducts)
      .values({
        id: coffee.id,
        name: coffee.name,
        slug: coffee.slug,
        description: coffee.description,
        tastingNotes: coffee.tastingNotes,
        originType: coffee.originType,
        shopCategorySlug: coffee.shopCategorySlug,
        subtitle: coffee.subtitle,
        roastLevel: coffee.roastLevel,
        heroImagePath: coffee.heroImagePath,
      })
      .onConflictDoUpdate({
        target: coffeeProducts.slug,
        set: {
          name: coffee.name,
          description: coffee.description,
          tastingNotes: coffee.tastingNotes,
          originType: coffee.originType,
          shopCategorySlug: coffee.shopCategorySlug,
          subtitle: coffee.subtitle,
          roastLevel: coffee.roastLevel,
          heroImagePath: coffee.heroImagePath,
          active: true,
        },
      });
  }

  for (const bag of fallbackCatalogue.bags) {
    await db
      .insert(bagOptions)
      .values(bag)
      .onConflictDoUpdate({
        target: bagOptions.slug,
        set: {
          name: bag.name,
          colour: bag.colour,
          finish: bag.finish,
          mockupAssetPath: bag.mockupAssetPath,
          active: true,
        },
      });
  }

  for (const size of fallbackCatalogue.sizes) {
    await db
      .insert(bagSizes)
      .values(size)
      .onConflictDoUpdate({
        target: bagSizes.slug,
        set: {
          label: size.label,
          grams: size.grams,
          active: true,
        },
      });
  }

  for (const label of fallbackCatalogue.labels) {
    await db
      .insert(labelOptions)
      .values(label)
      .onConflictDoUpdate({
        target: labelOptions.slug,
        set: {
          name: label.name,
          shape: label.shape,
          widthMm: label.widthMm,
          heightMm: label.heightMm,
          safeArea: label.safeArea,
          mockupPlacement: label.mockupPlacement,
          active: true,
        },
      });
  }

  for (const grind of fallbackCatalogue.grinds) {
    await db
      .insert(grindOptions)
      .values(grind)
      .onConflictDoUpdate({
        target: grindOptions.slug,
        set: {
          name: grind.name,
          description: grind.description,
          active: true,
        },
      });
  }

  for (const price of fallbackCatalogue.prices) {
    const [existing] = await db
      .select({ id: productPrices.id })
      .from(productPrices)
      .where(eq(productPrices.id, price.id));

    if (existing) {
      await db
        .update(productPrices)
        .set({
          minQuantity: price.minQuantity,
          unitAmountPence: price.unitAmountPence,
          setupFeePence: price.setupFeePence,
          currency: price.currency,
        })
        .where(eq(productPrices.id, price.id));
    } else {
      await db.insert(productPrices).values(price);
    }
  }
}

upsertCatalogue()
  .then(() => {
    console.log("Seeded MyRoaster catalogue.");
  })
  .catch((error) => {
    console.error("Failed to seed catalogue.", error);
    process.exit(1);
  });
