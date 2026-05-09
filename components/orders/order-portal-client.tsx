"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Clock3, Download, MessageSquareText, Package, PencilLine, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type OrderPortalPageProps = {
  orderId: string;
  accessToken: string;
  initialOrder: ManagedOrder | null;
  initialError?: string;
};

type ManagedOrder = {
  id: string;
  orderReference: string;
  customerEmail: string;
  businessName: string;
  contactName: string;
  customerPhone: string;
  customerNotes: string;
  status: string;
  fulfillmentStage: string;
  artworkUrl: string;
  requestedFulfillmentDate: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  subtotalPence: number;
  setupFeePence: number;
  totalPence: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  lastCustomerActivityAt: string | null;
  lastArtworkUploadAt: string | null;
  items: Array<{
    id: string;
    quantity: number;
    unitAmountPence: number;
    configurationSnapshot: Record<string, unknown>;
  }>;
  artworkFiles: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    contentType: string;
    sizeBytes: number;
    kind: string;
    uploadedBy: string;
    createdAt: string;
  }>;
  messages: Array<{
    id: string;
    sender: string;
    body: string;
    createdAt: string;
  }>;
  events: Array<{
    id: string;
    eventType: string;
    title: string;
    detail: string | null;
    createdAt: string;
  }>;
};

type FormState = {
  businessName: string;
  contactName: string;
  customerPhone: string;
  customerNotes: string;
  requestedFulfillmentDate: string;
};

const stageCopy: Record<string, string> = {
  order_received: "Order received",
  artwork_review: "Artwork review",
  proofing: "Proofing",
  in_production: "In production",
  shipped: "Shipped",
};

function formatMoney(amountPence: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountPence / 100);
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined,
  }).format(new Date(value));
}

function getSnapshotText(snapshot: Record<string, unknown>, key: string, fallback = "") {
  const value = snapshot[key];

  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    if ("name" in value && typeof value.name === "string") {
      return value.name;
    }

    if ("label" in value && typeof value.label === "string") {
      return value.label;
    }
  }

  return fallback;
}

function createFormState(order: ManagedOrder): FormState {
  return {
    businessName: order.businessName,
    contactName: order.contactName,
    customerPhone: order.customerPhone,
    customerNotes: order.customerNotes,
    requestedFulfillmentDate: order.requestedFulfillmentDate ?? "",
  };
}

