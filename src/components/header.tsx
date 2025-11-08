import React from "react";
import Container from "./Container";
import Logo from "./ui/logo";
import HeaderMenu from "./ui/HeaderMenu";
import SearchBar from "./ui/SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./ui/SignIn";
import MobileMenu from "./ui/MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logs } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();

  // ✅ Fetch user orders (only if signed in)
  let orders = null;
  if (userId) {
    try {
      orders = await getMyOrders(userId);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  }

  return (
    <header className="sticky top-0 z-50 py-4 bg-white/70 backdrop-blur-md border-b border-[var(--color-shop-light-blue)]/40 shadow-sm">
      <Container className="flex items-center justify-between text-[var(--color-shop-dark-blue)]">
        {/* Left Section - Logo + Mobile Menu */}
        <div className="flex items-center gap-2 md:gap-4 w-auto md:w-1/3">
          <MobileMenu />
          <Logo />
        </div>

        {/* Center - Navigation Menu */}
        <HeaderMenu />

        {/* Right Section - Search, Icons, Auth */}
        <div className="flex items-center justify-end gap-4 md:gap-5 w-auto md:w-1/3">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />

          {/* Orders icon (visible only when signed in) */}
          {user && (
            <Link
              href="/orders"
              className="relative group flex items-center justify-center hover:text-[var(--color-shop-electric-blue)] transition-colors duration-200"
            >
              <Logs className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-2 bg-[var(--color-shop-electric-blue)] text-white h-4.5 w-4.5 rounded-full text-[10px] font-semibold flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                {orders?.length ? orders.length : 0}
              </span>
            </Link>
          )}

          {/* Clerk Auth */}
          <ClerkLoaded>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 border-2 border-[var(--color-shop-electric-blue)] rounded-full",
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignIn />
            </SignedOut>
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
