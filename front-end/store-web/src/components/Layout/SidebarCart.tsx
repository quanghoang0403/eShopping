import React from 'react'
import { Badge, Drawer, Button } from '@material-tailwind/react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import CartList from '../CartList'

interface IProps {
  className?: string
}

export default function SidebarCart(props: IProps) {
  const { className } = props
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const openDrawer = () => {
    if (window.innerWidth <= 640) {
      router.push('/gio-hang')
    } else {
      setIsDrawerOpen(true)
    }
  }
  const closeDrawer = () => setIsDrawerOpen(false)
  const cartItems: ICartItem[] = [
    { name: 'Basic Tee Long Sleeves', priceName: 'Blue', thumbnail: '/imgs/productPromo/1.jpg', priceValue: 180000, quantity: 3 },
    { name: 'Basic Tee Long Sleeves', priceName: 'Black', thumbnail: '/imgs/productPromo/2.jpg', priceValue: 200000, quantity: 2 },
    {
      name: 'Basic Tee With Long Sleeves Red',
      thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg',
      priceValue: 120000,
      quantity: 1,
    },
    {
      name: 'Classic Short Sleeves Shirt',
      thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg',
      priceValue: 120000,
      quantity: 1,
    },
    { name: 'Paris Long Tee', thumbnail: '/imgs/productHighlight/Paris Long Tee.jpg', priceValue: 120000, quantity: 1 },
  ]
  return (
    <>
      <div className="flex items-center cursor-pointer" onClick={openDrawer}>
        <Badge content="5" className="border-2 border-white">
          <div className={className}>
            <svg className="fill-current hover:text-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M21,7H7.462L5.91,3.586C5.748,3.229,5.392,3,5,3H2v2h2.356L9.09,15.414C9.252,15.771,9.608,16,10,16h8 c0.4,0,0.762-0.238,0.919-0.606l3-7c0.133-0.309,0.101-0.663-0.084-0.944C21.649,7.169,21.336,7,21,7z M17.341,14h-6.697L8.371,9 h11.112L17.341,14z" />
              <circle cx="10.5" cy="18.5" r="1.5" />
              <circle cx="17.5" cy="18.5" r="1.5" />
            </svg>
          </div>
        </Badge>
      </div>
      <Drawer
        size={500}
        open={isDrawerOpen}
        onClose={closeDrawer}
        className="!max-h-screen !bg-gray-100 overflow-y-scroll"
        placement="right"
        overlayProps={{ className: '!h-screen' }}
      >
        <div className="sticky top-0 bg-gray-100 z-10 w-full shadow-lg flex items-center justify-between mb-2 px-4 py-2">
          <Button variant="text" className="flex items-center gap-2 text-sm" onClick={closeDrawer}>
            Đóng{' '}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Button>
          <Link href="/gio-hang">
            <Button variant="gradient" color="blue" className="rounded-full flex items-center gap-2 font-semibold text-sm py-2 px-4" onClick={closeDrawer}>
              Đến trang thanh toán
              <svg className="fill-current hover:text-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M21,7H7.462L5.91,3.586C5.748,3.229,5.392,3,5,3H2v2h2.356L9.09,15.414C9.252,15.771,9.608,16,10,16h8 c0.4,0,0.762-0.238,0.919-0.606l3-7c0.133-0.309,0.101-0.663-0.084-0.944C21.649,7.169,21.336,7,21,7z M17.341,14h-6.697L8.371,9 h11.112L17.341,14z" />
                <circle cx="10.5" cy="18.5" r="1.5" />
                <circle cx="17.5" cy="18.5" r="1.5" />
              </svg>
            </Button>
          </Link>
        </div>
        <div className="px-4">
          <CartList isSmall cartItems={cartItems} />
          <CartList isSmall cartItems={cartItems} />
        </div>
      </Drawer>
    </>
  )
}
