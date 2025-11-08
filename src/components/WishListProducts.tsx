"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";
import { motion } from "framer-motion";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  const handleResetWishlist = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your wishlist?"
    );
    if (confirmReset) {
      resetFavorite();
      toast.success("Wishlist reset successfully");
    }
  };

  return (
    <Container>
      {favoriteProduct?.length > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-[var(--color-shop-alice-blue)] rounded-xl shadow-sm border border-[var(--color-shop-light-blue)]/40 overflow-hidden p-4"
          >
            <div className="overflow-x-auto rounded-md">
              <table className="w-full text-sm border-separate border-spacing-y-2 min-w-[800px]">
                <thead className="text-left text-[var(--color-shop-dark-blue)] uppercase text-xs font-bold bg-[var(--color-shop-powder-blue)]/60">
                  <tr>
                    <th className="p-3 rounded-l-md">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-center rounded-r-md">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {favoriteProduct
                    ?.slice(0, visibleProducts)
                    ?.map((product: Product, index: number) => (
                      <motion.tr
                        key={product?._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        className="bg-white hover:bg-[var(--color-shop-light-blue)]/10 transition-all duration-300 border border-[var(--color-shop-light-blue)]/40 shadow-sm"
                      >
                        {/* Product Image + Name */}
                        <td className="px-3 py-4 flex items-center gap-3 min-w-[200px]">
                          <X
                            onClick={() => {
                              removeFromFavorite(product?._id);
                              toast.success("Removed from wishlist");
                            }}
                            size={18}
                            className="hover:text-red-600 hover:cursor-pointer transition-transform hover:scale-110"
                          />
                          {product?.images && (
                            <Link
                              href={`/product/${product?.slug?.current}`}
                              className="border rounded-md group overflow-hidden flex-shrink-0"
                            >
                              <Image
                                src={urlFor(product?.images[0]).url()}
                                alt={"product image"}
                                width={70}
                                height={70}
                                className="h-16 w-16 object-contain bg-[var(--color-shop-powder-blue)] group-hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                          )}
                          <div className="flex flex-col">
                            <p className="font-medium text-[var(--color-shop-dark-blue)] line-clamp-1">
                              {product?.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              SKU: #{product?._id?.slice(0, 6)}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3 capitalize text-gray-600">
                          {product?.categories && (
                            <p className="uppercase line-clamp-1 text-xs font-semibold">
                              {product.categories.map((cat) => cat).join(", ")}
                            </p>
                          )}
                        </td>

                        {/* Type */}
                        <td className="p-3 capitalize text-gray-600">
                          {product?.variant || "—"}
                        </td>

                        {/* Stock Status */}
                        <td
                          className={`p-3 text-sm font-semibold ${
                            (product?.stock as number) > 0
                              ? "text-[var(--color-shop-electric-blue)]"
                              : "text-red-600"
                          }`}
                        >
                          {(product?.stock as number) > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </td>

                        {/* Price */}
                        <td className="p-3 font-semibold text-[var(--color-shop-dark-blue)]">
                          <PriceFormatter amount={product?.price} />
                        </td>

                        {/* Action */}
                        <td className="p-3 text-center">
                          <AddToCartButton
                            product={product}
                            className="rounded-full w-full"
                          />
                        </td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Buttons Section - Right Aligned */}
          <div className="flex justify-end items-center gap-3 mt-8 flex-wrap">
            {visibleProducts < favoriteProduct?.length && (
              <Button
                variant="outline"
                onClick={loadMore}
                className="bg-gradient-to-r from-sky-500 to-blue-700 text-white hover:opacity-90 font-semibold shadow-md rounded-full"
              >
                Load More
              </Button>
            )}

            {visibleProducts > 10 && (
              <Button
                onClick={() => setVisibleProducts(10)}
                variant="outline"
                className="bg-gradient-to-r from-sky-500 to-blue-700 text-white hover:opacity-90 font-semibold shadow-md rounded-full"
              >
                Load Less
              </Button>
            )}

            {favoriteProduct?.length > 0 && (
              <Button
                onClick={handleResetWishlist}
                className="bg-gradient-to-r from-sky-500 to-blue-700 text-white hover:opacity-90 font-semibold shadow-md rounded-full"
              >
                Reset Wishlist
              </Button>
            )}
          </div>
        </>
      ) : (
        // Empty Wishlist
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center bg-[var(--color-shop-powder-blue)]/20 rounded-2xl shadow-sm border border-[var(--color-shop-light-blue)]/40"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Heart className="h-12 w-12 text-[var(--color-shop-electric-blue)]" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[var(--color-shop-dark-blue)]">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-gray-600">
              Items added to your wishlist will appear here.
            </p>
          </div>

          <Button
            asChild
            className="bg-[var(--color-shop-electric-blue)] hover:bg-[var(--color-shop-dark-blue)] text-white rounded-full"
          >
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </motion.div>
      )}
    </Container>
  );
};

export default WishListProducts;
