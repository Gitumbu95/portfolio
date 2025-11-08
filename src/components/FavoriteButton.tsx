"use client";
import { Product } from "../../sanity.types";
import useStore from "../../store";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product | null | undefined;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const availableItem = favoriteProduct.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableItem || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
            ? "Product removed successfully!"
            : "Product added successfully!"
        );
      });
    }
  };
  return (
    <>
      {!showProduct ? (
        <Link href={"/wishlist"} className="group relative">
          <Heart className="w-5 h-5 hover:text-shop-bright-blue hoverEffect" />
          <span className="absolute -top-1 -right-1 bg-shop-dark-blue text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {favoriteProduct?.length ? favoriteProduct?.length : 0}
          </span>
        </Link>
      ) : (
        <button
          onClick={handleFavorite}
          className="group relative hover:text-shop-bright-blue hoverEffect border border-shop-dark-blue/60 hover:border-shop-bright-blue p-1.5 rounded-sm"
        >
          {existingProduct ? (
            <Heart
              className="w-5 h-5 mt-0.5 text-shop-bright-blue/80 hover:text-shop-electric-blue fill-shop-electric-blue/50 transition-all duration-300 ease-in-out cursor-pointer"
            />

          ) : (
            <Heart className="text-shop-star-active group-hover:text-shop-electric-blue hoverEffect mt-.5 w-5 h-5" />
          )}
        </button>
      )}
    </>
  );
};

export default FavoriteButton;