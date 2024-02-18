import { Col, ConfigProvider, Modal, Radio, Row } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setDeliveryAddress } from "../../../modules/session/session.actions";
import { IconAddressDeliveryCustomize } from "../../assets/icons/AddressDeliveryIcon";
import { IconLocationCustomize } from "../../assets/icons/LocationIcon";
import { IconPickupCustomize } from "../../assets/icons/PickupDeliveryIcon";
import { enumOrderType } from "../../constants/enum";
import "./store-branch-address-selector.component.scss";

export const StoreBranchAddressSelector = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { open, onSelected, onClose, initStoreBranchData } = props;
  const nearestStoreBranches = useSelector((state) => state?.session?.nearestStoreBranches);
  const [storeBranchAddresses, setStoreBranchAddresses] = useState([]);
  const themeConfigReduxState = useSelector((state) => state?.session?.themeConfig);
  const config = themeConfigReduxState;
  const colorGroupFirstDefault = config?.general?.color?.colorGroups[0];
  const [selectedAddressDeliveryMethod, setSelectedAddressDeliveryMethod] = useState(true);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const dispatch = useDispatch();
  const fontFamily = useSelector((state) => state?.session?.themeConfig?.general?.font?.name);
  const translateData = {
    storeBranch: t("storeWebPage.profilePage.storeBranch", "Chi nhánh cửa hàng"),
    toTickup: t("checkOutPage.toPickup", "Tự lấy hàng"),
    delivery: t("checkOutPage.delivery", "Giao hàng"),
  };

  useEffect(() => {
    let timeoutId;
    const callFetchData = () => {
      if (nearestStoreBranches) {
        getStoreBranchAddresses();
      }
    };
    timeoutId = setTimeout(() => {
      callFetchData();
    }, 500);
    return () => clearTimeout(timeoutId);
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
    if (onSelected) onSelected(storeBranch, isSelectNewBranch);
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
    ///If delete selected branch in admin, auto select first branch
    const selectedBranch = storeBranchAddresses?.find((x) => x.id === initStoreBranchData?.id);
    if (!selectedBranch && storeBranchAddresses?.[0]) {
      onSelectBranchAddress(storeBranchAddresses?.[0] ?? null);
    }
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

  function changeTabsDeliveryMethod() {
    setSelectedAddressDeliveryMethod(false);
    saveOrderTypeToRedux(enumOrderType.ONLINE_DELIVERY);
    const chooseAddressModal = document.getElementsByClassName("receiver-address-select-button")[0];
    chooseAddressModal?.click();
  }

  function changeTabsPickupMethod() {
    setSelectedAddressDeliveryMethod(true);
    saveOrderTypeToRedux(enumOrderType.PICK_UP);
  }

  function saveOrderTypeToRedux(type) {
    const currentDeliveryAddress = {
      ...deliveryAddress,
      orderType: type,
    };
    dispatch(setDeliveryAddress(currentDeliveryAddress));
  }

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
          forceRender
          style={{ fontFamily: fontFamily }}
        >
          <div style={{ flexDirection: "row", display: "flex" }}>
            <div
              className="store-branch-address-selector-child"
              onClick={changeTabsDeliveryMethod}
              style={{
                marginTop: 24,
                backgroundColor: "rgba(196, 196, 196, 1)",
                height: 68,
              }}
            >
              <IconAddressDeliveryCustomize />
              <span className="store-branch-address-selector-header" style={{ color: "rgba(77, 77, 77, 1)" }}>
                {translateData.delivery}
              </span>
            </div>
            <div
              className="store-branch-address-selector-child"
              onClick={changeTabsPickupMethod}
              style={{
                marginTop: 0,
                backgroundColor: colorGroupFirstDefault?.buttonBackgroundColor ?? "#db4d29",
                height: 92,
              }}
            >
              <IconPickupCustomize />
              <span
                className="store-branch-address-selector-header"
                style={{ color: colorGroupFirstDefault?.buttonTextColor ?? "#ffffff", fontSize: 24 }}
              >
                {translateData.toTickup}
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
