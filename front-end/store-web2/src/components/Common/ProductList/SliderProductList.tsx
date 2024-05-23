'use client'

import React, { FC, useEffect, useId, useRef, useState } from 'react'
import Heading from '@/shared/Heading'
// @ts-ignore
import Glide from '@glidejs/glide/dist/glide.esm'
import ProductCard from '@/components/Product/ProductCard'
import { PRODUCTS } from '@/data/data'
export interface SliderProductListProps {
  className?: string
  itemClassName?: string
  heading?: string
  headingFontClassName?: string
  headingClassName?: string
  subHeading?: string
  data: IProduct[]
}

const SliderProductList: FC<SliderProductListProps> = ({
  className = '',
  itemClassName = '',
  headingFontClassName,
  headingClassName,
  heading,
  subHeading,
  data = PRODUCTS,
}) => {
  const sliderRef = useRef(null)

  //
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      // direction: document.querySelector("html")?.getAttribute("dir") || "ltr",
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: 4 - 1,
        },
        1024: {
          gap: 20,
          perView: 4 - 1,
        },
        768: {
          gap: 20,
          perView: 4 - 2,
        },
        640: {
          gap: 20,
          perView: 1.5,
        },
        500: {
          gap: 20,
          perView: 1.3,
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
    <div className={`nc-SliderProductList ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? '' : 'invisible'}`}>
        <Heading className={headingClassName} fontClass={headingFontClassName} rightDescText={subHeading} hasNextPrev>
          {heading || `New Arrivals`}
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {data.map((item, index) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                <ProductCard data={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SliderProductList
