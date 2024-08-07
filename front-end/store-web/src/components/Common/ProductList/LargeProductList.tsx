'use client'

import React, { FC, useEffect, useId, useRef, useState } from 'react'
import Heading from '@/shared/Heading'
// @ts-ignore
import Glide from '@glidejs/glide/dist/glide.esm'
import Link from 'next/link'
import { DEMO_LARGE_PRODUCTS } from './LargeProductList2'
import CollectionCard from './components/CollectionCard'

export interface LargeProductListProps {
  className?: string
  itemClassName?: string
}

const LargeProductList: FC<LargeProductListProps> = ({ className = '' }) => {
  const sliderRef = useRef(null)

  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 3,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          gap: 28,
          perView: 2.5,
        },
        1024: {
          gap: 20,
          perView: 2.15,
        },
        768: {
          gap: 20,
          perView: 1.5,
        },

        500: {
          gap: 20,
          perView: 1,
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
    <div className={`nc-LargeProductList ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? '' : 'invisible'}`}>
        <Heading isCenter={false} hasNextPrev>
          Chosen by our experts
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {DEMO_LARGE_PRODUCTS.map((product, index) => (
              <li className={`glide__slide`} key={index}>
                <CollectionCard name={product.name} price={product.price} imgs={product.images} description={product.desc} />
              </li>
            ))}

            <li className={`glide__slide   `}>
              <Link href={'/search'} className="block relative group">
                <div className="relative rounded-2xl overflow-hidden h-[410px]">
                  <div className="h-[410px] bg-black/5 dark:bg-neutral-800"></div>
                  <div className="absolute inset-y-6 inset-x-10  flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center relative">
                      <span className="text-xl font-semibold">More items</span>
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
                        />
                        <path
                          d="M12 20.4999V3.66992"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm mt-1">Xem thêm</span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LargeProductList
