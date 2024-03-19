import React, { useState } from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import { Carousel } from '@material-tailwind/react'
interface IProps {
  images: IImage[]
}

export default function ProductGallery(props: IProps) {
  const { images } = props
  const [activeIndex, setActiveIndex] = useState(0)
  const handleSlideChange = (newIndex: number) => {
    setActiveIndex(newIndex)
  }
  return (
    <section>
      <Carousel placeholder={undefined} loop activeIndex={activeIndex}>
        <Image fill src="/imgs/sliders/1.jpeg" alt="image 1" className="h-full w-full object-cover" />
        <Image fill src="/imgs/sliders/2.jpeg" alt="image 2" className="h-full w-full object-cover" />
        <Image fill src="/imgs/sliders/3.jpeg" alt="image 3" className="h-full w-full object-cover" />
      </Carousel>
    </section>
  )
}
