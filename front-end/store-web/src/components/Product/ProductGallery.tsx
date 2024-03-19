import React, { useState } from 'react'
import Image from 'next/image'

interface IProps {
  images: IImage[]
}

export default function ProductGallery() {
  // const { images } = props
  const data = [
    {
      imgelink:
        'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
      imgelink:
        'https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    },
    {
      imgelink:
        'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    },
    {
      imgelink:
        'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80',
    },
    {
      imgelink:
        'https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80',
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
      <Image
        alt="ecommerce"
        className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
        src="https://www.whitmorerarebooks.com/pictures/medium/2465.jpg"
      />
      <div className="grid gap-4">
        <div className="carousel-inner relative overflow-hidden w-full">
          <Image className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]" src={activeImage.imgelink} alt="" />
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
