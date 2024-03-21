import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import BlogItem from '@/components/Blog/BlogItem'
import Link from 'next/link'
import BlogCategoryLabel from '@/components/Blog/BlogCategoryLabel'
import Title from '@/components/Title'

const categories: IBlogCategory[] = [
  { id: '1', name: 'Thời trang nam', url: 'https://example.com/thoi-trang-nam', color: 'blue' },
  { id: '2', name: 'Thời trang nữ', url: 'https://example.com/thoi-trang-nu', color: 'pink' },
  { id: '3', name: 'Phụ kiện thời trang', url: 'https://example.com/phu-kien-thoi-trang', color: 'orange' },
]

const generateRandomBlog = (): IBlog => {
  const id = Math.random().toString(36).substring(7) // Generate a random ID
  const name = 'Bài viết thời trang'
  const content = 'Nội dung bài viết thời trang. Bạn có thể viết mô tả chi tiết về xu hướng thời trang, cách phối đồ, hay những mẹo chọn trang phục phù hợp.'
  const url = '1'
  const thumbnail = '/imgs/productPromo/1.jpg'
  const category = categories[Math.floor(Math.random() * categories.length)]
  const publishedTime = new Date().toISOString()
  const description = 'Mô tả ngắn gọn về bài viết thời trang.'
  return {
    id,
    name,
    content,
    url,
    thumbnail,
    categories: [category],
    publishedTime,
    description,
  }
}
export default function BlogPage() {
  const blogs: IBlog[] = Array.from({ length: 11 }, generateRandomBlog)
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
      <Title title="Danh mục bài viết" />
      <div className="md:pt-2 flex justify-center">
        <BlogCategoryLabel className="!text-lg space-x-2 p-2 rounded-md" categories={categories} showBg />
      </div>
      {blogs && (
        <div className="container py-4 md:py-8 px-8 mx-auto xl:px-5">
          <div className="grid gap-10 md:grid-cols-3 lg:gap-10 ">
            {blogs.slice(0, 3).map((blog) => (
              <BlogItem key={blog.id} blog={blog} aspect="landscape" preloadImage />
            ))}
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-3 lg:gap-10 xl:grid-cols-4 ">
            {blogs.slice(3, 14).map((blog) => (
              <BlogItem key={blog.id} blog={blog} aspect="square" />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/archive"
              className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40"
            >
              <span>Xem tất cả bài viết</span>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
