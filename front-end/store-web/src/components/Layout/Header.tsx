import { Badge, Button, Card, IconButton, MobileNav, Navbar, Popover, PopoverContent, PopoverHandler, Typography } from '@material-tailwind/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoIosArrowUp } from 'react-icons/io'
import PopoverCart from './SidebarCart'

export default function Header() {
  const [isVisible, setIsVisible] = useState(false)
  const [openNav, setOpenNav] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', toggleVisibility)
    window.addEventListener('resize', () => window.innerWidth >= 960 && setOpenNav(false))
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const navItems = [
    { text: 'Áo', url: '/danh-muc/ao' },
    { text: 'Quần', url: '/danh-muc/quan' },
    { text: 'Đầm & Váy', url: '/danh-muc/dam-vay' },
    { text: 'Phụ kiện', url: '/danh-muc/phu-kien' },
  ]

  const navList = (
    <ul className="mt-4 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {navItems.map((item, index) => (
        <Typography key={index} as="li" variant="small" color="blue-gray" className="p-1 font-normal hover:text-black hover:underline text-base">
          <Link href={item.url}>{item.text}</Link>
        </Typography>
      ))}
    </ul>
  )

  return (
    <>
      <Navbar className="sticky top-0 z-50 h-max max-w-full rounded-none border-none px-4 py-3 lg:px-8 lg:py-3">
        <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
          <Link href="/">
            <div className="w-[150px] flex items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl">
              <svg className="fill-current text-gray-800 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M5,22h14c1.103,0,2-0.897,2-2V9c0-0.553-0.447-1-1-1h-3V7c0-2.757-2.243-5-5-5S7,4.243,7,7v1H4C3.447,8,3,8.447,3,9v11 C3,21.103,3.897,22,5,22z M9,7c0-1.654,1.346-3,3-3s3,1.346,3,3v1H9V7z M5,10h2v2h2v-2h6v2h2v-2h2l0.002,10H5V10z" />
              </svg>
              Cúc Hoạ Mi
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
          </div>
          <div className="w-[150px] flex justify-end items-center gap-x-1">
            <div className="inline-block no-underline hover:text-black">
              <Link href="/my-account">
                <svg className="fill-current hover:text-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle fill="none" cx="12" cy="7" r="3" />
                  <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5S14.757 2 12 2zM12 10c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3S13.654 10 12 10zM21 21v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h2v-1c0-2.757 2.243-5 5-5h4c2.757 0 5 2.243 5 5v1H21z" />
                </svg>
              </Link>
            </div>
            <PopoverCart className="pl-3 inline-block no-underline hover:text-black" />
            <div className="pl-3 inline-block no-underline hover:text-black">
              <IconButton
                variant="text"
                className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                ripple={false}
                onClick={() => setOpenNav(!openNav)}
              >
                {openNav ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </IconButton>
            </div>
          </div>
        </div>
        <MobileNav open={openNav}>{navList}</MobileNav>
      </Navbar>
      <button
        className={`${
          isVisible ? 'opacity-100' : 'opacity-0'
        } fixed right-10 bottom-10 md:right-20 md-bottom-20 lg:right-32 md-bottom-20 transition-opacity duration-300 ease-in-out border bg-white hover:text-gray-700 hover:border-gray-700 rounded-lg font-bold p-2`}
        onClick={handleScrollToTop}
        id="btn-back-to-top"
      >
        <IoIosArrowUp size={26} />
      </button>
    </>
  )
}
