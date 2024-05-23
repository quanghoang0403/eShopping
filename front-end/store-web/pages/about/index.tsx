import rightImg from '@/images/hero-right1.png'
import React, { FC } from 'react'
import BgGlassmorphism from '@/shared/Background/BgGlassmorphism'
import BackgroundSection from '@/shared/Background/BackgroundSection'
import SectionHero from '@/components/About/SectionHero'
import SectionFounder from '@/components/About/SectionFounder'
import SectionClientSay from '@/components/About/SectionClientSay'
import SectionStatistic from '@/components/About/SectionStatistic'
import PromoBanner3 from '@/components/Common/Banner/PromoBanner3'

const PageAbout = ({}) => {
  return (
    <div className={`nc-PageAbout overflow-hidden relative`}>
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />

      <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
        <SectionHero
          rightImg={rightImg}
          heading="👋 About Us."
          btnText=""
          subHeading="We’re impartial and independent, and every day we create distinctive, world-class programmes and content which inform, educate and entertain millions of people in the around the world."
        />

        <SectionFounder />
        <div className="relative py-16">
          <BackgroundSection />
          <SectionClientSay />
        </div>

        <SectionStatistic />

        <PromoBanner3 />
      </div>
    </div>
  )
}

export default PageAbout
