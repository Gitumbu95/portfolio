"use client";

import { motion } from "framer-motion";
import { X, Printer } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/components/OrdersComponent";
import PriceFormatter from "./PriceFormatter"; // optional: for currency formatting

interface OrderDrawerProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDrawer({ order, onClose }: OrderDrawerProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const formatCurrency = (amount: number) =>
      amount.toLocaleString("en-KE");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Order #${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            h1 { color: #003366; margin-bottom: 10px; }
            .section { margin-bottom: 20px; }
            .section h2 { font-size: 16px; color: #003366; margin-bottom: 5px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
            .info p { margin: 2px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; vertical-align: middle; }
            th { background-color: #e0e7ff; color: #003366; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; font-size: 16px; margin-top: 15px; }
            img { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>Invoice - Order #${order.orderNumber}</h1>
          <div class="section info">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> ${order.customer?.name || "N/A"}</p>
            <p><strong>Email:</strong> ${order.customer?.email || "N/A"}</p>
            <p><strong>Address:</strong> ${order.customer?.address || "N/A"}</p>
          </div>
          <div class="section info">
            <h2>Payment Details</h2>
            <p><strong>Method:</strong> ${order.paymentMethod?.toUpperCase() || "N/A"}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
          </div>
          <div class="section">
            <h2>Purchased Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity × Price</th>
                  <th>Total (Ksh)</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td>
                      ${item.image ? `<img src="${item.image}" alt="${item.name}" /> ` : ""}
                      ${item.name}
                    </td>
                    <td>${item.quantity} × ${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.quantity * item.price)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="total">
            Total Amount: Ksh ${formatCurrency(order.totalAmount)}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto rounded-l-2xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-lg font-bold text-[var(--color-shop-dark-blue)]">
          Order #{order.orderNumber}
        </h2>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handlePrint}
            className="flex items-center gap-1 text-gray-700 hover:text-[var(--color-shop-electric-blue)]"
          >
            <Printer className="w-4 h-4" /> Print
          </Button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Customer Info */}
        <div>
          <h3 className="font-semibold text-[var(--color-shop-dark-blue)] mb-2">
            Customer Information
          </h3>
          <p className="text-sm text-gray-700">
            <strong>Name:</strong> {order.customer?.name || "N/A"}
            <br />
            <strong>Email:</strong> {order.customer?.email || "N/A"}
            <br />
            <strong>Address:</strong> {order.customer?.address || "N/A"}
          </p>
        </div>

        <Separator />

        {/* Payment Info */}
        <div>
          <h3 className="font-semibold text-[var(--color-shop-dark-blue)] mb-2">
            Payment Details
          </h3>
          <p className="text-sm text-gray-700">
            <strong>Method:</strong> {order.paymentMethod?.toUpperCase() || "N/A"}
            <br />
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                order.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : order.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status}
            </span>
            <br />
            <strong>Date:</strong> {new Date(order.date).toLocaleString()}
          </p>
        </div>

        <Separator />

        {/* Purchased Items */}
        <div>
          <h3 className="font-semibold text-[var(--color-shop-dark-blue)] mb-3">
            Purchased Items
          </h3>
          <div className="max-h-72 overflow-y-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-shop-alice-blue)] sticky top-0">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Quantity × Price</th>
                  <th className="p-3 text-right">Total (Ksh)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-[var(--color-shop-alice-blue)]/30 transition-colors"
                  >
                    <td className="flex items-center gap-2 p-3">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      )}
                      <span>{item.name}</span>
                    </td>
                    <td className="p-3">
                      {item.quantity} × {item.price.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold text-[var(--color-shop-dark-blue)] pt-2">
          <span>Total Amount:</span>
          <span>Ksh {order.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
