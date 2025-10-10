// src/pages/Home.tsx
import {Hero} from '../components/Hero'
import {About} from '../components/About'
//import {Metrics} from '../components/Metrics'
import {Services} from '../components/Services'
import {Testimonials} from '../components/Testimonials'
import {Team} from '../components/Team'
import {FAQ} from '../components/FAQ'
import {Newsletter} from '../components/Newsletter'
import {Contact} from '../components/Contact'
import { TrustedBrands } from './TrustedBrands'
import { CompanyOverview } from './CompanyOverview'
import { CoreServices } from './CoreServices'

export function Home() {
  return (
    <div className="w-full relative z-10">
      <Hero />
      <TrustedBrands/>
      <CompanyOverview/>
      <CoreServices/>
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Contact />
    </div>
  )
}
