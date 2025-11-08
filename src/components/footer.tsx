import Container  from "./Container";
import React from "react";
import FooterTop from "./FooterTop";
import Logo from "./ui/logo";
import SocialMedia from "./ui/SocialMedia";
import { SubText } from "./ui/text";
import { SubTitle } from "./ui/text";
import { categoriesData, quickLinksData } from "../constants/data";
import Link from "next/link";
import { Button } from "./ui/button";


const Footer = () => {
    return(
        <footer className="bg-white border-t">
            <Container>
                <FooterTop />
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-6">
                        <Logo />
                        <SubText >Your trusted source for authentic tech and lifestyle products. <br /> Bringing the best from China to your doorstep in Kenya.</SubText>
                        
                        <SocialMedia 
                        className="text-darkColor/60 " 
                        iconClassName="border-darkColor/60 hover:border-shop-dark-blue hover:text-shop-electric-blue"
                        tooltipClassName="bg-shop-dark-blue text-white " />
                    </div>
                    <div>
                        <SubTitle >Quick Links</SubTitle>

                        <ul className="space-y-3 mt-4">
                            {quickLinksData?.map((item) =>(
                                <li key={item?.title}>
                                    <Link href={item?.href} className="hover:text-shop-electric-blue hoverEffect font-medium">{item?.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <SubTitle >Categories</SubTitle>

                        <ul className="space-y-3 mt-4">
                            {categoriesData?.map((item) =>(
                                <li key={item?.title}>
                                    <Link href={'/category/${item?.href}'} className="hover:text-shop-electric-blue hoverEffect font-medium">{item?.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <SubTitle>NewsLetter</SubTitle>
                        <SubText>Subscribe to our newsletter to receive updates and exclusive offers</SubText>
                        <form className="space-y-3">
                            <input placeholder="Enter your email" type="email" required />
                            <Button className="w-full text-white font-semibold">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <div className="py-6 border-t text-center text-sm capitalize text-gray-600">
                    <div >
                        © {new Date().getFullYear()} {""} 
                        <Logo className="text-sm " />
                        . All rights reserved.

                    </div>

                </div>
            </Container>


        </footer>
       
    );

};

export default Footer;



