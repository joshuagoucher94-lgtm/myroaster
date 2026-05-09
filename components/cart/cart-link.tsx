"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

export function CartLink() {
  const { totals, isReady } = useCart();
  const count = isReady ? totals.itemCount : 0;

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/cart" className="relative">
        <ShoppingCart className="size-4" />
        Cart
        {count > 0 ? (
          <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[0.68rem] leading-none text-accent-foreground">
            {count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