export function OrderPortalClient({ orderId, accessToken, initialOrder, initialError = "" }: OrderPortalPageProps) {
  const [order, setOrder] = useState<ManagedOrder | null>(initialOrder);
  const [formState, setFormState] = useState<FormState | null>(initialOrder ? createFormState(initialOrder) : null);
  const [error, setError] = useState(initialError);
  const [saveMessage, setSaveMessage] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [artworkKind, setArtworkKind] = useState("supporting");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);

  const orderUrl = useMemo(() => `/api/orders/${orderId}?token=${accessToken}`, [accessToken, orderId]);

  async function loadOrder() {
    try {
      const response = await fetch(orderUrl, { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Unable to load your order.");
        return;
      }

      setOrder(payload.order);
      setFormState(createFormState(payload.order));
    } catch {
      setError("Unable to load your order right now.");
    }
  }

  async function handleSaveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState) {
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    setError("");

    try {
      const response = await fetch(orderUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Unable to update order details.");
        return;
      }

      setOrder(payload.order);
      setFormState(createFormState(payload.order));
      setSaveMessage("Order details saved.");
    } catch {
      setError("Unable to update order details right now.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!messageDraft.trim()) {
      return;
    }

    setIsSendingMessage(true);
    setError("");
    setSaveMessage("");

    try {
      const response = await fetch(`/api/orders/${orderId}/messages?token=${accessToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageDraft }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Unable to send your message.");
        return;
      }

      setMessageDraft("");
      await loadOrder();
      setSaveMessage("Message sent.");
    } catch {
      setError("Unable to send your message right now.");
    } finally {
      setIsSendingMessage(false);
    }
  }

  async function handleUploadArtwork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!artworkFile) {
      setError("Choose a file before uploading.");
      return;
    }

    setIsUploadingArtwork(true);
    setError("");
    setSaveMessage("");

    try {
      const body = new FormData();
      body.append("file", artworkFile);
      body.append("kind", artworkKind);

      const response = await fetch(`/api/orders/${orderId}/artwork?token=${accessToken}`, {
        method: "POST",
        body,
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Unable to upload artwork.");
        return;
      }

      setArtworkFile(null);
      const input = document.getElementById("artwork-file") as HTMLInputElement | null;
      if (input) {
        input.value = "";
      }
      await loadOrder();
      setSaveMessage(payload.warning ? `Artwork uploaded. ${payload.warning}` : "Artwork uploaded.");
    } catch {
      setError("Unable to upload artwork right now.");
    } finally {
      setIsUploadingArtwork(false);
    }
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-muted/30 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>We couldn&apos;t open this order</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/orders">Find another order</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  if (!order || !formState) {
    return null;
  }

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader className="gap-3 md:flex md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{stageCopy[order.fulfillmentStage] ?? order.fulfillmentStage}</Badge>
                <Badge variant="outline">{order.status.replaceAll("_", " ")}</Badge>
              </div>
              <CardTitle>Order {order.orderReference}</CardTitle>
              <CardDescription>
                Placed {formatDate(order.createdAt)}. We&apos;ll keep artwork, notes, and status updates together here.
              </CardDescription>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Total: {formatMoney(order.totalPence, order.currency)}</p>
              <p>Customer email: {order.customerEmail}</p>
              <p>Requested date: {formatDate(order.requestedFulfillmentDate)}</p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PencilLine className="size-4" />
                  Order details
                </CardTitle>
                <CardDescription>
                  Keep contact details, production notes, and delivery timing current.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSaveDetails}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business-name">Business name</Label>
                      <Input
                        id="business-name"
                        value={formState.businessName}
                        onChange={(event) => setFormState((current) => current ? { ...current, businessName: event.target.value } : current)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Contact name</Label>
                      <Input
                        id="contact-name"
                        value={formState.contactName}
                        onChange={(event) => setFormState((current) => current ? { ...current, contactName: event.target.value } : current)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customer-phone">Phone</Label>
                      <Input
                        id="customer-phone"
                        value={formState.customerPhone}
                        onChange={(event) => setFormState((current) => current ? { ...current, customerPhone: event.target.value } : current)}
                        placeholder="+44 20 7946 0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requested-date">Requested delivery date</Label>
                      <Input
                        id="requested-date"
                        type="date"
                        value={formState.requestedFulfillmentDate}
                        onChange={(event) =>
                          setFormState((current) =>
                            current ? { ...current, requestedFulfillmentDate: event.target.value } : current
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-notes">Production notes</Label>
                    <Textarea
                      id="customer-notes"
                      value={formState.customerNotes}
                      onChange={(event) => setFormState((current) => current ? { ...current, customerNotes: event.target.value } : current)}
                      placeholder="Any delivery timing, roast, labeling, or packing notes we should keep in view."
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                    {saveMessage ? <p className="text-sm text-muted-foreground">{saveMessage}</p> : null}
                    {error ? <p className="text-sm text-destructive">{error}</p> : null}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="size-4" />
                  Artwork uploads
                </CardTitle>
                <CardDescription>
                  Add revised files, supporting assets, or final print-ready artwork.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <form className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end" onSubmit={handleUploadArtwork}>
                  <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                    <div className="space-y-2">
                      <Label>Artwork type</Label>
                      <Select value={artworkKind} onValueChange={setArtworkKind}>
                        <SelectTrigger className="h-11 w-full rounded-2xl px-3">
                          <SelectValue placeholder="Choose type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary artwork</SelectItem>
                          <SelectItem value="supporting">Supporting asset</SelectItem>
                          <SelectItem value="proof">Proof revision</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="artwork-file">File</Label>
                      <Input
                        id="artwork-file"
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.pdf"
                        onChange={(event) => setArtworkFile(event.target.files?.[0] ?? null)}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isUploadingArtwork}>
                    {isUploadingArtwork ? "Uploading..." : "Upload artwork"}
                  </Button>
                </form>

                <div className="space-y-3">
                  {order.artworkFiles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No artwork files have been attached yet.</p>
                  ) : (
                    order.artworkFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">{file.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.kind} • {Math.max(1, Math.round(file.sizeBytes / 1024))} KB • {formatDate(file.createdAt)}
                          </p>
                        </div>
                        {file.fileUrl.startsWith("http") ? (
                          <Button asChild size="sm" variant="outline">
                            <a href={file.fileUrl} target="_blank" rel="noreferrer">
                              <Download className="size-4" />
                              Open
                            </a>
                          </Button>
                        ) : (
                          <Badge variant="outline">Stored locally</Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareText className="size-4" />
                  Notes and questions
                </CardTitle>
                <CardDescription>
                  Send production updates or questions straight from the order.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-3" onSubmit={handleSendMessage}>
                  <Textarea
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                    placeholder="Share a packaging note, shipping update, or artwork question."
                  />
                  <Button type="submit" disabled={isSendingMessage}>
                    {isSendingMessage ? "Sending..." : "Send message"}
                  </Button>
                </form>
                <div className="space-y-3">
                  {order.messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No customer-visible messages yet.</p>
                  ) : (
                    order.messages.map((message) => (
                      <div key={message.id} className="rounded-2xl border border-border/70 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium capitalize">{message.sender}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(message.createdAt)}</p>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{message.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="size-4" />
                  Order summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => {
                  const coffee = getSnapshotText(item.configurationSnapshot, "coffee", "Coffee");
                  const size = getSnapshotText(item.configurationSnapshot, "size", "");
                  const bag = getSnapshotText(item.configurationSnapshot, "bag", "");
                  const label = getSnapshotText(item.configurationSnapshot, "label", "");
                  const grind = getSnapshotText(item.configurationSnapshot, "grind", "");
                  const brandName = getSnapshotText(item.configurationSnapshot, "brandName", "");
                  const labelTitle = getSnapshotText(item.configurationSnapshot, "labelTitle", "");
                  const productionNotes = getSnapshotText(item.configurationSnapshot, "productionNotes", "");

                  return (
                    <div key={item.id} className="rounded-2xl border border-border/70 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{coffee}</p>
                          <p className="text-sm text-muted-foreground">
                            {[size, bag, label, grind].filter(Boolean).join(" • ")}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {item.quantity} x {formatMoney(item.unitAmountPence, order.currency)}
                        </p>
                      </div>
                      {brandName || labelTitle || productionNotes ? (
                        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                          {brandName ? <p>Brand: {brandName}</p> : null}
                          {labelTitle ? <p>Label: {labelTitle}</p> : null}
                          {productionNotes ? <p>Notes: {productionNotes}</p> : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Items subtotal</span>
                  <span>{formatMoney(order.subtotalPence, order.currency)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Artwork setup</span>
                  <span>{formatMoney(order.setupFeePence, order.currency)}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{formatMoney(order.totalPence, order.currency)}</span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock3 className="size-4" />
                  Timeline
                </CardTitle>
                <CardDescription>Customer-visible order activity and milestones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No updates yet.</p>
                ) : (
                  order.events.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-border/70 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(event.createdAt)}</p>
                      </div>
                      {event.detail ? <p className="mt-2 text-sm text-muted-foreground">{event.detail}</p> : null}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {order.trackingNumber || order.trackingUrl ? (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping</CardTitle>
                  <CardDescription>Tracking information will appear here when the order ships.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {order.trackingNumber ? <p>Tracking number: {order.trackingNumber}</p> : null}
                  {order.trackingUrl ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={order.trackingUrl} target="_blank" rel="noreferrer">
                        Open tracking
                      </a>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
