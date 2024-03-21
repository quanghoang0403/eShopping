import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cx } from '@/utils/common.helper'
import BlogCategoryLabel from './BlogCategoryLabel'
import DateTime from './DateTime'
import { MdInsertPhoto } from 'react-icons/md'

interface IProps {
  blog: IBlog
  aspect: 'landscape' | 'square' | 'custom'
  preloadImage?: boolean
  fontSize?: string
  fontWeight?: string
  minimal?: boolean
}

export default function BlogItem(props: IProps) {
  const { blog, aspect, preloadImage, fontSize, fontWeight, minimal } = props
  return (
    <div className={cx('group cursor-pointer', minimal && 'grid gap-10 md:grid-cols-2')}>
      <div className={cx('overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-105')}>
        <Link
          className={cx('relative block', aspect === 'landscape' ? 'aspect-video' : aspect === 'custom' ? 'aspect-[5/4]' : 'aspect-square')}
          href={`/bai-viet/${blog.url}`}
        >
          {blog.thumbnail ? (
            <Image
              src={blog.thumbnail}
              alt={blog.name}
              priority={preloadImage ? true : false}
              className="object-cover transition-all"
              fill
              sizes="(max-width: 768px) 30vw, 33vw"
            />
          ) : (
            <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-gray-200">
              <MdInsertPhoto />
            </span>
          )}
        </Link>
      </div>

      <div className="flex items-center">
        <Link href={`/bai-viet/${blog.url}`}>
          <div className="mt-2 flex justify-between items-center">
            <BlogCategoryLabel categories={blog.categories} />
            {/* <DateTime date={blog?.publishedTime} className="truncate text-sm text-gray-500" /> */}
          </div>
          <h2
            className={cx(
              fontSize === 'large' ? 'text-2xl' : 'text-lg',
              fontWeight === 'normal' ? 'line-clamp-2 font-medium  tracking-normal' : 'font-semibold leading-snug tracking-tight',
              'mt-1 text-black'
            )}
          >
            <span
              className="bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom
                  bg-no-repeat
                  transition-[background-size]
                  duration-500
                  hover:bg-[length:100%_3px]
                  group-hover:bg-[length:100%_10px]"
            >
              {blog.name}
            </span>
          </h2>
          <p className="mt-2 line-clamp-3 text-sm text-gray-500 line-camp-2">{blog.description}</p>
          {/* <Link href={`/author/${blog?.author?.slug?.current}`}>
              <div className="flex items-center gap-3">
                <div className="relative h-5 w-5 flex-shrink-0">
                  {blog?.author?.image && <Image src={AuthorimageProps.src} alt={blog?.author?.name} className="rounded-full object-cover" fill sizes="20px" />}
                </div>
                <span className="truncate text-sm">{blog?.author?.name}</span>
              </div>
              <span className="text-xs text-gray-300">&bull;</span>
            </Link> */}
        </Link>
      </div>
    </div>
  )
}
