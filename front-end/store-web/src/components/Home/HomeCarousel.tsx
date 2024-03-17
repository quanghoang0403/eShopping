import React from 'react'
import { Carousel } from '@material-tailwind/react'

interface IProps {}

export default function HomeCarousel() {
  return (
    <Carousel className="max-w-[1600px] h-[50vh] mx-auto" placeholder={undefined} loop autoplay>
      <img src="/imgs/sliders/1.jpeg" alt="image 1" className="h-full w-full object-cover" />
      <img src="/imgs/sliders/2.jpeg" alt="image 2" className="h-full w-full object-cover" />
      <img src="/imgs/sliders/3.jpeg" alt="image 3" className="h-full w-full object-cover" />
    </Carousel>
  )
}
