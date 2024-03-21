import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import { useRouter } from 'next/router'
import BlogCategoryLabel from '@/components/Blog/BlogCategoryLabel'
import Link from 'next/link'
import DateTime from '@/components/Blog/DateTime'
import Image from 'next/image'
import BlogList from '@/components/Blog/BlogList'

const categories: IBlogCategory[] = [
  { id: '1', name: 'Thời trang công sở', url: 'cong-so', color: 'blue' },
  { id: '2', name: 'Thời trang hàng ngày', url: 'hang-ngay', color: 'pink' },
  { id: '3', name: 'Thời trang sự kiện', url: 'su-kien', color: 'orange' },
]

const blog: IBlog = {
  id: '1',
  name: 'TOP ĐẦM HOA CỰC XINH CHO CHỊ EM TỰ TIN DẠO PHỐ',
  url: '1',
  content: `<div class="article-content js-toc-content">
  <div class="rte" id="ega-uti-editable-content" data-platform="haravan" data-id="1002274290" data-blog-id="1000802342">
                      
<p style="text-align: justify;">Dưới ánh nắng cuối xuân-đầu hè, không thể phủ nhận sức hút nữ tính, nhẹ nhàng đến từ những chiếc đầm hoa của Lamer. Những gam màu tươi tắn cùng chất liệu lụa Hàn cát hay vải lanh mềm mại - sự kết hợp tạo nên outfit hoàn hảo cho những ngày giao mùa đẹp nhất. Dù là tại chốn công sở hay trong những buổi cafe hẹn hò, những chiếc đầm hoa yêu kiều này cũng sẽ giúp chị em tự tin và rạng rỡ hơn bao giờ hết.</p><h2 style="text-align: justify;" id="m-hoa-c-tr-n"><strong>Đầm hoa cổ tròn</strong></h2><p style="text-align: justify;">Một trong những kiểu đầm dễ mặc nhất với hầu hết các chị em, đó là chiếc đầm cổ tròn tay lỡ. Thiết kế nằm trong BST xuân-hè 2024 của Lamer. Nhờ sử dụng chất liệu vải chiffon Hàn kết hợp lót lụa, chiếc váy có độ mềm mại, thoáng khí, tạo ra nét dịu dàng cho cô nàng. Thiết kế chiết eo nhẹ, tùng váy xếp ly súp giúp che gọn vòng 2, tôn vóc dáng xinh xắn cho chị em mỗi khi sải bước xuống phố.</p><p style="text-align: center;"><strong><img width="259.4404761904762" height="388" src="https://lh7-us.googleusercontent.com/69uRa3_uZb7XDq24bVR-JSDO1C_LcF3fyPGw3iiC18Scg1v1i6SqX0tOfsl5V58F57imxAcageQWP3x5epZiUs7m49s8I6suTOEpg_PEwV-xM9vvH6TsGKOH-13eMUQZ3c21avmTG6J4-4QNpALoXmI">&nbsp; &nbsp;<img width="267" height="399.75000000000006" style="width: 259.438px; height: 388px;" src="https://lh7-us.googleusercontent.com/nwskVxW0ROgiuIdf_3aSrQ8GG78eNaKh1TajdaTY_kP2qxpvuEJxcQ8Du3GmeONxsZVmCelGYFXK8HmsgB3NalXOnxJlF8f4b8SDkdaikSOHY6ZAVxjv_awykL60k-EJI4caLE21pbruSy6KVEbUYb4"></strong></p><h2 style="text-align: justify;" id="m-hoa-c-vu-ng"><strong>Đầm hoa cổ vuông</strong></h2><p style="text-align: justify;">Thiết kế cổ vuông được chị em ưu ái vì khả năng khéo khoe xương quai xanh mảnh mai, giúp "hack" dáng khá hiệu quả, mang lại vẻ thanh thoát, yêu kiều hơn cho vóc dáng. Sắc hoa tươi tắn trên từng chiếc váy mang lại vẻ đẹp rạng ngời cho bất cứ ai khi diện lên.&nbsp;</p><p style="text-align: center;"><strong><img width="259.4404761904762" height="388" src="https://lh7-us.googleusercontent.com/G6KDLOoYIiJr-IhSPkD_lBiNRWLMSM1_G4y1vf7DvYRAlkUSU2_G1UYX6nq6P-i4bARsThRHkgKTZPKEouKb5Xz893O7IPYaZQv-KLmcEHWM4WCBSnQH9JYhqQfokB1oaOudJA7lpocFQwUqWhlYhXs">&nbsp; &nbsp;<img width="267" height="399.75000000000006" style="width: 259px; height: 388px;" src="https://lh7-us.googleusercontent.com/oc42j9-cDQH3C77o3lath4VDds3HxTpHnCqXUiS-oLr5a6PT4WFeSInj6U--MVNrGYCM5xvAAUcjgFB70_NCx3_34bpU2FwEzL7RJjSZX6IJfMOLcmiwgPs7s7CPRYMDCkNjYkYVIZp6CxBqdClmXH8"></strong></p><p style="text-align: justify;">Một tip nhỏ để chị em diện mẫu váy này đẹp nhất, khoe trọn chi tiết cổ vuông đắt giá, đó là hất gọn mái tóc xõa của mình về phía sau lưng, hoặc buộc tóc, búi tóc gọn gàng.</p><p style="text-align: center;"><strong><img width="259" height="388.00000000000017" src="https://lh7-us.googleusercontent.com/gTq2_X4gF131Dgzpi9I25FMcgHynFabDE34qWokavhC5tAC5QMq59DqFwUtcrXrVdE01QuDzWB-Vf7BI4vzvKXm5jTAObHzXFb_u2G8omX2vMSwDjIP9OPYRvBfe16CnpoRbQ5qHxnPJb508j3oHAC0">&nbsp; &nbsp;<img width="267" height="399.75000000000006" style="width: 259px; height: 388px;" src="https://lh7-us.googleusercontent.com/h7ZP1KOWVYG7sP_1JmwAzuTTAyLRZQXm351vL7-2UJT4ff5XRfhOoX9gd7spGmtuYQP9Xu7-dc0lRdVdNqRK67qlbQVC01jWzntyNB1THjsAKAzLFd4A1SYvUYj3CUXLqgFCiy2tw3SLoTMkeLdH6EA"></strong></p><p style="text-align: center;"><strong><img width="259.4404761904762" height="388" src="https://lh7-us.googleusercontent.com/FYhO-1ljXZsv7XFOymJKKcbu9vHvvXycqm7mA84E8FbZ4uuyG_VQ3Kf2awolpSCxfDd1wOMc08fp2fyeb4V-hAGFb41r66kmCKB0w8lRmuAdQ3Cv1FEJVAz_QuYEfOxAgo6FWM5iIYShqA19LbDUa0c">&nbsp; &nbsp;<img width="267" height="399.75000000000006" style="width: 259px; height: 388px;" src="https://lh7-us.googleusercontent.com/AFYLW7W98XNbv7S3M2qOCUw30hXHzxnByxVAqET8nms3jlEpBh3UEHpj9W4cTqaMvtRrPmbq33VKhxctywV0yxzFKqLeS7CWpjsE87OgEPxmxtQxHcAZuqv1qyIgCk-RTTpMKq8YJjHAtw7lCUExJao"></strong></p><h2 style="text-align: justify;" id="m-hoa-c-v"><strong>Đầm hoa cổ V</strong></h2><p style="text-align: justify;">Là điển hình cho phong cách thời trang Pháp, đầm hoa cổ V là bậc thầy phù phép cho vóc dáng cho mọi chị em thêm gọn gàng, thanh thoát. Nghĩa là dù sở hữu thân hình hơi đậm đà một chút, chỉ cần diện lên chiếc đầm hoa cổ V, thân hình cũng chị em cũng được giấu gọn hiệu quả.</p><p style="text-align: center;"><strong><img width="259" height="388.00000000000017" src="https://lh7-us.googleusercontent.com/h7hjOvfE_Inu-pg-0_X6AUGMMBKIiwIJ86tRXhfrGsca9mTq30Nw-4kNZt4W5ugtkr0mTFkMvByL2I081lafVjd1ZY6wdldhPXV7BP8-nbwoiGruY2WzTyD37YA0V3li0fzpnxZxBV3Sn0y0mO2Mk7w">&nbsp; &nbsp;<img width="267" height="399.75000000000006" style="width: 259px; height: 388px;" src="https://lh7-us.googleusercontent.com/6-1WoTQj6oKaYYgISVFw80O_d2CSHaTrqyVpXlW6aTWAo2crT--8URcLYxoxX3LUInQw08PyYn6kafnFWtOeTDSjBv-G2RZsWXnf4H3AnHXOdw4TQDlPOjslitrgaYuVj9gnYXliRZFLfQ7taLpkVz8"></strong></p><p style="text-align: justify;">Chưa hết, thiết kế cổ V kết hợp họa tiết hoa giúp chị em toát lên nét lãng mạn cùng sức hút trẻ trung, yêu kiều tựa như Quý cô người Pháp.&nbsp;</p><p style="text-align: center;"><strong><img width="259" height="388.00000000000017" src="https://lh7-us.googleusercontent.com/E1zkvZvAQsv92dFw6hWGljXXd8pjOkDyCJ8-9e5iudJNLPdU-XPXsb3myOO1h-okTtIlgZLhCoFr9ixtiPq8kPsdy4sb2aqwlGVHR9PG7aUmh42a7cKdFQ-eyJS_E5GQo5TciIDNU2liBlSdSW5x5yo">&nbsp; &nbsp;<img width="267" height="399.75000000000006" style="width: 259px; height: 388px;" src="https://lh7-us.googleusercontent.com/XNxEfBow5LGCHqtHyMRYEE6-GndtFrL5JAErZNMvPa6XUEGp0b9TRvqiXbsHcM3LX_MmcScOf-J3m9gcOtpS2-zdNAMtx3XRK5X2SamZDCfgqIR3IDvd2bk0FxxUhl3nK0E4m8Ad3qVpCkVCVd9KVsc"></strong></p><p style="text-align: justify;">Tô điểm cho phong cách bán cổ điển, chi tiết cổ V được nhấn nhá thêm lớp vải ren làm tăng sự tinh tế, sang trọng cho chị em mỗi khi diện lên mình chiếc đầm xinh xắn này.</p><p style="text-align: center;"><strong><img width="259" height="388.00000000000017" src="https://lh7-us.googleusercontent.com/MY9fSkTplCpOYxibmk1rrDBl2gyapIg_Zydo5HTKgNUmih8MVfdujh9eSU1NdP7avBl1VOxolKDpWDXuns5AzYCvKDvxRcylLCoDykf6n7v5mm-rsb5KfwliVq1yiepYcZkzlWeVl8x1K8ApFllzFD8">&nbsp; &nbsp;<img width="267" height="399.75000000000006" style="width: 259px; height: 388px;" src="https://lh7-us.googleusercontent.com/bWGX7Y1qvCDcwHM0COPLt1AN1m5Y-wPKIi2cWjgG409eJWppg7A3sSk8UyrHG7W0Ux0cyZnqMZANZYuTikLdbJgV3_tXK5iR4lSN628WNyAD7PcL1iASU91e44IMWT8oDXDwUFLPz4AlVjR7LIDYKAo"></strong></p><p style="text-align: justify;">Trên đây là tổng hợp những mẫu đầm hoa xinh xắn dẫn đầu xu hướng xuân - hè năm nay. Hy vọng với thông tin chia sẻ từ Lamer, chị em sẽ tìm được kiểu đầm hoa ưng ý nhất với vóc dáng, làm tăng sự tự tin trong mình dù là nơi công sở hay những buổi xuống phố hẹn hò.</p>
                    </div>
</div>`,
  thumbnail: '/imgs/blog/1.webp',
  description: 'Dưới ánh nắng cuối xuân-đầu hè, không thể phủ nhận sức hút nữ tính, nhẹ nhàng đến từ những chiếc đầm hoa của Lamer.',
  categories: [categories[0]],
  publishedTime: new Date().toISOString(),
}

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
]

export default function BlogDetailPage() {
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
      <div className="container px-8 mx-auto xl:px-5 pt-5">
        <div className="mx-auto max-w-screen-md ">
          <div className="flex justify-center">
            <BlogCategoryLabel categories={blog.categories} />
          </div>
          <h1 className="text-brand-primary mb-3 mt-2 text-center text-lg md:text-3xl font-semibold tracking-tight lg:text-4xl lg:leading-snug">{blog.name}</h1>
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

      <div className="my-4 relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
        {blog.thumbnail && <Image src={blog.thumbnail} alt={blog.name} loading="eager" fill sizes="100vw" className="object-cover" />}
      </div>

      <div className="container p-3 mx-auto xl:py-0">
        <article className="mx-auto max-w-screen-md ">
          <div className="prose mx-auto my-3 prose-a:text-blue-600">
            <div dangerouslySetInnerHTML={{ __html: `${blog.content}` }}></div>
          </div>
          <div className="mb-7 mt-7 flex justify-center">
            <Link href="/bai-viet" className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600">
              ← View all blogs
            </Link>
          </div>
        </article>
        <BlogList blogs={blogs} aspect="square" />
      </div>
    </>
  )
}
