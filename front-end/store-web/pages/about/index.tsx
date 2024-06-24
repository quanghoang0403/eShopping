import React, { FC } from 'react'
import BgGlassmorphism from '@/shared/Background/BgGlassmorphism'
import BackgroundSection from '@/shared/Background/BackgroundSection'
import SectionFounder from '@/components/About/SectionFounder'
import SectionClientSay from '@/components/About/SectionClientSay'
import SectionStatistic from '@/components/About/SectionStatistic'
import { ClockIcon, ArrowPathIcon, ExclamationCircleIcon, HandRaisedIcon, BeakerIcon, FireIcon } from '@heroicons/react/24/outline'

const PageAbout = ({}) => {
  return (
    <div className={`nc-PageAbout overflow-hidden relative`}>
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />

      <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
        {/* <SectionFounder /> */}
        {/* <SectionStatistic /> */}
      </div>
    </div>
  )
}

export default PageAbout
