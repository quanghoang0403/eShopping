import rightImg from '@/assets/images/hero-right1.png'
import React from 'react'
import BgGlassmorphism from '@/shared/Background/BgGlassmorphism'
import SectionHero from '@/components/About/SectionHero'
import { ClockIcon, ArrowPathIcon, ExclamationCircleIcon, HandRaisedIcon, BeakerIcon, FireIcon } from '@heroicons/react/24/outline'

const PolicyPage = ({}) => {
  return (
    <div className={`nc-PageAbout overflow-hidden relative`}>
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />

      <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
        <SectionHero
          rightImg={rightImg}
          heading="👋 Về Cúc Hoạ Mi."
          btnText=""
          subHeading="Cúc Hoạ Mi là project thời trang cao cấp nửa cổ điển nửa hiện đại mà tụi mình hay gọi với cái tên thân thuộc Parisian Chic được làm bằng sự chân
              thành và tử tế của Team. Nếu bạn yêu thích phong cách này hãy cùng tiệm trải nghiệm những items thời thượng này nhé!"
        />

        <section className="container mx-auto px-6 py-10 md:py-14 border-t border-b border-gray-300">
          <div className="relative mx-auto max-w-5xl text-center">
            <span className="text-gray-700 dark:text-neutral-200 my-2 flex items-center justify-center font-medium uppercase tracking-wider text-2xl">
              QUY ĐỊNH ĐỔI TRẢ HÀNG CỦA TIỆM
            </span>
          </div>

          <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md border p-8 text-center shadow">
              <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
                <ClockIcon className="w-9 h-9" />
              </div>
              <h2 className="mt-6 text-gray-700 dark:text-neutral-200">Thời gian đổi trả</h2>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600 dark:text-neutral-200">Quý khách có thể đổi hàng trong vòng 48h kể từ ngày nhận hàng</p>
            </div>

            <div className="rounded-md border border-gray-300 p-8 text-center shadow">
              <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
                <ExclamationCircleIcon className="w-9 h-9" />
              </div>
              <h2 className="mt-6 text-gray-700 dark:text-neutral-200">Sản phẩm có lỗi</h2>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600 dark:text-neutral-200">
                Tiệm hỗ trợ đổi trả sản phẩm miễn phí khi có lỗi từ nhà sản xuất!
              </p>
            </div>

            <div className="rounded-md border border-gray-300 p-8 text-center shadow">
              <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
                <ArrowPathIcon className="w-9 h-9" />
              </div>
              <h2 className="mt-6 text-gray-700 dark:text-neutral-200">Đổi/trả theo nhu cầu</h2>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600 dark:text-neutral-200">
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

        <section className="container mx-auto px-6 pb-10 md:pb-14 border-b border-gray-300">
          <div className="relative mx-auto max-w-5xl text-center">
            <span className="text-gray-700 my-2 flex items-center justify-center font-medium uppercase tracking-wider text-2xl dark:text-neutral-200">
              NHỮNG ĐIỀU LƯU Ý KHI BẢO QUẢN ÁO
            </span>
          </div>

          <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md border p-8 text-center shadow">
              <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
                <HandRaisedIcon className="w-9 h-9" />
              </div>
              <h2 className="mt-6 text-gray-700 dark:text-neutral-200">Giặt tay & phân loại màu</h2>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600 dark:text-neutral-200">
                Bạn hãy giặt tay nhẹ nếu có thể, phân loại màu và phơi khô ngay sau khi giặt.
              </p>
            </div>

            <div className="rounded-md border border-gray-300 p-8 text-center shadow">
              <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
                <BeakerIcon className="w-9 h-9" />
              </div>
              <h2 className="mt-6 text-gray-700 dark:text-neutral-200">Không hoá chất</h2>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600 dark:text-neutral-200">
                Không nên ngâm lâu và sử dụng các sản phẩm giặt có chất tẩy mạnh
              </p>
            </div>

            <div className="rounded-md border border-gray-300 p-8 text-center shadow">
              <div className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gray-600 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
                <FireIcon className="w-9 h-9" />
              </div>
              <h2 className="mt-6 text-gray-700 dark:text-neutral-200">Không nhiệt độ cao</h2>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-600 dark:text-neutral-200">
                Các sản phẩm có chất liệu thun và len, dạ nên là/ủi sản phẩm ở nhiệt độ thấp và tránh giặt sấy ở nhiệt độ cao.
              </p>
            </div>
          </div>
        </section>
        <p className="text-gray-600 dark:text-neutral-200 text-lg">
          Hy vọng những items nhỏ xinh của tiệm sẽ làm cho ngày hôm nay của bạn thêm chút dễ thương và ngọt ngào bạn nhé! Nếu hài lòng về sản phẩm đừng quên
          gửi những feedback đáng yêu cho tiệm. Còn nếu có bất kỳ vấn đề về sản phẩm đừng ngần ngại liên hệ với tiệm, tiệm sẽ giải quyết ngay ạ!
        </p>
      </div>
    </div>
  )
}

export default PolicyPage
