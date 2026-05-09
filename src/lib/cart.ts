import type { ProductPrice } from "@/src/db/catalogue-data";

export type CartItem = {
  id: string;
  addedAt: string;
  coffeeProductId: string;
  coffeeName: string;
  coffeeSlug: string;
  coffeeImagePath: string;
  roastLevel: string;
  tastingNotes: string[];
  bagOptionId: string;
  bagName: string;
  bagFinish: string;
  bagMockupAssetPath: string;
  bagSizeId: string;
  bagSizeLabel: string;
  labelOptionId: string;
  labelName: string;
  labelShape: string;
  grindOptionId: string;
  grindName: string;
  quantity: number;
  unitAmountPence: number;
  setupFeePence: number;
  subtotalPence: number;
  totalPence: number;
  currency: ProductPrice["currency"];
  brandName: string;
  labelTitle: string;
  artworkFileName: string;
  productionNotes: string;
};

export type CartTotals = {
  itemCount: number;
  bagCount: number;
  subtotalPence: number;
  setupFeePence: number;
  totalPence: number;
};

export const CART_STORAGE_KEY = "myroaster.cart.v1";

export function getCartTotals(items: CartItem[]): CartTotals {
  return items.reduce<CartTotals>(
    (totals, item) => ({
      itemCount: totals.itemCount + 1,
      bagCount: totals.bagCount + item.quantity,
      subtotalPence: totals.subtotalPence + item.subtotalPence,
      setupFeePence: totals.setupFeePence + item.setupFeePence,
      totalPence: totals.totalPence + item.totalPence,
    }),
    {
      itemCount: 0,
      bagCount: 0,
      subtotalPence: 0,
      setupFeePence: 0,
      totalPence: 0,
    }
  );
}

export function makeCartItemId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `cart_${crypto.randomUUID()}`;
  }

  return `cart_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
