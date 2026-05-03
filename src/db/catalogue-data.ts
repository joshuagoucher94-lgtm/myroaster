export type CoffeeProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  tastingNotes: string[];
  originType: string;
  shopCategorySlug: string;
  subtitle: string;
  roastLevel: string;
  heroImagePath: string;
};

export type BagOption = {
  id: string;
  name: string;
  slug: string;
  colour: string;
  finish: string;
  mockupAssetPath: string;
};

export type BagSize = {
  id: string;
  label: string;
  slug: string;
  grams: number;
};

export type LabelOption = {
  id: string;
  name: string;
  slug: string;
  shape: string;
  widthMm: string;
  heightMm: string;
  safeArea: { top: number; right: number; bottom: number; left: number };
  mockupPlacement: { x: number; y: number; width: number; height: number; radius: number };
};

export type GrindOption = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type ProductPrice = {
  id: string;
  coffeeProductId: string;
  bagOptionId: string;
  bagSizeId: string;
  minQuantity: number;
  unitAmountPence: number;
  setupFeePence: number;
  currency: string;
};

export type Catalogue = {
  coffees: CoffeeProduct[];
  bags: BagOption[];
  sizes: BagSize[];
  labels: LabelOption[];
  grinds: GrindOption[];
  prices: ProductPrice[];
};

