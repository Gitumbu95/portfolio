"use client";

import { productType } from "@/constants/data";

import Link from "next/link";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-5 justify-between py-2">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`border border-shop-electric-blue/5 px-4 py-1.5 md:px-6 md:py-1.5 rounded-full hover:bg-shop-electric-blue hover:border-shop-light-sky-blue hover:text-white hoverEffect ${selectedTab === item?.title ? "bg-shop-dark-blue text-white border-shop-light-sky-blue" : "bg-shop-light-blue/10"}`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop-electric-blue hover:text-white hover:border-shop-electric-blue hoverEffect"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabBar;


