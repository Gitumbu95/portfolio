"use client";

import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/ui/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import PaymentModal from "@/components/PaymentModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCheckoutSession, Metadata } from "@/actions/createCheckoutSession";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();

  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ Fetch user addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      setSelectedAddress(defaultAddress || data[0] || null);
    } catch (error) {
      console.error("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ✅ Reset cart manually
  const handleResetCart = () => {
    if (window.confirm("Are you sure you want to reset your cart?")) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  // ✅ Proceed to Checkout Modal
  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address before checkout.");
      return;
    }
    setShowPaymentModal(true);
  };

  // ✅ Function: Save Order to Sanity after successful payment
  const createOrder = async (paymentMethod: "mpesa" | "card") => {
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          orderNumber: crypto.randomUUID(),
          total: getTotalPrice(),
          paymentMethod,
          customerName: user?.fullName ?? "Unknown",
          customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
          items: groupedItems.map(({ product }) => ({
            name: product.name,
            quantity: getItemCount(product._id),
            price: product.price,
            image: product?.images?.[0]
              ? urlFor(product.images[0]).url()
              : "",
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order successfully placed!");
        resetCart();
        setShowSuccessModal(true);
      } else {
        toast.error("Order saving failed, please retry.");
      }
    } catch (err) {
      console.error("Order save error:", err);
      toast.error("Could not save order.");
    }
  };

  // ✅ Process M-PESA Payment
  const processMpesaPayment = async (phone: string) => {
    try {
      setLoading(true);
      const amount = getTotalPrice();
      const orderId = crypto.randomUUID();

      const res = await fetch("/api/mpesa/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount,
          user: {
            id: user?.id,
            name: user?.fullName ?? "Unknown User",
            email: user?.emailAddresses[0]?.emailAddress ?? "unknown@example.com",
          },
          cartItems: groupedItems.map(({ product }) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            quantity: getItemCount(product._id),
          })),
        }),
      });


      const data = await res.json();

      if (data.success) {
        toast.success("Check your phone for the M-Pesa prompt!");
        setShowPaymentModal(false);
        await createOrder("mpesa");
      } else {
        toast.error(data.message || "Failed to initiate M-Pesa payment.");
      }
    } catch (err) {
      console.error("Mpesa error:", err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Process Stripe Card Payment
  const processCardPayment = async () => {
    try {
      setLoading(true);

      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        address: selectedAddress,
      };

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      if (checkoutUrl) {
        // ✅ Simulate order creation after successful Stripe payment webhook
        await createOrder("card");
        window.location.href = checkoutUrl;
      } else {
        toast.error("Stripe checkout initialization failed.");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error("Unable to start card checkout. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-shop-water)]/50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 py-6">
                <ShoppingBag className="text-[var(--color-shop-electric-blue)] w-6 h-6" />
                <Title className="text-[var(--color-shop-dark-blue)] text-2xl font-extrabold">
                  Shopping Cart
                </Title>
              </div>

              {/* Main Layout */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-[var(--color-shop-light-blue)]/40 rounded-lg shadow-sm">
                    <div className="max-h-[650px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-shop-bright-blue)] scrollbar-track-[var(--color-shop-alice-blue)]">
                      {groupedItems.map(({ product }) => {
                        const itemCount = getItemCount(product?._id);
                        return (
                          <div
                            key={product?._id}
                            className="flex items-center justify-between gap-5 border-b border-[var(--color-shop-light-blue)]/40 last:border-none p-4 hover:bg-[var(--color-shop-alice-blue)]/40 transition-colors duration-200"
                          >
                            <div className="flex flex-1 items-start gap-3">
                              {product?.images && (
                                <Link
                                  href={`/product/${product?.slug?.current}`}
                                  className="border border-[var(--color-shop-light-blue)]/60 rounded-lg overflow-hidden group"
                                >
                                  <Image
                                    src={urlFor(product?.images[0]).url()}
                                    alt={product?.name || "Product"}
                                    width={100}
                                    height={100}
                                    loading="lazy"
                                    className="w-28 h-28 md:w-36 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </Link>
                              )}
                              <div className="flex flex-col justify-between py-1 flex-1">
                                <div>
                                  <h2 className="font-semibold text-[var(--color-shop-dark-blue)] text-base line-clamp-1">
                                    {product?.name}
                                  </h2>
                                  <p className="text-sm text-gray-600">
                                    Variant:{" "}
                                    <span className="font-semibold">
                                      {product?.variant}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Status:{" "}
                                    <span className="font-semibold capitalize">
                                      {product?.status}
                                    </span>
                                  </p>
                                </div>

                                {/* Favorite + Delete */}
                                <div className="flex items-center gap-3 mt-8">
                                  <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <ProductSideMenu
                                          product={product}
                                          className="relative top-0 right-0"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-[var(--color-shop-dark-blue)] text-white text-xs px-3 py-1 rounded-md shadow-md">
                                        ❤️ Add to Favorites
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Trash
                                          onClick={() => {
                                            deleteCartProduct(product?._id);
                                            toast.success(
                                              "Product removed from cart!"
                                            );
                                          }}
                                          className="w-5 h-5 text-gray-500 hover:text-red-600 transition-colors"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-md shadow-md">
                                        🗑️ Remove item
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </div>

                            {/* Price & Quantity */}
                            <div className="flex flex-col items-end justify-between h-28">
                              <PriceFormatter
                                amount={(product?.price as number) * itemCount}
                                className="font-bold text-lg text-[var(--color-shop-dark-blue)]"
                              />
                              <QuantityButtons product={product} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reset Cart Button */}
                    <div className="flex justify-end">
                      <Button
                        onClick={handleResetCart}
                        className="bg-[var(--color-shop-electric-blue)] hover:bg-[var(--color-shop-dark-blue)] m-5 font-semibold text-white rounded-full transition-all"
                      >
                        Reset Cart
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Summary & Address */}
                <div className="space-y-5">
                  <Card className="bg-white border border-[var(--color-shop-light-blue)]/40 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-[var(--color-shop-dark-blue)]">
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg text-[var(--color-shop-dark-blue)]">
                        <span>Total</span>
                        <PriceFormatter amount={getTotalPrice()} />
                      </div>
                      <Button
                        className="w-full bg-[var(--color-shop-electric-blue)] hover:bg-[var(--color-shop-dark-blue)] rounded-full font-semibold text-white tracking-wide mt-2"
                        size="lg"
                        disabled={loading}
                        onClick={handleCheckout}
                      >
                        {loading ? "Processing..." : "Proceed to Checkout"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Address */}
                  {addresses && (
                    <Card className="bg-white border border-[var(--color-shop-light-blue)]/40 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-[var(--color-shop-dark-blue)]">
                          Delivery Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          defaultValue={
                            addresses?.find((a) => a.default)?._id.toString() ??
                            addresses[0]?._id.toString()
                          }
                        >
                          {addresses.map((address) => (
                            <div
                              key={address?._id}
                              onClick={() => setSelectedAddress(address)}
                              className={`flex items-center space-x-3 mb-3 p-2 rounded-md cursor-pointer transition-colors ${
                                selectedAddress?._id === address?._id
                                  ? "bg-[var(--color-shop-light-blue)]/20 text-[var(--color-shop-dark-blue)]"
                                  : "hover:bg-[var(--color-shop-alice-blue)]/30"
                              }`}
                            >
                              <RadioGroupItem value={address?._id.toString()} />
                              <Label
                                htmlFor={`address-${address?._id}`}
                                className="text-sm"
                              >
                                <span className="font-semibold">
                                  {address?.name}
                                </span>
                                <br />
                                <span className="text-gray-600">
                                  {address.address}, {address.city},{" "}
                                  {address.state} {address.zip}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}

          {/* Payment Modal */}
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            amount={getTotalPrice()}
            onMpesaPay={processMpesaPayment}
            onCardPay={processCardPayment}
            onSuccess={() => setShowSuccessModal(true)}
          />
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;
