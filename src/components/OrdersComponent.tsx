"use client";

import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Customer {
  name: string;
  email: string;
  address: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  date: string;
  customer: Customer;
  totalAmount: number;
  status: string;
  paymentMethod?: "mpesa" | "card";
  invoiceNumber?: string;
  items: OrderItem[];
}

interface OrdersComponentProps {
  orders: Order[];
  onViewDetails?: (order: Order) => void;
}

const OrdersComponent: React.FC<OrdersComponentProps> = ({
  orders,
  onViewDetails,
}) => {
  if (!orders?.length) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TableBody>
      {orders.map((order, index) => (
        <TableRow
          key={order._id || index}
          className="transition-all duration-200 hover:bg-[var(--color-shop-alice-blue)]/40"
        >
          {/* Order Number */}
          <TableCell className="font-semibold text-[var(--color-shop-dark-blue)]">
            #{order.orderNumber}
          </TableCell>

          {/* Date */}
          <TableCell className="hidden md:table-cell text-gray-600">
            {formatDate(order.date)}
          </TableCell>

          {/* Customer */}
          <TableCell className="flex items-center gap-2 text-gray-700 font-medium">
            {order.items[0]?.image && (
              <img
                src={order.items[0].image}
                alt={order.items[0].name}
                className="w-8 h-8 rounded-md object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            )}
            {order.customer?.name || "Guest"}
          </TableCell>

          {/* Email */}
          <TableCell className="hidden sm:table-cell text-gray-500">
            {order.customer?.email || "N/A"}
          </TableCell>

          {/* Total */}
          <TableCell className="font-semibold text-[var(--color-shop-electric-blue)]">
            Ksh {order.totalAmount?.toLocaleString()}
          </TableCell>

          {/* Status */}
          <TableCell>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
          </TableCell>

          {/* Invoice Number */}
          <TableCell className="hidden sm:table-cell text-gray-500">
            {order.invoiceNumber || "-"}
          </TableCell>

          {/* Action */}
          <TableCell className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(order)}
              className="flex items-center gap-2 text-[var(--color-shop-electric-blue)] hover:text-[var(--color-shop-dark-blue)] font-semibold transition-all"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default OrdersComponent;
