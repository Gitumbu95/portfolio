import { Button } from "@/components/ui/button";

import Container  from "@/components/Container";

import React from "react";
import HomeBanner from "@/components/ui/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import HomeCategories from "@/components/HomeCategories";
import { getCategories } from "../../sanity/queries";
import ShopByBrands from "@/components/ShopByBrands";
import LatestBlog from "@/components/LatestBlog";


const Home = async () => {
  const categories = await getCategories(6);

  return(
  <Container className="bg-sky-500/5">

    <HomeBanner />    
    <ProductGrid />
    <HomeCategories categories={categories} />
    <ShopByBrands />
    <LatestBlog/>
    
  </Container>
  );
  
};

export default Home;