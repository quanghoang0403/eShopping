import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import "./customer-address.style.scss";

export const CustomerAddresses = forwardRef((props, ref) => {
  const { addressList, setCustomerAddress, groupColorConfig } = props;
  const [t] = useTranslation();
  const translatedData = {
    default: t("addUserLocation.default", "Mặc định"),
  };

  useEffect(() => {}, []);
  useImperativeHandle(ref, () => ({}));

  return (
    <div className="customer-delivery-address-wrapper">
      <div className="my-address-container">
        <div className="address-list-container">
          {addressList?.map((item, index) => {
            return (
              <div className="address-detail-box" key={index} onClick={() => setCustomerAddress(item)}>
                <div className="address-content">
                  <div className="address-title">
                    <span>{item.name}</span>
                    {item?.isDefault && (
                      <span
                        className="address-default-text"
                        style={{
                          color: groupColorConfig?.buttonTextColor,
                          backgroundColor: groupColorConfig?.buttonBackgroundColor,
                        }}
                      >
                        {translatedData.default}
                      </span>
                    )}
                  </div>
                  <div className="address-detail-text">
                    <span>{item.address}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
