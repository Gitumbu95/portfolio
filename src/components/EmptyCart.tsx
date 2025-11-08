"use client";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { emptyCart } from "@/Images";
import Image from "next/image";

export default function EmptyCart() {
  return (
    <div className="py-16 md:py-28 bg-shop-powder-blue flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 max-w-md w-full text-center border border-shop-light-blue/40"
      >
        {/* Floating Cart Illustration */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="relative w-48 h-48 mx-auto mb-4"
        >
          <Image
            src={emptyCart}
            alt="Empty shopping cart"
            fill
            className="object-contain drop-shadow-lg"
          />
          <motion.div
            animate={{
              x: [0, 5, -5, 0],
              y: [0, -5, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
            className="absolute -top-3 -right-3 bg-shop-electric-blue p-2 rounded-full shadow-md"
          >
            <ShoppingCart size={22} className="text-white" />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-shop-dark-blue tracking-tight">
          Your cart is feeling lonely
        </h2>

        {/* Subtext */}
        <p className="mt-3 text-shop-light-Color leading-relaxed">
          You haven&apos;t added anything yet. Discover products you&apos;ll love and fill your cart with amazing finds!
        </p>

        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8"
        >
          <Link
            href="/shop"
            className="inline-block bg-shop-electric-blue hover:bg-shop-dark-blue 
                       text-white px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide 
                       shadow-md transition-all duration-300"
          >
            Explore Products
          </Link>
        </motion.div>

        {/* Subtle footer note */}
        <p className="mt-4 text-xs text-shop-light-Color/70">
          ConceptDash254 — Smart shopping starts here.
        </p>
      </motion.div>
    </div>
  );
}
