import { Heart } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const FavoriteIcon = () => {
  return (
    <Link href={'/favorite'} className='group relative'>
        <span className='absolute -top-1 -right-1 bg-shop-dark-blue text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center'>0</span>
        < Heart className='w-6 h-6 hover:text-shop-accent-sky-blue hoverEffect' />
        
    </Link>
  );
};

export default FavoriteIcon;