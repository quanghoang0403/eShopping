import { Button, Form, Image } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { EnumDiscountCodeResponseCode } from "../../../constants/enums";
import { Platform } from "../../../constants/platform.constants";
import discountCodeDataService from "../../../data-services/discount-code-data.service";
import { discountCodesSelector } from "../../../modules/session/session.reducers";
import reduxService from "../../../services/redux.services";
import { formatDate, formatTextNumber } from "../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";
import DiscountImage from "../../assets/images/discount-icon.png";
import { ListPromotionType } from "../../constants/enum";
import { DateFormat } from "../../constants/string.constant";
import MyVoucherCard from "../my-voucher-card/my-voucher-card";
import PromotionCardInStore from "../promotion-card-in-store/promotion-card-in-store";
import SearchInputComponent from "../search-input/search-input.component";
import "./promotion-list.component.scss";
import posCartService from "../../../services/pos/pos-cart.services";
import { ToastMessageType } from "../../../constants/toast-message.constants";
import moment from "moment";
import { store } from "../../../modules";
import { setToastMessage } from "../../../modules/session/session.actions";

function PromotionListComponent(props) {
  const {
    isShowPromotionsInStoreIsBeingApplied = true,
    isShowMyPromotion = true,
    callBack,
    hiddenPromotion,
    colorConfig,
    isPos,
    branchIdPos,
    fontFamily,
    isShowInputDiscountCode,
    discountCodesPos
  } = props;
  const promotionsInStoreIsBeingApplied = useSelector(
    (state) => state?.session?.orderInfo?.cartValidated?.promotions ?? null,
  );
  const discountCodesInRedux = useSelector(discountCodesSelector);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const promotionListRef = useRef(null);
  const [promotionsInStore, setPromotionsInStore] = useState([]);
  const [myPromotion, setMyPromotion] = useState([]);

  const translateData = {
    placeholderPromotion: t("checkOutPage.placeHolderPromotion", "Enter your discount code"),
    changeAddress: t("checkOutPage.changeAddress", "Change another address"),
    validatedDiscountCode: t(
      "promotion.discountCode.description.notFound",
      "Mã giảm giá không hợp lệ. Vui lòng thử lại.",
    ),
    titleDefault: t("promotion.titleDefault", "Bạn không có mã khuyến mãi nào"),
    redeem: t("checkOutPage.redeem", "Lấy mã"),
    storePromotion: t("checkOutPage.storePromotion", "Khuyến mãi cửa hàng"),
    myVoucher: t("checkOutPage.myVoucher", "Voucher của tôi"),
    pleaseEnterDiscountCode: t(
      "promotion.discountCode.pleaseEnterDiscountCode",
      "Vui lòng nhập mã giảm giá để sử dụng trong đơn hàng của bạn.",
    ),
  };

  // useEffect(() => {
  //   handleSortDiscountCodeList();
  // }, [discountCodesInRedux]);

  const mappingDiscountCodeToDataInPromotionModalCard = (data) => {
    let newData = [];
    data?.map((item) => {
      if (discountCodesInRedux?.some((discountCode) => discountCode === item?.code)) {
        newData.unshift({
          id: item?.id,
          title: item?.name,
          code: item?.code,
          content: t(
            ListPromotionType.find((promotionType) => promotionType?.key === item?.discountCodeTypeId)?.name ?? "",
          ),
          endDate: item?.endDate ? formatDate(item?.endDate, DateFormat.DD_MM_YYYY_HH_MM) : null,
          isApply: item?.isApply ?? false,
        });
      } else {
        newData.push({
          id: item?.id,
          title: item?.name,
          code: item?.code,
          content: t(
            ListPromotionType.find((promotionType) => promotionType?.key === item?.discountCodeTypeId)?.name ?? "",
          ),
          endDate: item?.endDate ? formatDate(item?.endDate, DateFormat.DD_MM_YYYY_HH_MM) : null,
          isApply: item?.isApply ?? false,
        });
      }
    });

    return newData;
  };

  const mappingPromotionsToDataInPromotionModalCard = (data) => {
    let newData = [];
    data?.map((item) => {
      const index = newData.findIndex((itemNewData) => itemNewData?.id === item?.id);
      if (index === -1) {
        newData.push({
          id: item?.id,
          title: item?.promotionName,
          code: "",
          content: t(ListPromotionType.find((promotionType) => promotionType?.key === item?.promotionType)?.name ?? ""),
          endDate: item?.endDate ? formatDate(item?.endDate, DateFormat.DD_MM_YYYY_HH_MM) : null,
          textValue: item?.isPercentDiscount
            ? item?.percentNumber + "%"
            : formatTextNumber(item?.maximumDiscountAmount) + "đ",
        });
      }
    });

    return newData;
  };

  const renderTitle = (title) => {
    return (
      <div className="title">
        <div className="title-text">{title}</div>
        <div className="title-line"></div>
      </div>
    );
  };

  const getLoginUserInfo = () => {
    const customerInfoJsonString = getStorage(localStorageKeys.CUSTOMER_INFO);
    const customerInfo = JSON.parse(customerInfoJsonString);

    return customerInfo;
  };

  const getDiscountCodeByAccountId = async () => {
    const loginUserInfo = getLoginUserInfo();
    const reduxData = { ...reduxService.getAllData() };
    let branchId = reduxData?.deliveryAddress?.branchAddress?.id ?? null;
    const discountCodeList = await discountCodeDataService.getDiscountCodesByAccountIdAsync(
      branchId,
      loginUserInfo?.accountId,
    );

    if (discountCodeList.data) {
      handleSortDiscountCodeList(mappingDiscountCodeToDataInPromotionModalCard(discountCodeList?.data));
    }
  };

  const handleSortDiscountCodeList = (initDiscountCodes) => {
    const dataSort = initDiscountCodes ?? [...myPromotion];
    if (dataSort) {
      let discountCodesUnSelected =
        dataSort?.filter((item) => !discountCodesInRedux?.some((discountCode) => discountCode === item?.code)) ?? [];
      let discountCodesSelected =
        dataSort?.filter((item) => discountCodesInRedux?.some((discountCode) => discountCode === item?.code)) ?? [];
      let result = [...discountCodesSelected, ...discountCodesUnSelected];
      setMyPromotion([...result]);
    }
  };

  useEffect(() => {
    if (isShowPromotionsInStoreIsBeingApplied) {
      setPromotionsInStore(mappingPromotionsToDataInPromotionModalCard(promotionsInStoreIsBeingApplied));
    }

    if (isShowMyPromotion) {
      getDiscountCodeByAccountId();
    }
  }, []);

  const handleApplyDiscountCode = () => {
    form.validateFields().then(async (value) => {
      const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
      const storeConfig = JSON.parse(jsonConfig);
      const reduxData = { ...reduxService.getAllData() };
      let branchId = reduxData?.deliveryAddress?.branchAddress?.id ?? null;
      const code = value.discountCode.toUpperCase().trim();
      const params = {
        discountCodeId: null,
        storeId: storeConfig?.storeId ?? null,
        branchId: branchId,
        accountId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.accountId,
        customerId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.id,
        code: code,
      };
      const verifyDisCountCode = await discountCodeDataService.redeemDiscountCodeAsync(params);
      if (
        verifyDisCountCode?.data?.discountCodeResult?.responseCode === EnumDiscountCodeResponseCode.Success ||
        verifyDisCountCode?.data?.discountCodeResult?.responseCode === EnumDiscountCodeResponseCode.MinimumPurchaseValue
      ) {
        form.resetFields();
        getDiscountCodeByAccountId();
      } else {
        form.setFields([
          {
            name: "discountCode",
            errors: [t(verifyDisCountCode?.data?.discountCodeResult?.responseMessage) ?? ""],
          },
        ]);
      }
    });
  };

  const onClickRedeem = (code) => {
    callBack(code);
  };

  const handleApplyDiscountCodeQrCodeInPos = () => {
    form.validateFields().then(async (value) => {
      const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
      const storeConfig = JSON.parse(jsonConfig);
      const code = value.discountCode.toUpperCase().trim();
      const params = {
        discountCodeId: null,
        storeId: storeConfig?.storeId ?? null,
        branchId: branchIdPos ?? null,
        accountId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.accountId,
        customerId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.id,
        code: code,
        platformId: Platform.POS,
      };
      const verifyDisCountCode = await discountCodeDataService.redeemDiscountCodeAsync(params);
      if (
        verifyDisCountCode?.data?.discountCodeResult?.responseCode === EnumDiscountCodeResponseCode.Success ||
        verifyDisCountCode?.data?.discountCodeResult?.responseCode ===
          EnumDiscountCodeResponseCode.MinimumPurchaseValue ||
        verifyDisCountCode?.data?.discountCodeResult?.responseCode === EnumDiscountCodeResponseCode.Existed
      ) {
        
        if (discountCodesPos?.includes(code)) {
          form.setFields([
            {
              name: "discountCode",
              errors: [t("promotion.discountCode.description.existed", "Mã giảm giá đã tồn tại.")],
            },
          ]);
        } else {
          form.resetFields();
          callBack();
          posCartService.addDiscountCode(code);
          const data = {
            isShow: false,
            message: t("messages.appliedDiscountCodeSuccessfully", "Áp dụng mã giảm giá thành công"),
            type: ToastMessageType.SUCCESS,
            duration: 3,
            key: moment.now(),
          };
          store?.dispatch(setToastMessage(data));
        }
      } else {
        form.setFields([
          {
            name: "discountCode",
            errors: [t(verifyDisCountCode?.data?.discountCodeResult?.responseMessage) ?? ""],
          },
        ]);
      }
    });
  };

  return (
    <div style={{ fontFamily: fontFamily }}>
      {isShowInputDiscountCode ? (
        <Form form={form}>
          <div className="search-discount-code">
            <Form.Item
              name="discountCode"
              rules={[{ required: true, message: translateData.validatedDiscountCode }]}
              style={{ fontFamily: fontFamily }}
            >
              <SearchInputComponent
                {...props}
                suffix={
                  <Button
                    className="btn-apply"
                    onClick={isPos ? handleApplyDiscountCodeQrCodeInPos : handleApplyDiscountCode}
                  >
                    {translateData.redeem}
                  </Button>
                }
                maxLength={20}
                placeholder={translateData.placeholderPromotion}
                isInstore={isPos}
                pleaseEnterDiscountCode={translateData.pleaseEnterDiscountCode}
              />
            </Form.Item>
          </div>
        </Form>
      ) : (
        <></>
      )}

      {!isPos && (
        <div className="promotion-list" ref={promotionListRef}>
          {promotionsInStore && promotionsInStore?.length > 0 ? (
            <>
              {renderTitle(translateData.storePromotion)}
              {promotionsInStore?.map((item) => {
                return <PromotionCardInStore className="promotion-in-store" data={item} isSelected={true} />;
              })}
            </>
          ) : (
            <></>
          )}
          {myPromotion && myPromotion?.length > 0 ? (
            <>
              {renderTitle(translateData.myVoucher)}
              <div>
                {myPromotion?.map((item) => {
                  return (
                    <MyVoucherCard
                      idName={item.code}
                      className="my-voucher-item"
                      data={item}
                      onClickRedeem={() => {
                        onClickRedeem(item?.code);
                      }}
                      hiddenPromotion={hiddenPromotion}
                      isSelected={discountCodesInRedux?.some((discountCode) => discountCode === item?.code)}
                      colorConfig={colorConfig}
                      isApply={item?.isApply}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <></>
          )}
          {myPromotion && myPromotion?.length === 0 && promotionsInStore && promotionsInStore?.length === 0 ? (
            <>
              {renderTitle(translateData.myVoucher)}
              <div className="discount-default">
                <Image src={DiscountImage} preview={false} />
                <span className="discount-default-title">{translateData.titleDefault}</span>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(PromotionListComponent, (prevProps, nextProps) => prevProps === nextProps);
