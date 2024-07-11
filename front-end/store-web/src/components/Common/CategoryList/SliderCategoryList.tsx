'use client'

import React, { FC, useEffect, useId, useRef, useState } from 'react'
import Heading from '@/shared/Heading'
// @ts-ignore
import Glide from '@glidejs/glide/dist/glide.esm'
import department1Png from '@/assets/images/categories/slider/department1.png'
import department2Png from '@/assets/images/categories/slider/department2.png'
import department3Png from '@/assets/images/categories/slider/department3.png'
import department4Png from '@/assets/images/categories/slider/department4.png'
import { StaticImageData } from 'next/image'
import Link from 'next/link'
import CardCategory2 from '@/shared/CardCategory/CardCategory2'

export interface CardCategoryData {
  name: string
  desc: string
  img: string | StaticImageData
  color?: string
  href: string
}
const CATS: CardCategoryData[] = [
  {
    name: 'Thời trang nam',
    desc: '50+ sản phẩm',
    img: department1Png,
    color: 'bg-indigo-100',
    href: '/collection/nam'
  },
  {
    name: 'Thời trang nữ',
    desc: '50+ sản phẩm',
    img: department2Png,
    color: 'bg-slate-100',
    href: '/collection/nu'
  },
  {
    name: 'Phụ kiện nam',
    desc: '20+ sản phẩm',
    img: department3Png,
    color: 'bg-sky-100',
    href: '/collection/nam/phu-kien'
  },
  {
    name: 'Phụ kiện nữ',
    desc: '23+ sản phẩm',
    img: department4Png,
    color: 'bg-orange-100',
    href: '/collection/nu/phu-kien'
  },
]
export interface SliderCategoryListProps {
  className?: string
  itemClassName?: string
  heading?: string
  subHeading?: string
  data?: CardCategoryData[]
}

const SliderCategoryList: FC<SliderCategoryListProps> = ({
  heading = 'Khám phá danh mục',
  subHeading = '',
  className = '',
  itemClassName = '',
  data = CATS,
}) => {
  const sliderRef = useRef(null)
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: 4,
        },
        1024: {
          gap: 20,
          perView: 3.4,
        },
        768: {
          gap: 20,
          perView: 3,
        },
        640: {
          gap: 20,
          perView: 2.3,
        },
        500: {
          gap: 20,
          perView: 1.4,
        },
      },
    }

    if (!sliderRef.current) return

    let slider = new Glide(sliderRef.current, OPTIONS)
    slider.mount()
    setIsShow(true)
    return () => {
      slider.destroy()
    }
  }, [sliderRef])

  return (
    <div className={`nc-SliderCategoryList ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? '' : 'invisible'}`}>
        <Heading desc={subHeading} hasNextPrev>
          {heading}
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {data.map((item, index) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                <CardCategory2 featuredImage={item.img} name={item.name} desc={item.desc} bgClass={item.color} />
              </li>
            ))}
            <li className={`glide__slide ${itemClassName}`}>
              <div className={`flex-1 relative w-full h-0 rounded-2xl overflow-hidden group aspect-w-1 aspect-h-1 bg-slate-100`}>
                <div>
                  <div className="absolute inset-y-6 inset-x-10 flex flex-col sm:items-center justify-center">
                    <div className="flex relative text-slate-900">
                      <span className="text-lg font-semibold ">More collections</span>
                      <svg
                        className="absolute left-full w-5 h-5 ml-2 rotate-45 group-hover:scale-110 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.0701 9.57L12.0001 3.5L5.93005 9.57"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M12 20.4999V3.66992"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-sm mt-1 text-slate-800">Xem thêm</span>
                  </div>
                </div>
                <Link href={'/collection'} className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SliderCategoryList
