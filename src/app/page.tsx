import Hero from '../components/sections/Hero';
import Sucess from '../components/sections/Sucess';
import ServiceSection from '../components/sections/ServiceSection';
import Testimonial from '../components/sections/Testimonial';
import FaqSection from '../components/sections/FaqSection'; 
import LaunchOfferPopup from "../components/LaunchOfferPopup";
// app/page.tsx
export default function Home() {
  
  return (
   <>
   <Hero/>
   <Sucess/>
   <LaunchOfferPopup />
   <ServiceSection/>
   <Testimonial/>
   <FaqSection/>
   </>
  )
}


