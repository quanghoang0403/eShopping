import { Drawer, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import discountCodeDataService from "../../../../../data-services/discount-code-data.service";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import { CloseIcon, NoPromotionCheckoutIcon } from "../../../../assets/icons.constants";
import { DiscountCodeCard } from "../../../../components/discount-code-card/discount-code-card.component";
import { EnumDiscountCodeResponseCode } from "../../../../constants/enums";

import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { discountCodesSelector } from "../../../../../modules/session/session.reducers";
import reduxService from "../../../../../services/redux.services";
import { PromotionDialogDefaultData } from "./default-data";
import "./get-discount-button.scss";

export default function UseDiscount(props) {
  const { visible, onCancel, onClickUse, isCustomize, colorGroup, fontFamily, isShowInputDiscountCode = false } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
  const [isHiddenDiscount, setIsHiddenDiscount] = useState(false);
  const storeConfig = JSON.parse(jsonConfig);
  const discountCodes = useSelector(discountCodesSelector);
  const branchAddress = useSelector((state) => state?.session?.deliveryAddress?.branchAddress);
  const discounts = useSelector((state) => state?.session?.orderInfo?.cartValidated?.promotions ?? null);
  const pageData = {
    promotion: t("checkOutPage.promotion", "Promotion"),
    placeHolderPromotion: t("checkOutPage.placeHolderPromotion", "Enter your discount code"),
    redeem: t("checkOutPage.redeem", "Lấy mã"),
    validatedDiscountCode: t(
      "promotion.discountCode.description.notFound",
      "Mã giảm giá không hợp lệ. Vui lòng thử lại.",
    ),
    storePromotion: t("checkOutPage.storePromotion", "Khuyến mãi cửa hàng"),
    myVoucher: t("checkOutPage.myVoucher", "Voucher của tôi"),
    discountCode: t("checkOutPage.discountCode", "Discount code"),
  };
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });

  const [discountCodeList, setDiscountCodeList] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const [message, setMessage] = useState(null);
  const [isShowRedeem, setIsShowRedeem] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);

  useEffect(() => {
    if (isCustomize) {
      setDiscountList(PromotionDialogDefaultData?.discounts);
    } else {
      getDiscountCodeByAccountId();
      handleLoadDiscount(null);
    }
  }, []);

  useEffect(() => {
    if (isCustomize) {
      setDiscountCodeList(PromotionDialogDefaultData?.discountCodes);
    } else {
      handleSortDiscountCodeList();
    }
  }, [discountCodes]);

  const handleSortDiscountCodeList = (initDiscountCodes) => {
    const dataSort = initDiscountCodes ?? [...discountCodeList];
    if (dataSort) {
      let discountCodesUnSelected =
        dataSort?.filter((item) => !discountCodes?.some((discountCode) => discountCode === item?.code)) ?? [];
      let discountCodesSelected =
        dataSort?.filter((item) => discountCodes?.some((discountCode) => discountCode === item?.code)) ?? [];
      let result = [...discountCodesSelected, ...discountCodesUnSelected];
      setDiscountCodeList([...result]);
    }
  };

  const handleLoadDiscount = () => {
    if (discounts) {
      const discountResult = discounts
        ?.filter((object, index, self) => {
          return index === self.findIndex((o) => o.id === object.id);
        })
        ?.map((item) => {
          return {
            ...item,
            name: item?.promotionName,
            promotionTypeId: item?.promotionType,
          };
        });
      setDiscountList(discountResult);
    }
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
      handleSortDiscountCodeList([...discountCodeList.data]);
    }
  };

  const handleRedeemBtn = async () => {
    form.validateFields().then(async (value) => {
      const code = value.discountCode.toUpperCase().trim();
      const params = {
        discountCodeId: null,
        storeId: storeConfig?.storeId ?? null,
        branchId: branchAddress?.id ?? null,
        accountId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.accountId,
        customerId: JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.id,
        code: code,
      };
      const verifyDisCountCode = await discountCodeDataService.redeemDiscountCodeAsync(params);
      if (
        verifyDisCountCode?.data?.discountCodeResult?.responseCode === EnumDiscountCodeResponseCode.Success ||
        verifyDisCountCode?.data?.discountCodeResult?.responseCode === EnumDiscountCodeResponseCode.MinimumPurchaseValue
      ) {
        let formValue = form.getFieldsValue();
        formValue.discountCode = "";
        form.setFieldsValue(formValue);
        getDiscountCodeByAccountId();
        setMessage("promotion.discountCode.redeemSuccessfully");
        setIsSuccess(true);
        handleTimeoutShowToastMessage();
      } else {
        setMessage(verifyDisCountCode?.data?.discountCodeResult?.responseMessage);
        setIsSuccess(false);
        handleTimeoutShowToastMessage();
      }
    });
  };
  const handleTimeoutShowToastMessage = () => {
    setTimeout(() => {
      setIsShowRedeem(false);
    }, 3000);
    setIsShowRedeem(true);
  };

  const StyledPromotionDialogList = styled.div`
    .fnb-discount-code-card-theme-1.apply {
      background-color: ${colorGroup?.buttonBackgroundColor};
    }
    .fnb-discount-code-card-theme-1 .discount-code-content-store-discount .discount-code-currency {
      border: 1px solid ${colorGroup?.buttonBackgroundColor};
    }
    .fnb-discount-code-card-theme-1 .discount-code-content-store-discount .discount-code-currency .currency {
      background-color: ${colorGroup?.buttonBackgroundColor};
    }
    .fnb-discount-code-card-theme-1 .discount-code-content-store-discount .discount-code-currency .value span {
      color: ${colorGroup?.buttonBackgroundColor};
    }
    .fnb-discount-code-card-theme-1 .discount-code-content-store-discount .discount-code-card {
      background-color: ${colorGroup?.buttonBackgroundColor};
      border: 1px solid ${colorGroup?.buttonBorderColor};
      span {
        color: ${colorGroup?.buttonTextColor};
      }
    }
  `;
  function hiddenDiscount(value) {
    setIsHiddenDiscount(value);
  }
  const divContent = () => {
    return (
      <>
        <StyledPromotionDialogList>
          <div className="get-discount-button-checkout-theme1" style={{ fontFamily: fontFamily }}>
            {!isMaxWidth575 ? (
              <div className="promotion-title">
                <span>{pageData.myVoucher}</span>
              </div>
            ) : null}

            {isShowInputDiscountCode ? (
              <Form form={form}>
                <div className="promotion-textbox">
                  <Form.Item name="discountCode" rules={[{ required: true, message: pageData.validatedDiscountCode }]}>
                    <Input
                      className="discount-code-textbox"
                      id="discount-code-textbox-id"
                      placeholder={pageData.placeHolderPromotion}
                    />
                  </Form.Item>
                  <div
                    className="redeem-btn"
                    onClick={() => handleRedeemBtn()}
                    style={{
                      backgroundColor: colorGroup?.buttonBackgroundColor,
                      border: "1px solid " + colorGroup?.buttonBorderColor,
                    }}
                  >
                    <span
                      className="redeem-text"
                      style={{
                        color: colorGroup?.buttonTextColor,
                      }}
                    >
                      {pageData.redeem}
                    </span>
                  </div>
                </div>
              </Form>
            ) : (
              <></>
            )}
            {isShowRedeem && (
              <div className="message-calculation-discount-code">
                {isSuccess === true ? <span>{t(message)}</span> : <span>{t(message)}</span>}
              </div>
            )}
            {discountList.length > 0 || discountCodeList.length > 0 ? (
              <div className="promotion-checkout-list" id="promotion-checkout-list-id">
                {discountList.length > 0 && (
                  <div className="store-promotion">
                    <h3>{pageData.storePromotion}</h3>
                    <div className="store-promotion-list">
                      {discountList?.map((item, index) => {
                        return (
                          <DiscountCodeCard
                            data={item}
                            isShowRedeem={false}
                            isHomepage={true}
                            isActive={true}
                            isCheckOutPage={true}
                            hiddenDiscount={hiddenDiscount}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {discountCodeList.length > 0 && (
                  <div className="my-voucher">
                    <h3>{pageData.discountCode}</h3>
                    <div className="my-voucher-list">
                      {discountCodeList?.map((item, index) => {
                        return (
                          <DiscountCodeCard
                            data={item}
                            colorConfig={colorGroup}
                            isShowRedeem={false}
                            isHomepage={false}
                            onClickRedeem={false}
                            isCheckOutPage={true}
                            onClickUse={onClickUse}
                            isActive={discountCodes?.some((discountCode) => discountCode === item?.code)}
                            isApply={item?.isApply ?? true}
                            hiddenDiscount={hiddenDiscount}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-promotion-checkout">
                <NoPromotionCheckoutIcon />
              </div>
            )}
          </div>
        </StyledPromotionDialogList>
      </>
    );
  };

  return isMaxWidth575 ? (
    <Drawer
      className="drawer-checkout-discount drawer-container"
      placement="bottom"
      open={visible && !isHiddenDiscount}
      onClose={onCancel}
      destroyOnClose={true}
      closable={false}
      height={"85%"}
      zIndex={1001}
      footer={(null, null)}
      title={
        <div className="box-title-promotion">
          <div className="title-promotion">{pageData.myVoucher}</div>
          <div className="icon-promotion" onClick={onCancel}>
            <CloseIcon />
          </div>
        </div>
      }
    >
      {divContent()}
    </Drawer>
  ) : (
    <Modal
      closable={true}
      className="promotion-checkout-modal"
      onCancel={onCancel}
      open={visible && !isHiddenDiscount}
      footer={true}
      centered
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      {divContent()}
    </Modal>
  );
}
