import React, { FC } from 'react'
import NcImage from '@/shared/NcImage'
import HIW1img from '@/assets/images/howItWork/HIW1img.png'
import HIW2img from '@/assets/images/howItWork/HIW2img.png'
import HIW3img from '@/assets/images/howItWork/HIW3img.png'
import HIW4img from '@/assets/images/howItWork/HIW4img.png'
import VectorImg from '@/assets/images/howItWork/VectorHIW.svg'
import Badge from '@/shared/Badge'
import Image from 'next/image'

export interface SectionHowItWorkProps {
  className?: string
}

const DATA = [
  {
    id: 1,
    img: HIW1img,
    imgDark: HIW1img,
    title: 'Tìm kiếm và khám phá',
    desc: 'Bộ lọc thông minh và gợi ý giúp bạn dễ dàng tìm kiếm',
  },
  {
    id: 2,
    img: HIW2img,
    imgDark: HIW2img,
    title: 'Thêm vào giỏ hàng',
    desc: 'Dễ dàng chọn đúng sản phẩm và thêm vào giỏ hàng',
  },
  {
    id: 3,
    img: HIW3img,
    imgDark: HIW3img,
    title: 'Vận chuyển nhanh',
    desc: 'Đơn vị vận chuyển sẽ xác nhận và giao hàng nhanh chóng cho bạn',
  },
  {
    id: 4,
    img: HIW4img,
    imgDark: HIW4img,
    title: 'Tận hưởng sản phẩm',
    desc: 'Thỏa sức và tận hưởng những sản phẩm chất lượng 5 sao',
  },
]

const SectionHowItWork: FC<SectionHowItWorkProps> = ({ className = '' }) => {
  return (
    <div className={`nc-SectionHowItWork ${className}`}>
      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 xl:gap-20">
        <Image className="hidden md:block absolute inset-x-0 top-5" src={VectorImg} alt="vector" />
        {DATA.map((item: (typeof DATA)[number], index: number) => (
          <div key={item.id} className="relative flex flex-col items-center max-w-xs mx-auto">
            <NcImage containerClassName="mb-4 sm:mb-10 max-w-[140px] mx-auto" className="rounded-3xl" src={item.img} sizes="150px" alt="HIW" />
            <div className="text-center mt-auto space-y-5">
              <Badge name={`Step ${index + 1}`} color={!index ? 'red' : index === 1 ? 'indigo' : index === 2 ? 'yellow' : 'purple'} />
              <h3 className="text-base font-semibold">{item.title}</h3>
              <span className="block text-slate-600 dark:text-slate-400 text-sm leading-6">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionHowItWork
