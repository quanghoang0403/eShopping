import { Col, Row, Switch, Tooltip } from "antd";
import PromotionPopover from "../PromotionPopover";
import {
  Container,
  InnerHtml,
  PromotionCheck,
  PromotionDescription,
  PromotionOption,
  PromotionSwitch,
  TitleSetting,
  WrapperConfig,
  WrapperExample,
} from "./styled";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import parse from 'html-react-parser'
import { PromotionConfigType } from "themes/constants/enums";
import promotionConfigDataService from "data-services/promotion-config/promotion-config-data.service";

const PromotionConfig = (props) => {
  const { open, onCancel, config } = props;
  const [t] = useTranslation();
  const [isApplyProduct, setIsApplyProduct] = useState();
  const [isApplyOrder, setIsApplyOrder] = useState();
  const [isDiscountCombined, setIsDiscountCombined] = useState();

  const pageData = {
    title: t("promotion.promotionSetting.title"),
    promotionType: t("promotion.promotionSetting.promotionType"),
    applyByProduct: t("promotion.promotionSetting.applyByProduct"),
    noteApplyByProduct: t("promotion.promotionSetting.noteApplyByProduct"),
    applyByOrder: t("promotion.promotionSetting.applyByOrder"),
    noteApplyByOrder: t("promotion.promotionSetting.noteApplyByOrder"),
    multistagePromotion: t("promotion.promotionSetting.multistagePromotion"),
    applyMultiStage: t("promotion.promotionSetting.applyMultiStage"),
    noteApplyMultiStageProduct: t("promotion.promotionSetting.noteApplyMultiStageProduct"),
    exampleProduct: t("promotion.promotionSetting.exampleProduct"),
    exampleOrder: t("promotion.promotionSetting.exampleOrder"),
    exampleCombined: t("promotion.promotionSetting.exampleCombined"),
  };

  useEffect(() => {
    if (config) {
      setIsApplyProduct(config?.isApplyProduct);
      setIsApplyOrder(config?.isApplyOrder);
      setIsDiscountCombined(config?.isDiscountCombined);
    }
  }, [config]);

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const handleChangeConfig = async (checked, configType) => {
    let payload = { isApplyProduct, isApplyOrder, isDiscountCombined };
    switch (configType) {
      case PromotionConfigType.PRODUCT:
        payload = {
          ...payload,
          isApplyProduct: checked,
        };
        setIsApplyProduct(checked);
        break;
      case PromotionConfigType.ORDER:
        payload = {
          ...payload,
          isApplyOrder: checked,
        };
        setIsApplyOrder(checked);
        break;
      case PromotionConfigType.COMBINED:
        payload = {
          ...payload,
          isDiscountCombined: checked,
        };
        setIsDiscountCombined(checked);
        break;
      default:
        break;
    }
    await promotionConfigDataService.updatePromotionConfigAsync(payload);
  };

  const renderExample = () => {
    let exampleType = "";
    if (isApplyProduct && isApplyOrder) {
      exampleType = pageData.exampleCombined
    } else if (isApplyProduct) {
      exampleType = pageData.exampleProduct
    } else if (isApplyOrder) {
      exampleType = pageData.exampleOrder
    }

    return parse(exampleType, {
      replace(domNode) {
        if (domNode.attribs && domNode?.name === "tooltip" && domNode.attribs?.title) {
          return (
            <Tooltip placement="topRight" title={domNode.attribs.title}>
              <u className={domNode.attribs?.class || ""}>{domNode?.children?.[0]?.data || ""}</u>
            </Tooltip>
          );
        }
      },
    });
  };

  return (
    <PromotionPopover open={open} title={pageData.title} onCancel={handleCancel}>
      <Container>
        <Row gutter={24}>
          <Col xs={24} sm={11} md={11} lg={11} xl={8} xxl={8}>
            <WrapperConfig>
              <TitleSetting>{pageData.promotionType}</TitleSetting>
              <PromotionCheck>
                <PromotionOption
                  checked={isApplyProduct}
                  onChange={(event) => handleChangeConfig(event?.target?.checked, PromotionConfigType.PRODUCT)}
                >
                  {pageData.applyByProduct}
                </PromotionOption>
                <PromotionDescription>{pageData.noteApplyByProduct}</PromotionDescription>
              </PromotionCheck>
              <PromotionCheck>
                <PromotionOption
                  checked={isApplyOrder}
                  onChange={(event) => handleChangeConfig(event?.target?.checked, PromotionConfigType.ORDER)}
                >
                  {pageData.applyByOrder}
                </PromotionOption>
                <PromotionDescription>{pageData.noteApplyByOrder}</PromotionDescription>
              </PromotionCheck>
              <TitleSetting>{pageData.multistagePromotion}</TitleSetting>
              <PromotionCheck>
                <PromotionSwitch>
                  <Switch
                    checked={isDiscountCombined}
                    onChange={(checked) => handleChangeConfig(checked, PromotionConfigType.COMBINED)}
                  />
                  <span>{pageData.applyMultiStage}</span>
                </PromotionSwitch>
                <PromotionDescription>{pageData.noteApplyMultiStageProduct}</PromotionDescription>
              </PromotionCheck>
            </WrapperConfig>
          </Col>
          <Col xs={24} sm={13} md={13} lg={13} xl={16} xxl={16}>
            <WrapperExample>
              <InnerHtml>{renderExample()}</InnerHtml>
            </WrapperExample>
          </Col>
        </Row>
      </Container>
    </PromotionPopover>
  );
};

export default PromotionConfig;
