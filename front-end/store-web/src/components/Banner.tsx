import { Carousel } from '@material-tailwind/react'
import Image from 'next/image'

interface IProps {
  images: IImage[]
  className?: string
}

export default function Banner(props: IProps) {
  const { images, className } = props
  return (
    <div className="max-w-[1600px] h-[50vh] mx-auto">
      {images.length > 1 && (
        <Carousel loop>
          {images.map((image, index) => (
            <Image key={index} fill src={image.url} alt={image.name} className="h-full w-full object-cover" />
          ))}
        </Carousel>
      )}
      {images.length === 1 && <Image fill src={images[0].url} alt="Single Image" className="h-full w-full object-cover" />}
    </div>
  )
}
