import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order?: string; demo?: string }>;
}) {
  const params = await searchParams;

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
          <Button asChild>
            <Link href="/configure">Configure another bag</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
