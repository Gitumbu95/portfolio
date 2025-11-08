import React from "react";
import Title from "@/components/ui/Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const priceArray = [
  { title: "Under KES20000", value: "0-20000" },
  { title: "KES20000 - KES40000", value: "20000-40000" },
  { title: "KES40000 - KES60000", value: "40000-60000" },
  { title: "KES60000 - KES80000", value: "60000-80000" },
  { title: "Over KES80000", value: "80000-1000000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}
const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Price</Title>
      <RadioGroup className="mt-2 space-y-1" value={selectedPrice || ""}>
        {priceArray?.map((price, index) => (
          <div
            key={index}
            onClick={() => setSelectedPrice(price?.value)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={price?.value}
              id={price?.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price.value}
              className={`${selectedPrice === price?.value ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default PriceList;