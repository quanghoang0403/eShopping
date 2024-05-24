import React, { ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

const Breakcumb = () => {
  return (
    <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
      <Link href={'/'} className="">
        Homepage
      </Link>
      <span className="text-xs mx-1 sm:mx-1.5">/</span>
      <Link href={'/collection'} className="">
        Clothing Categories
      </Link>
      <span className="text-xs mx-1 sm:mx-1.5">/</span>
      <span className="underline">Checkout</span>
    </div>
  )
}

export default Breakcumb
