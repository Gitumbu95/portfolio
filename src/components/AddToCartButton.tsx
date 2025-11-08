"use client";

import { useEffect, useState } from "react";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const [mounted, setMounted] = useState(false);
  const [itemCount, setItemCount] = useState<number>(0);
  const isOutOfStock = product?.stock === 0;

  // 🧩 Ensure this only runs client-side after hydration
  useEffect(() => {
    setMounted(true);
    setItemCount(getItemCount(product?._id));
  }, [getItemCount, product?._id]);

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      setItemCount((prev) => prev + 1);
      toast.success(`${product?.name?.substring(0, 16)} added successfully!`);
    } else {
      toast.error("Cannot add more than available stock");
    }
  };

  // 🛑 Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full h-12 bg-[var(--color-shop-alice-blue)] animate-pulse rounded-md" />
    );
  }

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full p-2 rounded-md border border-[var(--color-shop-light-blue)] bg-[var(--color-shop-pure-white)] shadow-sm transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between text-[var(--color-shop-dark-blue)]">
            <span className="text-xs font-semibold tracking-wide">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1 mt-1 text-[var(--color-shop-dark-blue)]">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-[var(--color-shop-dark-blue)] text-[var(--color-shop-pure-white)] border border-[var(--color-shop-dark-blue)] hover:bg-[var(--color-shop-electric-blue)] hover:border-[var(--color-shop-electric-blue)] transition-all duration-300 ease-in-out font-semibold tracking-wide shadow-sm",
            isOutOfStock && "bg-gray-300 border-gray-300 text-gray-600 cursor-not-allowed",
            className
          )}
        >
          <ShoppingBag size={16} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
