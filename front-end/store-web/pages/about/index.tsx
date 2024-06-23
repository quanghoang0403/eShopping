import rightImg from '@/assets/images/hero-right1.png'
import React, { FC } from 'react'
import BgGlassmorphism from '@/shared/Background/BgGlassmorphism'
import BackgroundSection from '@/shared/Background/BackgroundSection'
import SectionHero from '@/components/About/SectionHero'
import SectionFounder from '@/components/About/SectionFounder'
import SectionClientSay from '@/components/About/SectionClientSay'
import SectionStatistic from '@/components/About/SectionStatistic'
import PromoBanner3 from '@/components/Common/Banner/PromoBanner3'
import { ClockIcon, ArrowPathIcon, ExclamationCircleIcon, HandRaisedIcon, BeakerIcon, FireIcon } from '@heroicons/react/24/outline'

const PageAbout = ({}) => {
  return (
    <div className={`nc-PageAbout overflow-hidden relative`}>
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />

      <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
        <SectionHero
          rightImg={rightImg}
          heading="👋 Về Cúc Hoạ Mi."
          btnText=""
          subHeading="Cúc Hoạ Mi là project thời trang cao cấp nửa cổ điển nửa hiện đại mà tụi mình hay gọi với cái tên thân thuộc Parisian Chic được làm bằng sự chân
              thành và tử tế của Team. Nếu bạn yêu thích phong cách này hãy cùng tiệm trải nghiệm những items thời thượng này nhé!"
        />

        {/* <SectionFounder /> */}
        {/* <SectionStatistic /> */}
      </div>
    </div>
  )
}

export default PageAbout
