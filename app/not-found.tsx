"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, LifeBuoy } from "lucide-react";
import Logo from "@/components/ui/logo";

const NotFoundPage = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-shop-water)] px-6 text-center">
      <div className="max-w-lg w-full space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <Logo />
          <h1 className="text-3xl font-extrabold text-[var(--color-shop-deep-space-blue)] tracking-wide">
            Looking for something?
          </h1>
          <p className="text-sm text-gray-700 leading-relaxed">
            Oops! The page you’re trying to reach doesn’t exist or may have been moved.  
            Let’s get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-semibold shadow-md bg-[var(--color-shop-dark-blue)] hover:bg-[var(--color-shop-electric-blue)] hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Home
          </Link>

          <Link
            href="/help"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border text-sm font-semibold bg-white text-[var(--color-shop-dark-blue)] border-[var(--color-shop-bright-blue)] hover:bg-[var(--color-shop-bright-blue)] hover:text-white hover:shadow-lg transition-all duration-300"
          >
            <LifeBuoy className="w-4 h-4" />
            Help Center
          </Link>
        </div>

        {/* Support Text */}
        <div className="text-center text-gray-700 text-sm mt-8">
          Need more assistance? Visit the{" "}
          <Link
            href="/help"
            className="font-semibold text-[var(--color-shop-bright-blue)] hover:underline"
          >
            Help section
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="font-semibold text-[var(--color-shop-bright-blue)] hover:underline"
          >
            contact us
          </Link>
          .
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
