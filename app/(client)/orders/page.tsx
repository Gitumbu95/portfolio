"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/Container";
import OrdersComponent, { Order } from "@/components/OrdersComponent";
import OrderDetailsDrawer from "@/components/OrderDetailsDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileX } from "lucide-react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { AnimatePresence } from "framer-motion";

const OrdersPage = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300); // small delay to allow animation
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/orders/${user.id}`);
        if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[var(--color-shop-water)]/40">
        <h2 className="text-2xl font-bold text-[var(--color-shop-dark-blue)] mb-3">
          Please Sign In to View Orders
        </h2>
        <Link
          href="/sign-in"
          className="text-[var(--color-shop-electric-blue)] underline font-medium"
        >
          Go to Sign In →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-shop-water)]/30 min-h-screen relative">
      <Container className="py-10">
        {loading ? (
          <p className="text-center text-gray-600 py-20">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-20">{error}</p>
        ) : orders.length > 0 ? (
          <Card className="w-full bg-white border border-[var(--color-shop-light-blue)]/40 shadow-lg rounded-2xl">
            <CardHeader className="border-b border-[var(--color-shop-light-blue)]/30">
              <CardTitle className="text-2xl font-extrabold text-[var(--color-shop-dark-blue)] tracking-wide">
                My Orders
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="rounded-b-2xl">
                <Table className="min-w-full">
                  <TableHeader className="bg-[var(--color-shop-electric-blue)]/10 text-[var(--color-shop-dark-blue)] font-semibold">
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Invoice</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <OrdersComponent
                    orders={orders}
                    onViewDetails={(order) => {
                      setSelectedOrder(order);
                      setDrawerOpen(true);
                    }}
                  />
                </Table>

                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileX className="h-24 w-24 text-[var(--color-shop-light-blue)] mb-4" />
            <h2 className="text-2xl font-bold text-[var(--color-shop-dark-blue)]">
              No Orders Yet
            </h2>
            <p className="mt-2 text-gray-600 max-w-md">
              You haven’t placed any orders yet. Explore our products and start shopping today!
            </p>
            <Button
              asChild
              className="mt-6 bg-[var(--color-shop-electric-blue)] hover:bg-[var(--color-shop-dark-blue)] text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
            >
              <Link href="/">🛍️ Browse Products</Link>
            </Button>
          </div>
        )}
      </Container>

      {/* ✅ Animated Order Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedOrder && (
          <OrderDetailsDrawer
            order={selectedOrder}
            onClose={handleCloseDrawer}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
