"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OrderLookupForm() {
  const router = useRouter();
  const [orderReference, setOrderReference] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderReference,
          customerEmail,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "We couldn't find that order.");
        return;
      }

      router.push(payload.portalUrl);
    } catch {
      setError("We couldn't reach the order portal right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Find your order</CardTitle>
        <CardDescription>
          Enter the order reference from your confirmation and the email used at checkout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="order-reference">Order reference</Label>
            <Input
              id="order-reference"
              value={orderReference}
              onChange={(event) => setOrderReference(event.target.value.toUpperCase())}
              placeholder="MR-20260504-ABC123"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email address</Label>
            <Input
              id="customer-email"
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              placeholder="orders@yourbrand.com"
              required
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Looking up order..." : "Open order portal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
