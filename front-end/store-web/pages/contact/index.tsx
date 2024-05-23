import React, { FC } from 'react'
import SocialsListHorizontal from '@/shared/SocialsList'
import Label from '@/shared/Controller/Label'
import Input from '@/shared/Controller/Input'
import Textarea from '@/shared/Controller/Textarea'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import BackgroundSection from '@/shared/Background/BackgroundSection'
import PromoBanner1 from '@/components/Common/Banner/PromoBanner1'

const info = [
  {
    title: '🗺 ADDRESS',
    desc: 'Photo booth tattooed prism, portland taiyaki hoodie neutra typewriter',
  },
  {
    title: '💌 EMAIL',
    desc: 'nc.example@example.com',
  },
  {
    title: '☎ PHONE',
    desc: '000-123-456-7890',
  },
]

const ContactPage = ({}) => {
  return (
    <div className={`nc-ContactPage overflow-hidden`}>
      <div className="">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Contact
        </h2>
        <div className="container max-w-7xl mx-auto">
          <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-12 ">
            <div className="max-w-sm space-y-8">
              {info.map((item, index) => (
                <div key={index}>
                  <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">{item.title}</h3>
                  <span className="block mt-2 text-neutral-500 dark:text-neutral-400">{item.desc}</span>
                </div>
              ))}
              <div>
                <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">🌏 SOCIALS</h3>
                <SocialsListHorizontal className="mt-2" />
              </div>
            </div>
            <div>
              <form className="grid grid-cols-1 gap-6" action="#" method="post">
                <label className="block">
                  <Label>Họ tên của bạn</Label>
                  <Input placeholder="Example Doe" className="mt-1" />
                </label>
                <label className="block">
                  <Label>Email</Label>
                  <Input placeholder="example@example.com" className="mt-1" />
                </label>
                <label className="block">
                  <Label>Lời nhắn</Label>
                  <Textarea className="mt-1" rows={6} />
                </label>
                <div>
                  <ButtonPrimary type="submit">Gửi lời nhắn</ButtonPrimary>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* OTHER SECTIONS */}
      <div className="container">
        <div className="relative my-24 lg:my-32 py-24 lg:py-32">
          <BackgroundSection />
          <PromoBanner1 />
        </div>
      </div>
    </div>
  )
}

export default ContactPage
