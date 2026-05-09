import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Login | myroaster",
};

export default function LoginPage() {
  return (
    <main className="section-shell flex min-h-[calc(100svh-4.5rem)] items-center py-16">
      <section className="soft-panel mx-auto max-w-2xl rounded-[2rem] p-8 text-center sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Login</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Trade account access is on the way.</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          We are still wiring up customer login. For now, you can build an order, manage your cart,
          or track an existing order from the links below.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/shop">Browse coffee</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/orders">Track order</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
