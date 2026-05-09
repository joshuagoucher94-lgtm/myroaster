import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildCustomerPortalHref, getOrderForSuccessPage } from "@/src/lib/orders";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order?: string; demo?: string }>;
}) {
  const params = await searchParams;
  const order = await getOrderForSuccessPage({
    orderId: params.order,
    sessionId: params.session_id,
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Order received</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground">
            Thanks. Your white-label coffee order has been captured and will be
            reviewed for artwork and production details.
          </p>
          {params.demo ? (
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Demo checkout was used because Stripe is not configured locally.
            </p>
          ) : null}
          <p className="text-sm text-muted-foreground">
            Reference: {params.session_id ?? params.order ?? "pending"}
          </p>
          {order ? (
            <p className="text-sm text-muted-foreground">Order portal reference: {order.orderReference}</p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {order ? (
              <Button asChild>
                <Link href={buildCustomerPortalHref(order.id, order.customerAccessToken)}>Manage this order</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/shop">Shop another coffee</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
