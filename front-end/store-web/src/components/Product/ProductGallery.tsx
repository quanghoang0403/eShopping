import React, { useState } from 'react'
import Image from 'next/image'

interface IProps {
  images: IImage[]
}

export default function ProductGallery() {
  // const { images } = props
  const data = [
    {
      imgelink: '/imgs/productPromo/1.jpg',
    },
    {
      imgelink: '/imgs/productPromo/2.jpg',
    },
    {
      imgelink: '/imgs/productPromo/3.jpg',
    },
    {
      imgelink: '/imgs/productPromo/1.jpg',
    },
    {
      imgelink: '/imgs/productPromo/2.jpg',
    },
    {
      imgelink: '/imgs/productPromo/3.jpg',
    },
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeImage, setActiveImage] = useState(data[0])
  const handleActiveIndex = (index: number) => {
    if (index < 0) index = data.length - 1
    else if (index >= data.length) index = 0
    setActiveImage(data[index])
    setActiveIndex(index)
  }
  return (
    <>
      <Image fill alt="" className="lg:w-1/2 w-40 object-cover object-center rounded border border-gray-200" src="/imgs/productPromo/1.jpg" />
      <div className="grid gap-4">
        <div className="carousel-inner relative overflow-hidden w-full">
          <Image fill className="h-auto w-40 max-w-full rounded-lg object-cover object-center md:h-[480px]" src={activeImage.imgelink} alt="" />
          <label
            onClick={() => {
              handleActiveIndex(activeIndex - 1)
            }}
            className="prev control-3 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900  leading-tight text-center z-10 inset-y-0 left-0 my-auto"
          >
            ‹
          </label>
          <label
            onClick={() => {
              handleActiveIndex(activeIndex + 1)
            }}
            className="next control-3 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900  leading-tight text-center z-10 inset-y-0 right-0 my-auto"
          >
            ›
          </label>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {data.map((image, index) => (
            <div key={index}>
              <Image
                fill
                onClick={() => {
                  setActiveIndex(index)
                  setActiveImage(image)
                }}
                src={image.imgelink}
                className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center"
                alt="gallery-image"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
