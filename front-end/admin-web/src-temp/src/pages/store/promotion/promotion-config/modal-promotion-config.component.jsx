import "./modal-promotion-config.style.scss";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { useTranslation } from "react-i18next";
import { Checkbox, Switch } from "antd";
import InstructionPromotionConfig from "./components/instruction-promotion-config.component";
import { useEffect, useState } from "react";
import promotionConfigDataService from "data-services/promotion-config/promotion-config-data.service";

function ModalPromotionConfig(props) {
  const { promotionConfig, visible, setVisible } = props;
  const [t] = useTranslation();
  const translatedData = {
    title: t("promotion.promotionSetting.title"),
    promotionType: t("promotion.promotionSetting.promotionType"),
    applyByProduct: t("promotion.promotionSetting.applyByProduct"),
    noteApplyByProduct: t("promotion.promotionSetting.noteApplyByProduct"),
    applyByOrder: t("promotion.promotionSetting.applyByOrder"),
    noteApplyByOrder: t("promotion.promotionSetting.noteApplyByOrder"),
    multistagePromotion: t("promotion.promotionSetting.multistagePromotion"),
    applyMultiStage: t("promotion.promotionSetting.applyMultiStage"),
    noteApplyMultiStageProduct: t("promotion.promotionSetting.noteApplyMultiStageProduct"),
    noteApplyMultiStageOrder: t("promotion.promotionSetting.noteApplyMultiStageOrder"),
    noteApplyMultiStageBoth: t("promotion.promotionSetting.noteApplyMultiStageBoth"),
  };

  useEffect(() => {
    if (promotionConfig) {
      setIsApplyProduct(promotionConfig.isApplyProduct);
      setIsApplyOrder(promotionConfig.isApplyOrder);
      setIsDiscountCombined(promotionConfig.isDiscountCombined);
    }
  }, [promotionConfig]);

  const [isApplyProduct, setIsApplyProduct] = useState(promotionConfig?.isApplyProduct);
  const [isApplyOrder, setIsApplyOrder] = useState(promotionConfig?.isApplyOrder);
  const [isDiscountCombined, setIsDiscountCombined] = useState(promotionConfig?.isDiscountCombined);
  const TYPE_CHANGE_CONFIG = {
    PRODUCT: "product",
    ORDER: "order",
    DISCOUNTCOMBINED: "discountcombined",
  };
  const onChangePromotionConfig = async (type) => {
    let payload = { isApplyProduct, isApplyOrder, isDiscountCombined };
    switch (type) {
      case TYPE_CHANGE_CONFIG.PRODUCT:
        payload = {
          ...payload,
          isApplyProduct: !isApplyProduct,
        };
        setIsApplyProduct(!isApplyProduct);
        break;
      case TYPE_CHANGE_CONFIG.ORDER:
        payload = {
          ...payload,
          isApplyOrder: !isApplyOrder,
        };
        setIsApplyOrder(!isApplyOrder);
        break;
      case TYPE_CHANGE_CONFIG.DISCOUNTCOMBINED:
        payload = {
          ...payload,
          isDiscountCombined: !isDiscountCombined,
        };
        setIsDiscountCombined(!isDiscountCombined);
        break;
      default:
        break;
    }

    await promotionConfigDataService.updatePromotionConfigAsync(payload);
  };

  const renderContentPromotionModal = () => {
    return (
      <div className="content-modal-promotion-setting">
        <div className="promotion-setting-item-area">
          <span className="promotion-setting-item-area__title-heading">{translatedData.promotionType}</span>
          <div className="promotion-setting-item-area__list-item">
            <div className="promotion-setting-item-area__item">
              <Checkbox
                checked={isApplyProduct}
                onChange={() => {
                  onChangePromotionConfig(TYPE_CHANGE_CONFIG.PRODUCT);
                }}
              />
              <div className="item-apply">
                <span className="item-apply__title"> {translatedData.applyByProduct}</span>
                <span className="item-apply__description">{translatedData.noteApplyByProduct}</span>
              </div>
            </div>
            <div className="promotion-setting-item-area__item">
              <Checkbox
                checked={isApplyOrder}
                onChange={() => {
                  onChangePromotionConfig(TYPE_CHANGE_CONFIG.ORDER);
                }}
              />
              <div className="item-apply">
                <span className="item-apply__title">{translatedData.applyByOrder}</span>
                <span className="item-apply__description">{translatedData.noteApplyByOrder}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="promotion-setting-item-area">
          <span className="promotion-setting-item-area__title-heading">{translatedData.multistagePromotion}</span>
          <div className="promotion-setting-item-area__list-item">
            <div className="promotion-setting-item-area__item">
              <Switch
                checked={isDiscountCombined}
                onChange={() => {
                  onChangePromotionConfig(TYPE_CHANGE_CONFIG.DISCOUNTCOMBINED);
                }}
              />
              <div className="item-apply">
                <span className="item-apply__title">{translatedData.applyMultiStage}</span>
                <span className="item-apply__description">
                  {isApplyProduct && !isApplyOrder ? (
                    translatedData.noteApplyMultiStageProduct
                  ) : !isApplyProduct && isApplyOrder ? (
                    translatedData.noteApplyMultiStageOrder
                  ) : isApplyProduct && isApplyOrder ? (
                    translatedData.noteApplyMultiStageBoth
                  ) : (
                    <></>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <InstructionPromotionConfig isApplyProduct={isApplyProduct} isApplyOrder={isApplyOrder} />
      </div>
    );
  };

  return (
    <FnbModal
      className="store-promotion-config"
      title={translatedData.title}
      visible={visible}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      handleCancel={() => setVisible(false)}
      content={renderContentPromotionModal()}
      centered={true}
    />
  );
}

export default ModalPromotionConfig;
