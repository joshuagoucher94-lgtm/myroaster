export type ShopCategory = {
  slug: string;
  name: string;
  description: string;
};

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    slug: "blends",
    name: "Blends & house coffees",
    description: "Consistent profiles for espresso, batch brew, and everyday service.",
  },
  {
    slug: "single-origin",
    name: "Single origins",
    description: "Named lots with clearer provenance for shelves and menus.",
  },
  {
    slug: "decaf",
    name: "Decaf",
    description: "Swiss Water and sugar cane processes for full-flavour decaf service.",
  },
  {
    slug: "dark-roast",
    name: "Dark & omni roasts",
    description: "Bold roasts for milk-forward drinks and classic cafe customers.",
  },
  {
    slug: "samples",
    name: "Samples & trial packs",
    description: "Smaller runs to taste before you commit to a white-label line.",
  },
];

export function getShopCategory(slug: string) {
  return SHOP_CATEGORIES.find((c) => c.slug === slug) ?? null;
}
