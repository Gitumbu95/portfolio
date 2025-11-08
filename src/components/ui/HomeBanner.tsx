import React from 'react';
import { Title } from './text';
import Link from 'next/link';

import Image from 'next/image';
import { banner_1 } from '../../../Images';




const HomeBanner = () => {
  return (
    <div className='py-16 md:py-0 bg-shop-water rounded-lg px-10 lg:px-24 flex items-center justify-between'>
        <div className='space-y-5'>
            <Title >
            Tech & Lifestyle Made Easy. <br />
            From China to Kenya —
            Shop Smart with ConceptDash.
            </Title>
            <Link href={"/shop"} 
            className='bg-shop-dark-blue/90 text-white/90 px-5 py-2 rounded-md text-sm font-semibold hover:text-white hover:bg-shop-electric-blue hoverEffect'>
                Buy Now
            </Link>
        </div> {/*text */}
        <div>
           
            <Image src={banner_1} alt='banner' className='hidden md:inline-flex w-96'/>

        </div> {/*banner Image */}
    </div>
  );
};

export default HomeBanner;