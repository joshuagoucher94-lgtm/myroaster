import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildCustomerPortalHref, getOrderForSuccessPage } from "@/src/lib/orders";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const order = params.order ? await getOrderForSuccessPage({ orderId: params.order }) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Checkout cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground">
            No payment was taken. You can return to the shop and adjust product
            options directly on a coffee page.
          </p>
          {order ? (
            <p className="text-sm text-muted-foreground">Order reference: {order.orderReference}</p>
          ) : params.order ? (
            <p className="text-sm text-muted-foreground">Order draft: {params.order}</p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {order ? (
              <Button asChild variant="outline">
                <Link href={buildCustomerPortalHref(order.id, order.customerAccessToken)}>Review order details</Link>
              </Button>
            ) : null}
            <Button asChild>
              <Link href="/shop">Return to shop</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
