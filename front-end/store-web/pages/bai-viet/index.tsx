import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import BlogList from '@/components/Blog/BlogList'
import Link from 'next/link'
import BlogCategoryLabel from '@/components/Blog/BlogCategoryLabel'
import Title from '@/components/Title'

const categories: IBlogCategory[] = [
  { id: '1', name: 'Thời trang công sở', url: 'cong-so', color: 'blue' },
  { id: '2', name: 'Thời trang hàng ngày', url: 'hang-ngay', color: 'pink' },
  { id: '3', name: 'Thời trang sự kiện', url: 'su-kien', color: 'orange' },
]

const blogs: IBlog[] = [
  {
    id: '1',
    name: 'TOP ĐẦM HOA CỰC XINH CHO CHỊ EM TỰ TIN DẠO PHỐ',
    url: '1',
    content: 'blue',
    thumbnail: '/imgs/blog/1.webp',
    description: 'Dưới ánh nắng cuối xuân-đầu hè, không thể phủ nhận sức hút nữ tính, nhẹ nhàng đến từ những chiếc đầm hoa của Lamer.',
    categories: [categories[1]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'BST HOA THÁNG BA | TÔN VINH VẺ ĐẸP PHỤ NỮ',
    url: '2',
    content: 'blue',
    thumbnail: '/imgs/blog/2.webp',
    description: 'Mỗi người phụ nữ đều là một bông hoa độc nhất. Vẻ đẹp của bông hoa ấy không đơn thuần nằm ở “hương sắc”. ',
    categories: [categories[1], categories[2]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'BST ĐIỂU CA: LƯU GIỮ KHUNG CẢNH XUÂN TRONG TÀ ÁO DÀI',
    url: '3',
    content: 'blue',
    thumbnail: '/imgs/blog/3.webp',
    description: 'Một khung cảnh mùa xuân mở ra với những bông hoa đua nở, chim hót ríu rít được LAMER gói ghém trong 6 mẫu áo dài',
    categories: [categories[2]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'KHÁNH VY CÙNG CHỊ GÁI TRONG BST HER DAILY JOURNEY',
    url: '4',
    content: 'blue',
    thumbnail: '/imgs/blog/4.webp',
    description: 'Tuy có gu trang phục khác nhau do khoảng cách thế hệ, nhưng 3 chị em Khánh Vy vẫn rạng rỡ và tự tin làm chủ',
    categories: [categories[0]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'HER DAILY JOURNEY - HÀNH TRÌNH MỖI NGÀY CỦA NGƯỜI PHỤ NỮ',
    url: '5',
    content: 'blue',
    thumbnail: '/imgs/blog/5.webp',
    description: 'Vừa hết mình cho sự nghiệp và vừa đảm đang việc nhà, trải qua nhiều thập kỷ, dường như người phụ nữ hiện đại',
    categories: [categories[1]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'GỢI Ý NHỮNG SET ĐỒ HOT HIT NHẤT MÙA THU',
    url: '6',
    content: 'blue',
    thumbnail: '/imgs/blog/6.webp',
    description: 'Mùa thu là thời điểm giao mùa, thời tiết mát mẻ, dễ chịu, thích hợp cho các hoạt động ngoài trời. ',
    categories: [categories[0], categories[2]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'TOP 3 GAM MÀU GIÚP CHỊ EM “ BIẾN HOÁ” ĐA DẠNG TRONG MÙA THU',
    url: '7',
    content: 'blue',
    thumbnail: '/imgs/blog/7.webp',
    description: 'Mùa thu được mệnh danh là mùa tình nhất năm với những chiếc lá vàng rơi, cơn gió se lạnh, và những gam màu rực rỡ',
    categories: [categories[1]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Biến hoá đa dạng với các mẫu chân váy dành cho nàng công sở',
    url: '8',
    content: 'blue',
    thumbnail: '/imgs/blog/8.webp',
    description: 'Thời trang công sở là một trong những chủ đề hàng đầu được các chị em văn phòng quan tâm.',
    categories: [categories[2]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'TOP ĐẦM HOA CỰC XINH CHO CHỊ EM TỰ TIN DẠO PHỐ',
    url: '9',
    content: 'blue',
    thumbnail: '/imgs/blog/1.webp',
    description: 'Dưới ánh nắng cuối xuân-đầu hè, không thể phủ nhận sức hút nữ tính, nhẹ nhàng đến từ những chiếc đầm hoa của Lamer.',
    categories: [categories[1]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'BST HOA THÁNG BA | TÔN VINH VẺ ĐẸP PHỤ NỮ',
    url: '10',
    content: 'blue',
    thumbnail: '/imgs/blog/2.webp',
    description: 'Mỗi người phụ nữ đều là một bông hoa độc nhất. Vẻ đẹp của bông hoa ấy không đơn thuần nằm ở “hương sắc”. ',
    categories: [categories[0]],
    publishedTime: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'BST ĐIỂU CA: LƯU GIỮ KHUNG CẢNH XUÂN TRONG TÀ ÁO DÀI',
    url: '11',
    content: 'blue',
    thumbnail: '/imgs/blog/3.webp',
    description: 'Một khung cảnh mùa xuân mở ra với những bông hoa đua nở, chim hót ríu rít được LAMER gói ghém trong 6 mẫu áo dài',
    categories: [categories[1], categories[2], categories[0]],
    publishedTime: new Date().toISOString(),
  },
]

export default function BlogPage() {
  return (
    <>
      <SEO title="Bài viết thời trang" description="Describe the home page" />
      <Title title="Danh mục bài viết" />
      <div className="flex justify-center px-4">
        <BlogCategoryLabel className="!md:text-lg !text-sm space-x-2 p-2 rounded-md" categories={categories} showBg />
      </div>
      {blogs && (
        <div className="container p-4 md:p-8 mx-auto ">
          <BlogList className="!mt-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3" blogs={blogs.slice(0, 3)} aspect="landscape" preloadImage />
          <BlogList blogs={blogs.slice(3, 14)} aspect="square" />
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
