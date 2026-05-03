import Link from "next/link";

import { CoffeeConfigurator } from "@/components/configurator/coffee-configurator";
import { getCatalogue } from "@/src/db/catalogue";

export default async function ConfigurePage({
  searchParams,
}: {
  searchParams: Promise<{ coffee?: string }>;
}) {
  const catalogue = await getCatalogue();
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <div className="mb-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Link href="/shop" className="hover:text-foreground hover:underline">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">Configure bags</span>
        </div>
        <div className="mb-8 max-w-3xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Configure your white-label coffee
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance">
            Build a branded coffee bag and preview your uploaded label artwork.
          </h1>
          <p className="text-muted-foreground">
            Open a specific coffee from the shop and we pre-select it here. Everything else still
            pulls from the same catalogue and server-side price tiers.
          </p>
        </div>
        <CoffeeConfigurator
          key={params.coffee ?? "__default__"}
          catalogue={catalogue}
          initialCoffeeSlugOrId={params.coffee}
        />
      </section>
    </main>
  );
}
