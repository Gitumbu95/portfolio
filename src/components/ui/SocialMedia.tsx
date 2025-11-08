import { Facebook, Instagram, Youtube } from 'lucide-react';
import { title } from 'process';
import React from 'react';
import { FaTiktok } from "react-icons/fa";
import { Tooltip, TooltipProvider, TooltipTrigger } from './tooltip';
import Link from 'next/link';
import { cn } from '../../../lib/utils';
import { TooltipContent } from '@radix-ui/react-tooltip';

interface Props{
    className?: string;
    iconClassName?: string;
    tooltipClassName?: string;
}

const socialLink =[

    /* {
        title: "Youtube",
        href: "https://www.facebook.com/p/Concept-Dash-61560460318462/",
        icon: <Youtube className='w-5 h-5' />
    }, */
    {
        title: "Facebook",
        href: "https://www.facebook.com/p/Concept-Dash-61560460318462/",
        icon: <Facebook className='w-5 h-5' />
    },
    {
        title: "Instagram",
        href: "https://www.instagram.com/concept.dash.254/?hl=en",
        icon: <Instagram className='w-5 h-5' />
    },
    {
        title: "Tiktok",
        href: "https://www.tiktok.com/discover/concept-dash-254",
        icon: < FaTiktok className='w-5 h-5' />
    }

]



const SocialMedia = ({className, iconClassName, tooltipClassName}:Props) => {
  return (
    <TooltipProvider>
        <div className={cn("flex items-center gap-3.5")}>
            {socialLink
  .filter(item => !!item.href)
  .map((item) => (
    <Tooltip key={item.title}>   {/* ✅ key belongs here */}
      <TooltipTrigger asChild>
        <Link
          href={item.href!}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2 border rounded-full hover:text-white hover:border-shop-electric-blue hoverEffect",
            iconClassName
          )}
        >
          {item.icon}
        </Link>
      </TooltipTrigger>
      <TooltipContent className={cn("bg-white text-black font-semibold border-shop-electric-blue border rounded-full", tooltipClassName)}>
        {item?.title}
      </TooltipContent>
    </Tooltip>
  ))}


        </div>

    </TooltipProvider>
    
  );
};


export default SocialMedia;

