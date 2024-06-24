import React, { FC } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import backgroundLineSvg from '@/assets/svgs/moon.svg'
import img from '@/assets/images/banners/sectionHero/single.png'
import Image from 'next/image'

export interface SectionHeroSingleProps {
  className?: string
}

const SectionHeroSingle: FC<SectionHeroSingleProps> = ({ className = '' }) => {
  return (
    <div className={`nc-SectionHeroSingle relative ${className}`} data-nc-id="SectionHeroSingle">
      <div className="relative pt-8 lg:pt-0 lg:absolute z-10 inset-x-0 top-[10%] sm:top-[20%]  container">
        <div className="flex flex-col items-start max-w-lg xl:max-w-2xl space-y-5 xl:space-y-8 ">
          <span className="sm:text-lg md:text-xl font-semibold text-neutral-900">Mùa hè này, hãy sắm những bộ trang phục thật bốc cháy 🔥</span>
          <h2 className="font-bold text-black text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl !leading-[115%] ">Bộ sưu tập mùa hè đốt lửa.</h2>
          <div className="sm:pt-4">
            <ButtonPrimary href="/search" sizeClass="px-6 py-3 lg:px-8 lg:py-4" fontSize="text-sm sm:text-base lg:text-lg font-medium">
              Bắt đầu ngay
            </ButtonPrimary>
          </div>
        </div>
      </div>

      <div className="relative z-[1] lg:aspect-w-16 lg:aspect-h-8 2xl:aspect-h-7">
        <div className=" ">
          <div className="mt-5 lg:mt-0 lg:absolute right-0 bottom-0 top-0 w-full max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl ml-auto">
            <Image
              sizes="(max-width: 768px) 100vw, 50vw"
              fill
              className="w-full sm:h-full object-contain object-right-bottom "
              src={img}
              alt=""
              priority
            />
          </div>
        </div>
      </div>

      {/* BG */}
      <div className="absolute inset-0 bg-[#F7F0EA] rounded-2xl overflow-hidden z-0">
        <Image fill sizes="(max-width: 768px) 100vw, 50vw" className="absolute w-full h-full object-contain" src={backgroundLineSvg} alt="hero" />
      </div>
    </div>
  )
}

export default SectionHeroSingle
