import { redirect } from "next/navigation";

export default async function ConfigurePage({
  searchParams,
}: {
  searchParams: Promise<{ coffee?: string }>;
}) {
  const params = await searchParams;

  if (params.coffee) {
    redirect(`/shop/coffee/${encodeURIComponent(params.coffee)}#customize`);
  }

  redirect("/shop");
}
