import React from 'react'
import SEO from '@/components/Layout/SEO'
import Image from 'next/image'
import { ClockIcon, ArrowPathIcon, ExclamationCircleIcon, HandRaisedIcon, BeakerIcon, FireIcon } from '@heroicons/react/24/outline'

export default function PolicyPage() {
  return (
    <>
      <SEO title="Chính sách" description="Chính sách và quy định đổi trả" />
      <section className="container mx-auto px-6 py-10 md:py-14 border-t border-b border-gray-300">
        <div className="justify-center md:flex md:gap-12">
          <div className="md:w-2/3">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Đôi điều về Cúc Hoạ Mi</h2>
            <p className="mt-8 text-gray-600 text-lg">
              Cúc Hoạ Mi là project thời trang cao cấp nửa cổ điển nửa hiện đại mà tụi mình hay gọi với cái tên thân thuộc Parisian Chic được làm bằng sự chân
              thành và tử tế của Team. Nếu bạn yêu thích phong cách này hãy cùng tiệm trải nghiệm những items thời thượng này nhé!
            </p>
            <p className="mt-4 text-gray-600 text-lg">
              Hy vọng những items nhỏ xinh của tiệm sẽ làm cho ngày hôm nay của bạn thêm chút dễ thương và ngọt ngào bạn nhé! Nếu hài lòng về sản phẩm đừng quên
              gửi những feedback đáng yêu cho tiệm. Còn nếu có bất kỳ vấn đề về sản phẩm đừng ngần ngại liên hệ với tiệm, tiệm sẽ giải quyết ngay ạ!
            </p>
          </div>
          <div className="md:w-1/3 mt-12 md:mt-0">
            <Image width={300} height={300} src="/imgs/cuchoami/square.jpg" alt="About Us Image" className="mx-auto object-cover shadow-md" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10 md:py-14 border-t border-b border-gray-300">
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-gray-700 my-2 flex items-center justify-center font-medium uppercase tracking-wider text-2xl">
            QUY ĐỊNH ĐỔI TRẢ HÀNG CỦA TIỆM
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border p-8 text-center shadow">
            <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
              <ClockIcon />
            </div>
            <h2 className="mt-6 text-gray-700">Thời gian đổi trả</h2>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600">Quý khách có thể đổi hàng trong vòng 48h kể từ ngày nhận hàng</p>
          </div>

          <div className="rounded-md border border-gray-300 p-8 text-center shadow">
            <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
              <ExclamationCircleIcon />
            </div>
            <h2 className="mt-6 text-gray-700">Sản phẩm có lỗi</h2>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600">
              Tiệm hỗ trợ đổi trả sản phẩm miễn phí khi có lỗi từ nhà sản xuất!
            </p>
          </div>

          <div className="rounded-md border border-gray-300 p-8 text-center shadow">
            <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
              <ArrowPathIcon />
            </div>
            <h2 className="mt-6 text-gray-700">Đổi/trả theo nhu cầu</h2>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600">
              Hỗ trợ đổi sản phẩm không vừa hoặc không hợp. Quý khách vui lòng chịu phí ship và + 30k phí đổi trả giúp tiệm.
            </p>
          </div>
        </div>
        <p className="mt-12">
          <b>▪️ Lưu ý về việc đổi hàng -</b> Mặt hàng phải ở trong tình trạng ban đầu, còn nguyên tem mác, chưa qua sử dụng, chưa giặt giũ - À cậu nhớ quay lại
          video khui hàng để tụi mình xác nhận đổi nhen, do trước khi gửi tiệm đã kiểm tra kỹ hêt rồi nè. Cậu vui lòng liên hệ với tiệm qua Direct hoặc qua
          Instagram @tiemdocuchoami để được hỗ trợ ạ!
        </p>
      </section>

      <section className="container mx-auto px-6 py-10 md:py-14 border-t border-b border-gray-300">
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-gray-700 my-2 flex items-center justify-center font-medium uppercase tracking-wider text-2xl">
            NHỮNG ĐIỀU LƯU Ý KHI BẢO QUẢN ÁO
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border p-8 text-center shadow">
            <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
              <HandRaisedIcon />
            </div>
            <h2 className="mt-6 text-gray-700">Giặt tay & phân loại màu</h2>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600">
              Bạn hãy giặt tay nhẹ nếu có thể, phân loại màu và phơi khô ngay sau khi giặt.
            </p>
          </div>

          <div className="rounded-md border border-gray-300 p-8 text-center shadow">
            <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
              <BeakerIcon />
            </div>
            <h2 className="mt-6 text-gray-700">Không hoá chất</h2>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600">
              Không nên ngâm lâu và sử dụng các sản phẩm giặt có chất tẩy mạnh
            </p>
          </div>

          <div className="rounded-md border border-gray-300 p-8 text-center shadow">
            <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
              <FireIcon />
            </div>
            <h2 className="mt-6 text-gray-700">Không nhiệt độ cao</h2>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600">
              Các sản phẩm có chất liệu thun và len, dạ nên là/ủi sản phẩm ở nhiệt độ thấp và tránh giặt sấy ở nhiệt độ cao.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
