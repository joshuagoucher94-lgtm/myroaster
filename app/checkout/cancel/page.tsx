import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Checkout cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground">
            No payment was taken. You can return to the configurator and adjust
            your coffee, bag, artwork, or quantity.
          </p>
          {params.order ? <p className="text-sm text-muted-foreground">Order draft: {params.order}</p> : null}
          <Button asChild>
            <Link href="/configure">Return to configurator</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
