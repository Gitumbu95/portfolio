"use client";

import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { StarIcon } from "@sanity/icons";
import { Flame } from "lucide-react";
import PriceView from "./PriceView";
import Title from "@/components/ui/Title";
import ProductSideMenu from "@/components/ProductSideMenu";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  const productUrl = `/product/${product?.slug?.current}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-shop-steel-blue)]/20 bg-[var(--color-shop-pure-white)] shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative w-full h-64 overflow-hidden bg-[var(--color-shop-alice-blue)]">
        {product?.images && (
          <Link href={productUrl}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt={product?.name || "product"}
              width={500}
              height={500}
              priority
              className={`h-64 w-full object-contain transition-transform duration-500 ${
                product?.stock !== 0
                  ? "group-hover:scale-105"
                  : "opacity-50 grayscale"
              }`}
            />
          </Link>
        )}

        {/* Floating Side Menu (Quick Actions) */}

        <ProductSideMenu product={product} />
       

        {/* Label / Tag */}
        {product?.status === "sale" ? (
          <span className="absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full bg-[var(--color-shop-electric-blue)] text-white shadow-md">
            Sale
          </span>
        ) : (
          <Link
            href="/deal"
            className="absolute top-2 left-2 flex items-center justify-center p-1.5 rounded-full border border-[var(--color-shop-accent-sky-blue)]/50 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[var(--color-shop-electric-blue)]"
          >
            <Flame
              size={16}
              fill="var(--color-shop-electric-blue)"
              className="text-[var(--color-shop-electric-blue)]"
            />
          </Link>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-3 p-4">
        {/* Category */}
        {product?.categories && (
          <p className="text-[11px] uppercase tracking-wider text-[var(--color-shop-light-Color)]/70 line-clamp-1">
            {product.categories.map((cat) => cat).join(", ")}
          </p>
        )}

        {/* Product Title */}
        <Title className="text-[15px] font-semibold text-shop-dark-blue line-clamp-2 group-hover:text-shop-electric-blue
         transition-colors duration-300">
          {product?.name}
        </Title>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`h-4 w-4 ${
                  index < 4
                    ? "text-[var(--color-shop-star-active)]"
                    : "text-[var(--color-shop-star-inactive)]"
                }`}
                fill={
                  index < 4
                    ? "var(--color-shop-star-active)"
                    : "var(--color-shop-star-inactive)"
                }
              />
            ))}
          </div>
          <span className="text-xs text-[var(--color-shop-light-Color)]">
            (5 Reviews)
          </span>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-[var(--color-shop-dark-blue)]">
            Status:
          </span>
          <span
            className={`font-semibold ${
              product?.stock === 0
                ? "text-red-600"
                : "text-[var(--color-shop-electric-blue)]"
            }`}
          >
            {product?.stock && product.stock > 0
              ? `${product.stock} in stock`
              : "Unavailable"}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col gap-2 mt-1">
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-base font-semibold text-[var(--color-shop-dark-blue)]"
          />
          <AddToCartButton
            product={product}
            className="w-full py-2 rounded-full bg-[var(--color-shop-deep-blue)] text-white font-semibold hover:bg-[var(--color-shop-electric-blue)]/75 transition-all duration-300 shadow-md hover:shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
