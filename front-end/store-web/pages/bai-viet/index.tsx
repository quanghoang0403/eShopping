import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import BlogItem from '@/components/Blog/BlogItem'
import Link from 'next/link'
import BlogContainer from '@/components/Blog/BlogContainer'

const categories: IBlogCategory[] = [
  { id: '1', name: 'Thời trang nam', url: 'https://example.com/thoi-trang-nam', color: 'blue' },
  { id: '2', name: 'Thời trang nữ', url: 'https://example.com/thoi-trang-nu', color: 'pink' },
  { id: '3', name: 'Phụ kiện thời trang', url: 'https://example.com/phu-kien-thoi-trang', color: 'orange' },
  { id: '4', name: 'Xu hướng thời trang', url: 'https://example.com/xu-huong-thoi-trang', color: 'green' },
]

const generateRandomBlog = (): IBlog => {
  const id = Math.random().toString(36).substring(7) // Generate a random ID
  const name = `Bài viết thời trang ${id}`
  const content = 'Nội dung bài viết thời trang. Bạn có thể viết mô tả chi tiết về xu hướng thời trang, cách phối đồ, hay những mẹo chọn trang phục phù hợp.'
  const url = `https://example.com/blog/${id}`
  const thumbnail = `/imgs/productPromo/1.jpg`
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
  const blogs: IBlog[] = Array.from({ length: 6 }, generateRandomBlog)
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
              <span>Xem tất cả bài viết</span>
            </Link>
          </div>
        </BlogContainer>
      )}
    </>
  )
}
