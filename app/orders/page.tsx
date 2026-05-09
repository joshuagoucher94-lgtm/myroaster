import { OrderLookupForm } from "@/components/orders/order-lookup-form";

export default function OrdersPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <OrderLookupForm />
    </main>
  );
}
