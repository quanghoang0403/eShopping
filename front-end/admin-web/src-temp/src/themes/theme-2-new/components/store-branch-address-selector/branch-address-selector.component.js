import { Col, ConfigProvider, Modal, Radio, Row } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { IconAddressDeliveryCustomize } from "../../assets/icons/AddressDeliveryIcon";
import { IconLocationCustomize } from "../../assets/icons/LocationIcon";
import "./store-branch-address-selector.component.scss";

export const BranchAddressSelector = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { open, className, onSelected, onClose, initStoreBranchData } = props;
  const nearestStoreBranches = useSelector((state) => state?.session?.nearestStoreBranches);
  const [storeBranchAddresses, setStoreBranchAddresses] = useState([]);
  const themeConfigReduxState = useSelector((state) => state?.session?.themeConfig);
  const config = themeConfigReduxState;
  const colorGroupFirstDefault = config?.general?.color?.colorGroups[0];
  const fontFamily = useSelector((state) => state?.session?.themeConfig?.general?.font?.name);
  const translateData = {
    storeBranch: t("storeWebPage.profilePage.storeBranch", "Chi nhánh cửa hàng"),
    toTickup: t("checkOutPage.toPickup", "Tự lấy hàng"),
    delivery: t("checkOutPage.delivery", "Giao hàng"),
  };

  useEffect(() => {
    getStoreBranchAddresses();
  }, [nearestStoreBranches]);

  useImperativeHandle(ref, () => ({
    setAutoPickStoreBranchAddress(branches) {
      autoPickStoreBranchAddress(branches);
    },
  }));

  const autoPickStoreBranchAddress = (nearestStoreBranches) => {
    if (!nearestStoreBranches || nearestStoreBranches?.length === 0) {
      return;
    }

    const defaultStoreBranchAddress = nearestStoreBranches[0];
    const convertDistanceToKm = defaultStoreBranchAddress?.distance / 1000;
    const distance = convertDistanceToKm?.toFixed(1)?.toString()?.replace(".", ",") + " km";
    const defaultStoreBranchAddressInfo = {
      id: defaultStoreBranchAddress.branchId,
      title: defaultStoreBranchAddress.branchName,
      addressDetail: defaultStoreBranchAddress.branchAddress,
      distance: distance,
      lat: defaultStoreBranchAddress.lat,
      lng: defaultStoreBranchAddress.lng,
    };
    onSelectBranchAddress(defaultStoreBranchAddressInfo);
  };

  const onSelectBranchAddress = (storeBranch, isSelectNewBranch) => {
    if (onSelected) {
      onSelected(storeBranch, isSelectNewBranch);
      onClose();
    }
  };

  const getStoreBranchAddresses = () => {
    // TODO: mapping nearestStoreBranches => storeBranchAddresses and update storeBranchAddresses
    const storeBranchAddresses = nearestStoreBranches?.map((item) => {
      const convertDistanceToKm = item?.distance / 1000;
      const distance = convertDistanceToKm?.toFixed(1)?.toString()?.replace(".", ",") + " km";

      return {
        id: item.branchId,
        title: item.branchName,
        addressDetail: item.branchAddress,
        distance: distance,
        lat: item.lat,
        lng: item.lng,
      };
    });

    setStoreBranchAddresses(storeBranchAddresses);
  };

  const StoreBranchDetail = (props) => {
    const { position, storeBranchName, distance, addressDetail } = props;
    return (
      <Row className="store-branch-address-item">
        <Col span={24} className="d-flex">
          <div className="address-icon">
            <IconLocationCustomize color={colorGroupFirstDefault?.buttonBackgroundColor} />
            <span className="outline">
              <span className="address-index">{position + 1}</span>
            </span>
          </div>
          <div className="address-detail">
            <p className="address-label">{storeBranchName}</p>
            <p className="distance">{distance}</p>
            <p className="address">{addressDetail}</p>
          </div>
        </Col>
      </Row>
    );
  };

  const sortedStoreBranchAddresses = storeBranchAddresses?.slice();
  const initialSelectedValue = initStoreBranchData?.id;

  if (initialSelectedValue) {
    const selectedAddressIndex = sortedStoreBranchAddresses?.findIndex(
      (storeBranch) => storeBranch.id === initialSelectedValue,
    );

    if (selectedAddressIndex > -1) {
      const selectedAddress = sortedStoreBranchAddresses[selectedAddressIndex];
      sortedStoreBranchAddresses.splice(selectedAddressIndex, 1);
      sortedStoreBranchAddresses.unshift(selectedAddress);
    }
  }

  sortedStoreBranchAddresses?.sort((a, b) => {
    if (a.id === initialSelectedValue) {
      return -1;
    } else if (b.id === initialSelectedValue) {
      return 1;
    } else {
      return a.distance - b.distance;
    }
  });

  const StyledStoreBranchAddressSection = styled.div`
    background-color: #ffffff;
    border-radius: 0 0 20px 20px;
    .store-branch-addresses-parent {
      .store-branch-addresses {
        .ant-radio-wrapper-checked {
          .ant-radio-checked {
            .ant-radio-inner {
              border-color: ${colorGroupFirstDefault?.buttonBorderColor};
            }
            .ant-radio-inner::after {
              background-color: ${colorGroupFirstDefault?.buttonBackgroundColor};
            }
          }
        }
      }
    }
    .store-branch-address-item {
      .ant-col {
        .address-detail {
          .address-label {
            color: ${colorGroupFirstDefault?.titleColor};
          }
          .distance {
            color: ${colorGroupFirstDefault?.buttonBackgroundColor};
          }
          .address {
            color: ${colorGroupFirstDefault?.textColor};
          }
        }
        .address-icon {
          .outline {
            background: ${colorGroupFirstDefault?.buttonBackgroundColor};
            .address-index {
              color: ${colorGroupFirstDefault?.buttonTextColor};
            }
          }
        }
      }
    }
    .store-branch-address-selector ::-webkit-scrollbar-thumb {
      background: ${colorGroupFirstDefault?.buttonBackgroundColor};
    }
  `;

  return (
    <div className="store-branch-address-parent">
      <ConfigProvider
        theme={{
          components: {
            Modal: {
              colorBgElevated: colorGroupFirstDefault?.buttonBackgroundColor ?? "#db4d29",
            },
          },
        }}
      >
        <Modal
          className={"store-branch-address-selector"}
          open={open}
          onOk={() => {}}
          onCancel={onClose}
          closeIcon
          centered
          style={{ fontFamily: fontFamily }}
        >
          <div style={{ flexDirection: "row", display: "flex" }}>
            <div
              className="store-branch-address-selector-child"
              style={{
                marginTop: 0,
                backgroundColor: colorGroupFirstDefault?.buttonBackgroundColor ?? "#db4d29",
                height: 92,
              }}
            >
              <IconAddressDeliveryCustomize />
              <span
                className="store-branch-address-selector-header"
                style={{ color: colorGroupFirstDefault?.buttonTextColor ?? "#ffffff" }}
              >
                {translateData.storeBranch}
              </span>
            </div>
          </div>
          <StyledStoreBranchAddressSection>
            <div className="store-branch-addresses-parent">
              <Radio.Group
                value={initStoreBranchData?.id}
                defaultValue={initStoreBranchData?.id}
                className="store-branch-addresses"
              >
                {sortedStoreBranchAddresses?.map((storeBranch, index) => {
                  return (
                    <Radio key={index} value={storeBranch?.id} onClick={() => onSelectBranchAddress(storeBranch, true)}>
                      <StoreBranchDetail
                        position={index}
                        storeBranchName={storeBranch.title}
                        distance={storeBranch.distance}
                        addressDetail={storeBranch.addressDetail}
                      />
                    </Radio>
                  );
                })}
              </Radio.Group>
            </div>
          </StyledStoreBranchAddressSection>
        </Modal>
      </ConfigProvider>
    </div>
  );
});
