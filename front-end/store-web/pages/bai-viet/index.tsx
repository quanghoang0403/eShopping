import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import BlogItem from '@/components/Blog/BlogItem'
import Link from 'next/link'
import BlogContainer from '@/components/Blog/BlogContainer'

export default function BlogPage() {
  const blogs: IBlog[] = []
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
      {blogs && (
        <BlogContainer>
          <div className="grid gap-10 md:grid-cols-2 lg:gap-10 ">
            {blogs.slice(0, 2).map((blog) => (
              <BlogItem key={blog.id} blog={blog} aspect="landscape" preloadImage />
            ))}
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
            {blogs.slice(2, 14).map((blog) => (
              <BlogItem key={blog.id} blog={blog} aspect="square" />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/archive"
              className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300"
            >
              <span>View all Posts</span>
            </Link>
          </div>
        </BlogContainer>
      )}
    </>
  )
}
