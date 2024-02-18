import { Col, Form, Input, Modal, Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastMessageType } from "../../../../../constants/toast-message.constants";
import { store } from "../../../../../modules";
import { setToastMessage } from "../../../../../modules/session/session.actions";
import { useAppCtx } from "../../../../../providers/app.provider";
import posCartService from "../../../../../services/pos/pos-cart.services";
import { EnumDiscountCodeResponseCode } from "../../../../constants/enums";
import "./DiscountCodeDialog.scss";

function DiscountCodeDialog(props) {
  const { t } = useTranslation();
  const { Toast, fontFamily } = useAppCtx();
  const { isVisible = false, onCancel, className, title, posDiscountCodes } = props;
  const discountCodeFieldName = "discountCode";
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message !== "") {
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [message]);

  function handleCancel() {
    form.setFieldValue(discountCodeFieldName, "");
    if (onCancel) {
      onCancel();
    }
  }

  async function onApply() {
    const code = form.getFieldValue(discountCodeFieldName)?.toUpperCase()?.trim();
    if (code) {
      try {
        const reponse = await posCartService.verifyDisCountCodeAsync(code);
        const responseCode = reponse?.discountCodeResult?.responseCode;
        if (
          responseCode === EnumDiscountCodeResponseCode.Success ||
          responseCode === EnumDiscountCodeResponseCode.MinimumPurchaseValue ||
          responseCode === EnumDiscountCodeResponseCode.Existed
        ) {
          if (posDiscountCodes?.includes(code)) {
            setMessage(t("promotion.discountCode.description.existed", "Mã giảm giá đã tồn tại."));
          } else {
            posCartService.addDiscountCode(code);
            handleCancel();
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
          setMessage(t(reponse?.discountCodeResult?.responseMessage));
        }
      } catch (err) {}
    } else {
      setMessage(t("promotion.discountCode.description.notFound", "Mã giảm giá không hợp lệ. Vui lòng thử lại."));
    }
  }

  return (
    <Modal
      wrapClassName={className}
      closable={true}
      className="discount-code-dialog"
      title={title ?? t("checkOutPage.promotion", "Khuyến mãi")}
      open={isVisible}
      onCancel={handleCancel}
      footer={false}
      getPopupContainer={(trigger) => trigger.parentNode}
      style={{ fontFamily: fontFamily }}
    >
      <Row className="discount-code-dialog-body" wrap={false}>
        <Col flex={"auto"} className="input-group">
          <Form form={form}>
            <Form.Item name={discountCodeFieldName}>
              <Input
                className="discount-code-input"
                type="text"
                placeholder={t("checkOutPage.placeHolderPromotion", "Nhập mã giảm giá của bạn")}
              />
            </Form.Item>
          </Form>
          <div className="message">{message}</div>
        </Col>
        <Col flex={"no"} className="apply-button" onClick={onApply}>
          {t("loyaltyPoint.apply", "Áp dụng")}
        </Col>
      </Row>
    </Modal>
  );
}

export default DiscountCodeDialog;
