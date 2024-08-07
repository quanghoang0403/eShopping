import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import React from 'react'
import I404Png from '@/assets/images/404.png'
import NcImage from '@/shared/NcImage'
import Link from 'next/link'

const Custom404 = () => (
  <div className="nc-Page404">
    <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
      {/* HEADER */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        <NcImage src={I404Png} alt="not-found" />
        <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
          {`TRANG BẠN TÌM KIẾM KHÔNG TỒN TẠI `}
        </span>
        <div className="pt-8">
          <ButtonPrimary>
            <Link href='/'>Trở về trang chủ</Link>
          </ButtonPrimary>
        </div>
      </header>
    </div>
  </div>
)

export default Custom404
