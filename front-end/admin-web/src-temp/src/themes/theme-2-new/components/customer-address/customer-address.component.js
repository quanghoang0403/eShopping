import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { HomeIcon, LocationAddressIcon, OfficeIcon } from "../../assets/icons.constants";
import "./customer-address.style.scss";
import { EnumCustomerAddressType } from "../../constants/enum";
import { useSelector } from "react-redux";
import styled from "styled-components";

export const CustomerAddresses = forwardRef((props, ref) => {
  const themeConfigReduxState = useSelector((state) => state?.session?.themeConfig);
  const { addressList, setCustomerAddress } = props;
  const [t] = useTranslation();
  const config = themeConfigReduxState;
  const colorGroupFirstDefault = config?.general?.color?.colorGroups[0];
  const translateData = {
    myAddress: t("storeWebPage.profilePage.myAddress", "ĐỊA CHỈ CỦA BẠN"),
    default: t("storeWebPage.profilePage.default", "Mặc định"),
  };

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({}));

  const StyledAddressSection = styled.div`
    .my-address-container {
      .title-container {
        .title-text {
          color: ${colorGroupFirstDefault?.titleColor};
        }
      }
      .address-list-container {
        .address-detail-box {
          border-color: ${colorGroupFirstDefault?.buttonBorderColor};
          .right-content {
            .address-title {
              color: ${colorGroupFirstDefault?.textColor};
            }
            .address-detail-text {
              color: ${colorGroupFirstDefault?.textColor};
            }
            .address-default {
              .address-default-text {
                color: ${colorGroupFirstDefault?.buttonBackgroundColor};
                border: 1px solid ${colorGroupFirstDefault?.buttonBackgroundColor};
              }
            }
          }
        }
      }
    }
  `;

  return (
    <div className="customer-delivery-address-wrapper">
      <StyledAddressSection>
        <div className="my-address-container">
          <div className="title-container">
            <span className="title-text">{translateData.myAddress}</span>
          </div>
          <div className="address-list-container">
            {addressList?.map((item, index) => {
              return (
                <div className="address-detail-box" onClick={() => setCustomerAddress(item)}>
                  <div className="left-content">
                    {item?.customerAddressTypeId === EnumCustomerAddressType.Home ? (
                      <HomeIcon />
                    ) : item?.customerAddressTypeId === EnumCustomerAddressType.Work ? (
                      <OfficeIcon />
                    ) : (
                      <LocationAddressIcon />
                    )}
                  </div>
                  <div className="right-content">
                    <span className="address-title">{item?.name}</span>
                    <br />
                    <span className="address-detail-text">{item?.address}</span>
                    {item?.isDefault && (
                      <div className="address-default">
                        <span className="address-default-text">{translateData.default}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </StyledAddressSection>
    </div>
  );
});
