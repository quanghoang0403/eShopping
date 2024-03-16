import React from 'react'
import { Carousel } from '@material-tailwind/react'

interface IProps {}

export default function HomeCarousel() {
  return (
    <Carousel className="max-w-[1600px] h-[50vh] mx-auto" placeholder={undefined} loop autoplay>
      <img src="/imgs/slide1.avif" alt="image 1" className="h-full w-full object-cover" />
      <img src="/imgs/slide2.avif" alt="image 2" className="h-full w-full object-cover" />
      <img src="/imgs/slide3.avif" alt="image 3" className="h-full w-full object-cover" />
    </Carousel>
  )
}
