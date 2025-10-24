import Hero from '../components/sections/Hero';
import Sucess from '../components/sections/Sucess';
import ServiceSection from '../components/sections/ServiceSection';
import Testimonial from '../components/sections/Testimonial';
import FaqSection from '../components/sections/FaqSection'; 
import LaunchOfferPopup from "../components/LaunchOfferPopup";
import { connection } from 'next/server'
// app/page.tsx
export default async function Home() {
  await connection()
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


