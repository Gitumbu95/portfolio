import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "checkoutRequestID",
      title: "Checkout Request ID (M-PESA)",
      type: "string",
      description: "Used to match M-PESA callbacks to this order",
    }),

    defineField({
      name: "invoice",
      title: "Invoice Details",
      type: "object",
      fields: [
        { name: "id", title: "Invoice ID", type: "string" },
        { name: "number", title: "Invoice Number", type: "string" },
        { name: "hosted_invoice_url", title: "Invoice URL", type: "url" },
      ],
    }),

    defineField({
      name: "stripeCheckoutSessionId",
      title: "Stripe Checkout Session ID",
      type: "string",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID / M-PESA Phone",
      type: "string",
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID (Clerk)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: "stripePaymentIntentId",
      title: "Payment Intent / M-PESA Receipt Number",
      type: "string",
    }),

    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
            },
            prepare(select) {
              return {
                title: `${select.product} x${select.quantity}`,
                subtitle: `${select.price * select.quantity} KES`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "totalPrice",
      title: "Total Price (KES)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "KES",
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      initialValue: 0,
    }),

    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "zip", title: "Zip Code", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "address", title: "Address", type: "string" }),
        defineField({ name: "name", title: "Recipient Name", type: "string" }),
      ],
    }),

    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
      status: "status",
    },
    prepare(select) {
      const orderIdSnippet =
        select.orderId?.length > 8
          ? `${select.orderId.slice(0, 4)}...${select.orderId.slice(-4)}`
          : select.orderId;
      return {
        title: `${select.name} (${select.status || "Unknown"})`,
        subtitle: `${select.amount} ${select.currency} — ${select.email}`,
        media: BasketIcon,
      };
    },
  },
});
