import React, { FC } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import backgroundLineSvg from '@/assets/svgs/moon.svg'
import img from '@/assets/images/banners/sectionHero/single2.jpg'
import Image from 'next/image'

export interface SectionHeroSingleProps {
  className?: string
}

const SectionHeroSingle: FC<SectionHeroSingleProps> = ({ className = '' }) => {
  return (
    <div className={`nc-SectionHeroSingle relative ${className}`} data-nc-id="SectionHeroSingle">
      <div className="relative pt-8 lg:pt-0 lg:absolute z-10 inset-x-0 top-[10%] sm:top-[20%]  container">
        <div className="flex flex-col items-start max-w-lg space-y-5 xl:space-y-8 ">
          <span className="sm:text-xl md:text-2xl font-semibold text-neutral-900">Bộ sưu tập áo polo thời thượng</span>
          <h2 className="font-bold text-black text-3xl 2xl:text-4xl !leading-[115%] ">Chất vải mềm mại với tính năng DRY khô nhanh</h2>
          {/* <div className="sm:pt-4">
            <ButtonPrimary href="/search" sizeClass="px-6 py-3 lg:px-8 lg:py-4" fontSize="text-sm sm:text-base lg:text-lg font-medium">
              Bắt đầu ngay
            </ButtonPrimary>
          </div> */}
        </div>
      </div>

      <div className="relative z-[1] lg:aspect-w-16 lg:aspect-h-8 2xl:aspect-h-7">
        <div className=" ">
          <div className="mt-5 w-full max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl ml-auto">
            <Image fill className="w-full sm:h-full object-contain object-right-bottom " src={img} alt="" priority />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionHeroSingle
