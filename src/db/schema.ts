import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", [
  "draft",
  "pending_payment",
  "paid",
  "cancelled",
  "fulfilled",
]);

export const coffeeProducts = pgTable("coffee_products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  tastingNotes: text("tasting_notes").array().notNull().default(sql`'{}'::text[]`),
  originType: text("origin_type").notNull(),
  shopCategorySlug: text("shop_category_slug").notNull().default("blends"),
  subtitle: text("subtitle").notNull().default(""),
  roastLevel: text("roast_level").notNull().default(""),
  heroImagePath: text("hero_image_path").notNull().default("/mockups/bag-kraft.svg"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bagOptions = pgTable("bag_options", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  colour: text("colour").notNull(),
  finish: text("finish").notNull(),
  mockupAssetPath: text("mockup_asset_path").notNull(),
  active: boolean("active").notNull().default(true),
});

export const bagSizes = pgTable("bag_sizes", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  slug: text("slug").notNull().unique(),
  grams: integer("grams").notNull(),
  active: boolean("active").notNull().default(true),
});

export const labelOptions = pgTable("label_options", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shape: text("shape").notNull(),
  widthMm: numeric("width_mm", { precision: 6, scale: 2 }).notNull(),
  heightMm: numeric("height_mm", { precision: 6, scale: 2 }).notNull(),
  safeArea: jsonb("safe_area").$type<{ top: number; right: number; bottom: number; left: number }>().notNull(),
  mockupPlacement: jsonb("mockup_placement")
    .$type<{ x: number; y: number; width: number; height: number; radius: number }>()
    .notNull(),
  active: boolean("active").notNull().default(true),
});

export const grindOptions = pgTable("grind_options", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  active: boolean("active").notNull().default(true),
});

export const productPrices = pgTable(
  "product_prices",
  {
    id: text("id").primaryKey(),
    coffeeProductId: text("coffee_product_id")
      .notNull()
      .references(() => coffeeProducts.id, { onDelete: "cascade" }),
    bagOptionId: text("bag_option_id")
      .notNull()
      .references(() => bagOptions.id, { onDelete: "cascade" }),
    bagSizeId: text("bag_size_id")
      .notNull()
      .references(() => bagSizes.id, { onDelete: "cascade" }),
    minQuantity: integer("min_quantity").notNull(),
    unitAmountPence: integer("unit_amount_pence").notNull(),
    setupFeePence: integer("setup_fee_pence").notNull().default(0),
    currency: text("currency").notNull().default("gbp"),
  },
  (table) => [
    uniqueIndex("product_price_unique_tier").on(
      table.coffeeProductId,
      table.bagOptionId,
      table.bagSizeId,
      table.minQuantity
    ),
  ]
);

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  customerEmail: text("customer_email").notNull(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  status: orderStatus("status").notNull().default("draft"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  artworkUrl: text("artwork_url").notNull(),
  subtotalPence: integer("subtotal_pence").notNull(),
  setupFeePence: integer("setup_fee_pence").notNull().default(0),
  totalPence: integer("total_pence").notNull(),
  currency: text("currency").notNull().default("gbp"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  coffeeProductId: text("coffee_product_id").references(() => coffeeProducts.id),
  bagOptionId: text("bag_option_id").references(() => bagOptions.id),
  bagSizeId: text("bag_size_id").references(() => bagSizes.id),
  labelOptionId: text("label_option_id").references(() => labelOptions.id),
  grindOptionId: text("grind_option_id").references(() => grindOptions.id),
  quantity: integer("quantity").notNull(),
  unitAmountPence: integer("unit_amount_pence").notNull(),
  configurationSnapshot: jsonb("configuration_snapshot").$type<Record<string, unknown>>().notNull(),
});

export const productPricesRelations = relations(productPrices, ({ one }) => ({
  coffeeProduct: one(coffeeProducts, {
    fields: [productPrices.coffeeProductId],
    references: [coffeeProducts.id],
  }),
  bagOption: one(bagOptions, {
    fields: [productPrices.bagOptionId],
    references: [bagOptions.id],
  }),
  bagSize: one(bagSizes, {
    fields: [productPrices.bagSizeId],
    references: [bagSizes.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
