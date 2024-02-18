import { Col, Modal, Radio, Row } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setDeliveryAddress } from "../../../modules/session/session.actions";
import { enumOrderType } from "../../constants/enums";
import { ReactComponent as CheckedIcon } from "./checked-icon.svg";
import { ReactComponent as ShopAddressIcon } from "./shop-address-icon.svg";
import "./store-branch-address-selector.component.scss";

export const StoreBranchAddressSelector = forwardRef((props, ref) => {
  const { open, onSelected, onClose, initStoreBranchData, colorGroup, config, getDefaultStoreBranch } = props;
  const nearestStoreBranches = useSelector((state) => state?.session?.nearestStoreBranches);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const currentBranchAddress = deliveryAddress?.branchAddress;
  const [storeBranchAddresses, setStoreBranchAddresses] = useState([]);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [groupColorConfig, setGroupColorConfig] = useState();
  const [currentOrderType, setCurrentOrderType] = useState(deliveryAddress?.orderType ?? enumOrderType.ONLINE_DELIVERY);

  const translatedData = {
    deliveryTo: t("addUserLocation.deliveryTo", "Giao đến"),
    pickUp: t("addUserLocation.pickUp", "Tự lấy hàng"),
    nearestBranch: t("addUserLocation.nearestBranch", "Cửa hàng gần bạn nhất"),
    otherBranch: t("addUserLocation.otherBranch", "Chi nhánh khác"),
  };

  useEffect(() => {
    const group = colorGroup?.[0];
    setGroupColorConfig(group);
  }, []);

  useEffect(() => {
    setCurrentOrderType(deliveryAddress?.orderType ?? enumOrderType.ONLINE_DELIVERY);
  }, [deliveryAddress?.orderType]);

  useEffect(() => {
    if (nearestStoreBranches) {
      getStoreBranchAddresses();
    }
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

  // Select delivery type, save to delivery address redux
  function handleSelectType(type) {
    if (type !== deliveryAddress?.orderType) {
      setCurrentOrderType(type);
      const currentDeliveryAddress = {
        ...deliveryAddress,
        orderType: type,
      };
      dispatch(setDeliveryAddress(currentDeliveryAddress));
      if (type === enumOrderType.ONLINE_DELIVERY) {
        onClose();
        const chooseAddressModal = document.getElementsByClassName("receiver-address-select-button")[0];
        chooseAddressModal?.click();
      } else {
        if (!nearestStoreBranches) {
          getDefaultStoreBranch();
        }
      }
    }
  }

  const StoreBranchDetail = (props) => {
    const { storeBranchName, distance, addressDetail, groupColorConfig, storeBranchId, initStoreBranchDataId } = props;
    return (
      <Row className="store-branch-address-item">
        <Col span={24} className="d-flex">
          <div className="address-icon">
            <ShopAddressIcon
              fill={storeBranchId == initStoreBranchDataId ? groupColorConfig?.buttonBackgroundColor : "#C0C0C0"}
            />
          </div>
          <div className="address-detail">
            <p className="address-label">
              <span style={{ color: groupColorConfig?.textColor }}>{storeBranchName}</span>
              <span className="distance" style={{ color: groupColorConfig?.titleColor }}>
                ({distance})
              </span>
            </p>
            <p className="address" style={{ color: groupColorConfig?.textColor }}>
              {addressDetail}
            </p>
          </div>

          <div className="selected">
            <CheckedIcon fill={groupColorConfig?.buttonBackgroundColor} />
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Modal
        className={"store-branch-address-selector"}
        title={
          <div className="header-branch">
            <div
              style={{
                backgroundColor:
                  currentOrderType === enumOrderType.ONLINE_DELIVERY
                    ? groupColorConfig?.buttonBackgroundColor
                    : "transparent",
              }}
              onClick={() => handleSelectType(enumOrderType.ONLINE_DELIVERY)}
              className="title-branch-modal-left"
            >
              <span
                className="text-branch-title"
                style={{
                  color:
                    currentOrderType === enumOrderType.ONLINE_DELIVERY ? groupColorConfig?.buttonTextColor : "#fff",
                }}
              >
                {translatedData.deliveryTo}
              </span>
            </div>
            <div
              style={{
                backgroundColor:
                  currentOrderType === enumOrderType.PICK_UP ? groupColorConfig?.buttonBackgroundColor : "transparent",
              }}
              onClick={() => handleSelectType(enumOrderType.PICK_UP)}
              className="title-branch-modal-right"
            >
              <span
                className="text-branch-title"
                style={{
                  color: currentOrderType === enumOrderType.PICK_UP ? groupColorConfig?.buttonTextColor : "#fff",
                }}
              >
                {translatedData.pickUp}
              </span>
            </div>
          </div>
        }
        open={open}
        onOk={() => {}}
        onCancel={onClose}
        closeIcon
        forceRender={true}
        destroyOnClose={true}
      >
        <Radio.Group
          value={initStoreBranchData?.id}
          defaultValue={initStoreBranchData?.id}
          className="store-branch-addresses"
        >
          {storeBranchAddresses?.map((storeBranch, index) => {
            return (
              <Radio
                key={index}
                value={storeBranch?.id}
                onClick={() => onSelectBranchAddress(storeBranch, true)}
                style={
                  initStoreBranchData?.id === storeBranch?.id
                    ? { borderColor: groupColorConfig?.buttonBorderColor }
                    : {}
                }
              >
                {(index === 0 || index === 1) && (
                  <div className="text-branch-info">
                    {index === 0 ? translatedData.nearestBranch : translatedData.otherBranch}
                  </div>
                )}
                <StoreBranchDetail
                  groupColorConfig={groupColorConfig}
                  position={index}
                  storeBranchName={storeBranch?.title}
                  storeBranchId={storeBranch?.id}
                  initStoreBranchDataId={initStoreBranchData?.id}
                  distance={storeBranch?.distance}
                  addressDetail={storeBranch?.addressDetail}
                />
              </Radio>
            );
          })}
        </Radio.Group>
      </Modal>
    </div>
  );
});
