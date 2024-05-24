import React, { FC } from 'react'
import facebook from '@/images/socials/facebook.svg'
import twitter from '@/images/socials/twitter.svg'
import telegram from '@/images/socials/telegram.svg'
import youtube from '@/images/socials/youtube.svg'
import Image from 'next/image'
import { SocialType } from '../SocialsShare'

export interface SocialsListProps {
  className?: string
  itemClass?: string
  vertical?: boolean
}

const socials: SocialType[] = [
  { name: 'Facebook', icon: facebook, href: '#' },
  { name: 'Youtube', icon: youtube, href: '#' },
  { name: 'Telegram', icon: telegram, href: '#' },
  { name: 'Twitter', icon: twitter, href: '#' },
]

const SocialsList: FC<SocialsListProps> = ({ className = '', itemClass = 'block w-6 h-6', vertical = false }) => {
  const renderHorizontal = () => {
    return (
      <nav className={`nc-SocialsList flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}>
        {socials.map((item, i) => (
          <a key={i} className={`${itemClass}`} href={item.href} target="_blank" rel="noopener noreferrer" title={item.name}>
            <Image sizes="40px" src={item.icon} alt="" />
          </a>
        ))}
      </nav>
    )
  }

  const renderVertical = () => {
    const renderItem = (item: SocialType, index: number) => {
      return (
        <a
          href={item.href}
          className="flex items-center text-2xl text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group"
          key={index}
        >
          <div className="flex-shrink-0 w-5 ">
            <Image sizes="40px" src={item.icon} alt="" />
          </div>
          <span className="hidden lg:block text-sm">{item.name}</span>
        </a>
      )
    }

    return (
      <div className={`nc-SocialsListVertical ${className}`} data-nc-id="SocialsListVertical">
        {socials.map(renderItem)}
      </div>
    )
  }
  return <>{vertical ? renderVertical() : renderHorizontal()}</>
}

export default SocialsList
