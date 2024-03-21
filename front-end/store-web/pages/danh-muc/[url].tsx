import React, { useEffect, useState } from 'react'
import SEO from '@/components/Layout/SEO'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Button, IconButton } from '@material-tailwind/react'
import { FaArrowRightLong, FaArrowLeftLong } from 'react-icons/fa6'
import ProductList from '@/components/Product/ProductList'

const products: IProduct[] = [
  { name: 'Basic Tee With Long Sleeves Red', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg', price: 120000 },
  { name: 'Classic Short Sleeves Shirt', thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg', price: 120000 },
  { name: 'Paris Long Tee', thumbnail: '/imgs/productHighlight/Paris Long Tee.jpg', price: 120000 },
  { name: 'Paris Shirt', thumbnail: '/imgs/productHighlight/Paris Shirt.jpg', price: 120000 },
  { name: 'Paris Tee', thumbnail: '/imgs/productHighlight/Paris Tee.jpg', price: 120000 },
  { name: 'Striped Shirt', thumbnail: '/imgs/productHighlight/Striped Shirt.jpg', price: 120000 },
  { name: 'Winter-Striped Tee Dress Black', thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-black.jpg', price: 120000 },
  { name: 'Winter-Striped Tee Dress White', thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-white.jpg', price: 120000 },
]

export default function ProductCategoryPage() {
  const router = useRouter()
  const url = router.asPath.slice(7)
  const [activeIndex, setActiveIndex] = useState(1)
  const [activeSort, setActiveSort] = useState()
  useEffect(() => {}, [activeIndex, activeSort])

  const getItemProps = (index: number) =>
    ({
      variant: activeIndex === index ? 'filled' : 'text',
      color: 'gray',
      onClick: () => setActiveIndex(index),
    }) as any

  const next = () => {
    if (activeIndex === 5) return
    setActiveIndex(activeIndex + 1)
  }

  const prev = () => {
    if (activeIndex === 1) return
    setActiveIndex(activeIndex - 1)
  }
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
      <ProductList title="Áo" products={products} showFilter onSortChange={setActiveSort} />
      <div className="flex items-center justify-center gap-4 pb-4 md:pb-16">
        <Button variant="text" className="flex items-center gap-2" onClick={prev} disabled={activeIndex === 1}>
          <FaArrowLeftLong strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-2">
          <IconButton {...getItemProps(1)}>1</IconButton>
          <IconButton {...getItemProps(2)}>2</IconButton>
          <IconButton {...getItemProps(3)}>3</IconButton>
          <IconButton {...getItemProps(4)}>4</IconButton>
          <IconButton {...getItemProps(5)}>5</IconButton>
        </div>
        <Button variant="text" className="flex items-center gap-2" onClick={next} disabled={activeIndex === 5}>
          Next
          <FaArrowRightLong strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
