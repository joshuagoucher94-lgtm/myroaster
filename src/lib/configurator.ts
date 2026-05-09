import { z } from "zod";

import { getBestPrice, getCatalogue } from "@/src/db/catalogue";

export const checkoutSchema = z.object({
  coffeeProductId: z.string().min(1),
  bagOptionId: z.string().min(1),
  bagSizeId: z.string().min(1),
  labelOptionId: z.string().min(1),
  grindOptionId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(1000),
  artworkUrl: z.string().min(1),
  businessName: z.string().min(2).max(120),
  contactName: z.string().min(2).max(120),
  customerEmail: z.email(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export async function priceConfiguration(input: CheckoutInput) {
  const catalogue = await getCatalogue();
  const coffee = catalogue.coffees.find((item) => item.id === input.coffeeProductId);
  const bag = catalogue.bags.find((item) => item.id === input.bagOptionId);
  const size = catalogue.sizes.find((item) => item.id === input.bagSizeId);
  const label = catalogue.labels.find((item) => item.id === input.labelOptionId);
  const grind = catalogue.grinds.find((item) => item.id === input.grindOptionId);
  const price = getBestPrice(catalogue, input);

  if (!coffee || !bag || !size || !label || !grind || !price) {
    throw new Error("The selected configuration is no longer available.");
  }

  const subtotalPence = price.unitAmountPence * input.quantity;
  const totalPence = subtotalPence + price.setupFeePence;

  return {
    coffee,
    bag,
    size,
    label,
    grind,
    unitAmountPence: price.unitAmountPence,
    setupFeePence: price.setupFeePence,
    subtotalPence,
    totalPence,
    currency: price.currency,
  };
}

export function createOrderId() {
  return `order_${crypto.randomUUID()}`;
}

export function createOrderItemId() {
  return `order_item_${crypto.randomUUID()}`;
}
