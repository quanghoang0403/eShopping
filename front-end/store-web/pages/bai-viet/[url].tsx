import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import { useRouter } from 'next/router'
import BlogCategoryLabel from '@/components/Blog/BlogCategoryLabel'
import Link from 'next/link'
import DateTime from '@/components/Blog/DateTime'
import Image from 'next/image'

interface IProps {
  blog: IBlog
}

export default function BlogDetailPage(props: IProps) {
  const { blog } = props
  const router = useRouter()
  const url = router.asPath.slice(7)
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
      <div>
        <div className="container px-8 mx-auto xl:px-5 pt-0">
          <div className="mx-auto max-w-screen-md ">
            <div className="flex justify-center">
              <BlogCategoryLabel categories={blog.categories} />
            </div>

            <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight lg:text-4xl lg:leading-snug">{blog.name}</h1>

            <div className="mt-3 flex justify-center space-x-3 text-gray-500 ">
              <div className="flex items-center gap-3">
                {/* <div className="relative h-10 w-10 flex-shrink-0">
                  <Link href={`/author/${blog.author.slug.current}`}>
                    <Image src={AuthorimageProps.src} alt={blog?.author?.name} className="rounded-full object-cover" fill sizes="40px" />
                  </Link>
                </div> */}
                <div>
                  {/* <p className="text-gray-800">
                    <Link href={`/author/${blog.author.slug.current}`}>{blog.author.name}</Link>
                  </p> */}
                  <div className="flex items-center space-x-2 text-sm">
                    <DateTime date={blog?.publishedTime} className="mr-4 text-gray-500" />
                    {/* <span>· {blog.estReadingTime || '5'} min read</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
          {blog.thumbnail && <Image src={blog.thumbnail} alt={blog.name} loading="eager" fill sizes="100vw" className="object-cover" />}
        </div>

        <div className="container px-8 mx-auto xl:px-5">
          <article className="mx-auto max-w-screen-md ">
            <div className="prose mx-auto my-3 prose-a:text-blue-600">
              <div dangerouslySetInnerHTML={{ __html: `${blog.content}` }}></div>
            </div>
            <div className="mb-7 mt-7 flex justify-center">
              <Link href="/" className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600">
                ← View all blogs
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
