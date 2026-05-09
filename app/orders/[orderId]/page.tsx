import Link from "next/link";

import { OrderPortalClient } from "@/components/orders/order-portal-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { hasDatabaseUrl } from "@/src/db";
import { getManagedOrder } from "@/src/lib/orders";

export default async function OrderPortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderId } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Order link expired or incomplete</CardTitle>
            <CardDescription>
              Re-open your order with the reference from checkout and the email used to place it.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The order portal uses a customer-safe access token in the link so we can show your order without a full
            account system.
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/orders">Find your order</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  let initialOrder = null;
  let initialError = "";

  if (!hasDatabaseUrl()) {
    initialError = "Order management requires a configured database connection.";
  } else {
    const order = await getManagedOrder(orderId, token);

    if (!order) {
      initialError = "We couldn't find an order for this link.";
    } else {
      initialOrder = JSON.parse(JSON.stringify(order));
    }
  }

  return (
    <OrderPortalClient
      orderId={orderId}
      accessToken={token}
      initialOrder={initialOrder}
      initialError={initialError}
    />
  );
}
