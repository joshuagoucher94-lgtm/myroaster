import type { Metadata } from "next";

import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Cart | myroaster",
  description: "Review configured branded coffee products before checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
