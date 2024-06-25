"use client";

import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

const DEMO_DATA = [
  {
    name: "Mô tả sản phẩm",
    content:
      "Thời trang là một hình thức tự biểu đạt và tự chủ tại một thời điểm và địa điểm cụ thể, trong một ngữ cảnh nhất định, bao gồm quần áo, giày dép, lối sống, phụ kiện, trang điểm, kiểu tóc, và tư thế cơ thể.",
  },
  {
    name: "Vải + Chăm sóc",
    content: `<ul class="list-disc list-inside leading-7">
    <li>Làm từ một loại lưới micromesh mạnh mẽ của Bỉ.</li>
    <li>
    74% Polyamide (Nylon) 26% Elastane (Spandex)
    </li>
    <li>
    Có thể điều chỉnh móc & mắt và dây đeo
    </li>
    <li>
    Giặt tay trong nước lạnh, phơi phẳng
    </li>
  </ul>`,
  },

  {
    name: "Cách chọn sản phẩm",
    content:
      "Sở thích và gu thời trang là một yếu tố lớn — nếu bạn là người có gu ăn mặc thoải mái, rộng rãi, bạn có thể muốn chọn kích cỡ lớn hơn.",
  },
  {
    name: "Câu hỏi thường gặp",
    content: `
    <ul class="list-disc list-inside leading-7">
    <li>Tất cả các mặt hàng giá đầy đủ, chưa mặc, với nhãn còn nguyên và trong bao bì gốc đều đủ điều kiện để trả lại hoặc đổi trong vòng 30 ngày kể từ khi đặt hàng.</li>
    <li>
    Xin lưu ý, các gói hàng phải được trả lại đầy đủ. Chúng tôi không chấp nhận trả lại một phần các gói hàng.
    </li>
    <li>
    Muốn biết chính sách trả hàng đầy đủ của chúng tôi? Đây bạn.
    </li>
    <li>
    Muốn biết thêm thông tin về vận chuyển, vật liệu hoặc hướng dẫn chăm sóc? Đây!
    </li>
  </ul>
    `,
  },
];

interface Props {
  panelClassName?: string;
  data?: typeof DEMO_DATA;
}

const AccordionInfo: FC<Props> = ({
  panelClassName = "p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6",
  data = DEMO_DATA,
}) => {
  return (
    <div className="w-full rounded-2xl space-y-2.5">
      {/* ============ */}
      {data.map((item, index) => {
        return (
          <Disclosure key={index} defaultOpen={index < 2}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                  <span>{item.name}</span>
                  {!open ? (
                    <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel
                  className={panelClassName}
                  as="div"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                ></Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      })}

      {/* ============ */}
    </div>
  );
};

export default AccordionInfo;
