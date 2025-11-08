import { SignInButton } from '@clerk/nextjs';
import React from 'react';

const SignIn = () => {
  return (
    <SignInButton mode='modal'>
      <button className='text-sm font-semibold text-darkColor hover:text-shop-accent-sky-blue hover:cursor-pointer hoverEffect'>
        Login
      </button>
    </SignInButton>
    
  );
};

export default SignIn;