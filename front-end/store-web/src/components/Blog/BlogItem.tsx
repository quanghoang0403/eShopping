import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cx } from '@/utils/all'
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
      <div className={cx(' overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-105   dark:bg-gray-800')}>
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
        <div>
          <BlogCategoryLabel categories={blog.categories} />
          <h2
            className={cx(
              fontSize === 'large' ? 'text-2xl' : 'text-lg',
              fontWeight === 'normal' ? 'line-clamp-2 font-medium  tracking-normal text-black' : 'font-semibold leading-snug tracking-tight',
              'mt-2    dark:text-white'
            )}
          >
            <Link href={`/bai-viet/${blog.url}`}>
              <span
                className="bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom
                  bg-no-repeat
                  transition-[background-size]
                  duration-500
                  hover:bg-[length:100%_3px]
                  group-hover:bg-[length:100%_10px]
                  dark:from-purple-800 dark:to-purple-900"
              >
                {blog.name}
              </span>
            </Link>
          </h2>

          <div className="hidden">
            {blog.description && (
              <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                <Link href={`/bai-viet/${blog.url}`}>{blog.description}</Link>
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center space-x-3 text-gray-500 dark:text-gray-400">
            {/* <Link href={`/author/${blog?.author?.slug?.current}`}>
              <div className="flex items-center gap-3">
                <div className="relative h-5 w-5 flex-shrink-0">
                  {blog?.author?.image && <Image src={AuthorimageProps.src} alt={blog?.author?.name} className="rounded-full object-cover" fill sizes="20px" />}
                </div>
                <span className="truncate text-sm">{blog?.author?.name}</span>
              </div>
            </Link> */}
            <span className="text-xs text-gray-300 dark:text-gray-600">&bull;</span>
            <DateTime date={blog?.publishedTime} className="truncate text-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
