import { useTranslation } from "react-i18next";
import { MaximumLimitFlashSaleNotifyIcon } from "../../assets/icons.constants";

import "./maximum-limit-flash-sale-notify.component.scss";

export function MaximumLimitFlashSaleNotifyComponent(props) {
  const { maximumLimit } = props;
  const [t] = useTranslation();
  const translateData = {
    maximumLimitFlashSaleNotify: t(
      "maximumLimitFlashSaleNotify",
      "Bạn chỉ có thể mua <strong>{{maximumLimit}}</strong> sản phẩm với giá Flash sale. Phần vượt quá sẽ quay về giá gốc"
    ),
  };

  return (
    <div className="maximum-limit-flash-sale-notify">
      <MaximumLimitFlashSaleNotifyIcon />
      <span
        dangerouslySetInnerHTML={{
          __html: t(translateData.maximumLimitFlashSaleNotify, { maximumLimit: maximumLimit }),
        }}
      ></span>
    </div>
  );
}
