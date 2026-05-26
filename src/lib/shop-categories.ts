export type ShopCategory = {
  slug: string;
  name: string;
  description: string;
};

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    slug: "blends",
    name: "House picks",
    description: "Reliable catalogue coffees for simple everyday service and retail.",
  },
  {
    slug: "single-origin",
    name: "Single origins",
    description: "Named origins and producer lots for shelves, menus, and gifting.",
  },
  {
    slug: "decaf",
    name: "Decaf",
    description: "Swiss Water and sugar cane processes for full-flavour decaf service.",
  },
  {
    slug: "dark-roast",
    name: "Bold coffees",
    description: "Robusta and lower-acidity options for classic, milk-friendly profiles.",
  },
  {
    slug: "samples",
    name: "Subscriptions",
    description: "Rotating origin options for simple recurring coffee supply.",
  },
];

export function getShopCategory(slug: string) {
  return SHOP_CATEGORIES.find((c) => c.slug === slug) ?? null;
}
