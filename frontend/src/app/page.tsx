import Image from "next/image";
import { Banner } from "./layouts/Banner";
import { Features } from "./layouts/Features";
import { HeroSection } from "./layouts/HeroSection";

export default function Home() {
  return (
    <main className="mx-[150px] max-lg:mx-[20px]">
      <Banner />
      <div className="mt-10">
        <Features />
        <HeroSection
        imageSrc={"/hero_furniture.jpg"}
        heading={"Leader of low prices on furniture in North America – more than 6 years on the market"} 
        desc={`
                We manufacture high quality and affordable upholstered furniture in North America. 
                Over the years we have earned the trust of private customers and large companies. 
                
                We are increasing production and are ready to offer our products to neighboring countries. We provide a full range of services, including selection of materials and assembly of furniture for your home. Enjoy your shopping!
        `}
        stats={[
          {
            value: '7', label: 'years on the market' 
          },
          {
            value: '140+', label: 'Cities in NA'
          },
          {
            value: '250+', label: 'Products to choose'
          }
        ]}
        />
      </div>
    </main>
  );
}
