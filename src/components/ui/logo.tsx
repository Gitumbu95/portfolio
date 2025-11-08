import { cn } from '../../../lib/utils';
import Link from 'next/link';
import React from 'react'

const Logo = ({className, spanDesign}:{className?:string, spanDesign?:string}) => {
  return (
    
    <Link href={"/"} className='inline-flex'>
        <h2 
            className={cn(
                "text-2xl text-shop-deep-blue font-black tracking-wider uppercase hover:text-shop-light-sky-blue hoverEffect group font-sans", 
                className)}>
            Concept<span className={cn("text-shop-electric-blue group-hover:text-shop-deep-blue  hoverEffect", spanDesign)}>Dash254</span>
        </h2>
    </Link>
  );
};

export default Logo;