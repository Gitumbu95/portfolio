"use client";
import { X } from "lucide-react";
import React, { FC } from "react";
import Logo from "./logo";
import { headerData } from "../../constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "../../../hooks";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const SidebarRef= useOutsideClick<HTMLDivElement>(onClose)
  return (
    <>
      {/* Sidebar panel */}
      <div
        className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/80 shadow-xl
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`} >
              
        {/* actual menu content here */}
        <div ref={SidebarRef} className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-r-shop-accent-sky-blue flex flex-col gap-6">
          
          <div className="flex items-center justify-between">
            <Logo className="text-white" spanDesign="group-hover:text-white" />

            <button
              className="hover:text-shop-electric-blue hoverEffect"
              onClick={onClose}
            >
              <X />
            </button>
          </div> {/* header row with logo + close button */}

          <div className="flex flex-col space-y-3.5 font-semibold tracking-wide ">
            {headerData?.map((item) => (
              <Link
              href={item?.href}
              key={item?.title}
              className={`hover:text-shop-electric-blue hoverEffect ${
                pathname === item?.href ? "text-shop-electric-blue" : ""
                }`}>
                {item?.title}
              </Link>

            ))}
          </div> {/* Links navbar */}

          <SocialMedia />

        </div>
      </div>
    </>
  );
};

export default SideMenu;
