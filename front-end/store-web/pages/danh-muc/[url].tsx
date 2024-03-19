import React from 'react'
import SEO from '@/components/Layout/SEO'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function ProductCategoryPage() {
  const router = useRouter()
  const url = router.asPath.slice(7)
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
    </>
  )
}