export const fallbackCatalogue: Catalogue = {
  coffees: [
    {
      id: "coffee-house-blend",
      name: "House Blend",
      slug: "house-blend",
      subtitle: "Your everyday house espresso and milk drink base.",
      description:
        "A dependable, rounded espresso-friendly blend for everyday cafe service. Roasted for balance across batch brew and bar service.",
      tastingNotes: ["Chocolate", "Hazelnut", "Brown sugar"],
      originType: "Blend",
      shopCategorySlug: "blends",
      roastLevel: "Medium",
      heroImagePath: "/mockups/bag-kraft.svg",
    },
    {
      id: "coffee-espresso-blend",
      name: "Espresso Blend",
      slug: "espresso-blend",
      subtitle: "Built for crema, body, and flat whites.",
      description:
        "A bold profile built for milk drinks, consistent crema, and a classic finish. Works on traditional and modern espresso setups.",
      tastingNotes: ["Dark cocoa", "Caramel", "Roasted almond"],
      originType: "Blend",
      shopCategorySlug: "blends",
      roastLevel: "Medium–dark",
      heroImagePath: "/mockups/bag-black.svg",
    },
    {
      id: "coffee-morning-filter",
      name: "Morning Filter Blend",
      slug: "morning-filter-blend",
      subtitle: "Sweet, clean, and forgiving on batch brew.",
      description:
        "A medium roast blend tuned for batch brew, pour-over, and filter service. Designed to taste approachable from first cup to last.",
      tastingNotes: ["Milk chocolate", "Red apple", "Light caramel"],
      originType: "Blend",
      shopCategorySlug: "blends",
      roastLevel: "Medium",
      heroImagePath: "/mockups/bag-white.svg",
    },
    {
      id: "coffee-ethiopia-yirgacheffe",
      name: "Ethiopia Yirgacheffe",
      slug: "ethiopia-yirgacheffe",
      subtitle: "Floral washed lot for distinctive shelves.",
      description:
        "Classic washed Yirgacheffe with pronounced florals and citrus. Ideal when you want a named origin on your white-label line.",
      tastingNotes: ["Jasmine", "Bergamot", "Lemon zest"],
      originType: "Single origin",
      shopCategorySlug: "single-origin",
      roastLevel: "Light",
      heroImagePath: "/mockups/bag-white.svg",
    },
    {
      id: "coffee-colombia-huila",
      name: "Colombia Huila",
      slug: "colombia-huila",
      subtitle: "Balanced sweetness for omni service.",
      description:
        "Huila lot with ripe stone fruit and clean sweetness. Versatile across espresso and filter without chasing extremes.",
      tastingNotes: ["Peach", "Panela", "Milk chocolate"],
      originType: "Single origin",
      shopCategorySlug: "single-origin",
      roastLevel: "Medium",
      heroImagePath: "/mockups/bag-kraft.svg",
    },
    {
      id: "coffee-brazil-santos",
      name: "Brazil Santos",
      slug: "brazil-santos",
      subtitle: "Nutty base for espresso blends or solo service.",
      description:
        "Low-acid, full-bodied profile with nut and cocoa notes. Popular as a single-origin espresso or as the base of a custom blend.",
      tastingNotes: ["Peanut brittle", "Cocoa", "Dried fig"],
      originType: "Single origin",
      shopCategorySlug: "single-origin",
      roastLevel: "Medium",
      heroImagePath: "/mockups/bag-kraft.svg",
    },
    {
      id: "coffee-decaf-swiss-water",
      name: "Swiss Water Decaf",
      slug: "swiss-water-decaf",
      subtitle: "Chemical-free decaffeination, full flavour.",
      description:
        "Swiss Water process decaf with clean sweetness and enough body for espresso and filter. A strong decaf menu option under your brand.",
      tastingNotes: ["Toffee", "Red apple", "Milk chocolate"],
      originType: "Decaf",
      shopCategorySlug: "decaf",
      roastLevel: "Medium",
      heroImagePath: "/mockups/bag-black.svg",
    },
    {
      id: "coffee-decaf-sugar-cane",
      name: "Sugar Cane Decaf",
      slug: "sugar-cane-decaf",
      subtitle: "EA process with rounded sweetness.",
      description:
        "Sugar cane (EA) process decaf with rounded sweetness and biscuit notes. Works well for batch brew and cafetiere service.",
      tastingNotes: ["Biscuit", "Panela", "Baked apple"],
      originType: "Decaf",
      shopCategorySlug: "decaf",
      roastLevel: "Medium",
      heroImagePath: "/mockups/bag-kraft.svg",
    },
    {
      id: "coffee-french-roast",
      name: "French Roast",
      slug: "french-roast",
      subtitle: "Very dark for classic dark-roast drinkers.",
      description:
        "Slow-developed dark roast with smoky sweetness and low acidity. For menus that still lean into bold, traditional profiles.",
      tastingNotes: ["Smoked caramel", "Bittersweet cocoa", "Walnut"],
      originType: "Dark roast",
      shopCategorySlug: "dark-roast",
      roastLevel: "Dark",
      heroImagePath: "/mockups/bag-black.svg",
    },
    {
      id: "coffee-taster-trio",
      name: "Taster Trio (3 × 200g)",
      slug: "taster-trio",
      subtitle: "Trial three profiles before you scale.",
      description:
        "Three 200g bags: House Blend, a single origin, and your choice of decaf (we rotate seasonally). Perfect for cupping with your team or sampling at the pass.",
      tastingNotes: ["Sample pack", "Mixed roast levels", "Cupping notes included"],
      originType: "Sample",
      shopCategorySlug: "samples",
      roastLevel: "Mixed",
      heroImagePath: "/mockups/bag-kraft.svg",
    },
  ],
  bags: [
    {
      id: "bag-kraft",
      name: "Kraft",
      slug: "kraft",
      colour: "#b88752",
      finish: "Natural paper",
      mockupAssetPath: "/mockups/bag-kraft.svg",
    },
    {
      id: "bag-matte-black",
      name: "Matte Black",
      slug: "matte-black",
      colour: "#111111",
      finish: "Soft-touch matte",
      mockupAssetPath: "/mockups/bag-black.svg",
    },
    {
      id: "bag-matte-white",
      name: "Matte White",
      slug: "matte-white",
      colour: "#f7f2e8",
      finish: "Smooth matte",
      mockupAssetPath: "/mockups/bag-white.svg",
    },
  ],
  sizes: [
    { id: "size-250g", label: "250g", slug: "250g", grams: 250 },
    { id: "size-500g", label: "500g", slug: "500g", grams: 500 },
    { id: "size-1kg", label: "1kg", slug: "1kg", grams: 1000 },
  ],
  labels: [
    {
      id: "label-rectangle",
      name: "Tall Rectangle",
      slug: "rectangle",
      shape: "rectangle",
      widthMm: "80.00",
      heightMm: "120.00",
      safeArea: { top: 4, right: 4, bottom: 4, left: 4 },
      mockupPlacement: { x: 31, y: 34, width: 38, height: 34, radius: 4 },
    },
    {
      id: "label-square",
      name: "Square",
      slug: "square",
      shape: "square",
      widthMm: "85.00",
      heightMm: "85.00",
      safeArea: { top: 4, right: 4, bottom: 4, left: 4 },
      mockupPlacement: { x: 31, y: 38, width: 38, height: 28, radius: 4 },
    },
    {
      id: "label-circle",
      name: "Circle",
      slug: "circle",
      shape: "circle",
      widthMm: "85.00",
      heightMm: "85.00",
      safeArea: { top: 6, right: 6, bottom: 6, left: 6 },
      mockupPlacement: { x: 32, y: 38, width: 36, height: 28, radius: 999 },
    },
    {
      id: "label-oval",
      name: "Oval",
      slug: "oval",
      shape: "oval",
      widthMm: "100.00",
      heightMm: "70.00",
      safeArea: { top: 5, right: 6, bottom: 5, left: 6 },
      mockupPlacement: { x: 29, y: 40, width: 42, height: 24, radius: 999 },
    },
  ],
  grinds: [
    {
      id: "grind-whole-bean",
      name: "Whole Bean",
      slug: "whole-bean",
      description: "Best for businesses grinding fresh for each brew method.",
    },
    {
      id: "grind-espresso",
      name: "Espresso",
      slug: "espresso",
      description: "Fine grind for traditional espresso machines.",
    },
    {
      id: "grind-filter",
      name: "Filter",
      slug: "filter",
      description: "Medium grind for batch brew, pour-over, and filter service.",
    },
    {
      id: "grind-cafetiere",
      name: "Cafetiere",
      slug: "cafetiere",
      description: "Coarse grind for immersion brewing.",
    },
  ],
  prices: [],
};

fallbackCatalogue.prices = fallbackCatalogue.coffees.flatMap((coffee, coffeeIndex) =>
  fallbackCatalogue.bags.flatMap((bag, bagIndex) =>
    fallbackCatalogue.sizes.flatMap((size, sizeIndex) =>
      [25, 50, 100].map((minQuantity, tierIndex) => {
        const baseBySize = [820, 1460, 2550][sizeIndex] ?? 820;
        const coffeePremium = coffeeIndex * 35;
        const bagPremium = bagIndex * 20;
        const tierDiscount = tierIndex * 45;

        return {
          id: `price-${coffee.slug}-${bag.slug}-${size.slug}-${minQuantity}`,
          coffeeProductId: coffee.id,
          bagOptionId: bag.id,
          bagSizeId: size.id,
          minQuantity,
          unitAmountPence: Math.max(500, baseBySize + coffeePremium + bagPremium - tierDiscount),
          setupFeePence: minQuantity === 25 ? 3500 : 0,
          currency: "gbp" as const,
        };
      })
    )
  )
);

export function formatMoney(pence: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(pence / 100);
}
