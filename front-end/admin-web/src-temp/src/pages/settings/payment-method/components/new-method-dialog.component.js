import { Col, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import "./new-method-dialog.component.scss";
import paymentDataService from "data-services/payment/payment-data.service";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";

export function NewMethodDialogComponent(props) {
    const { t } = useTranslation();
    const { handleCancel, handleSuccess, namePaymentMethods } = props;
    const [form] = Form.useForm();
    const fnbImageSelectRef = React.useRef();

    useEffect(() => {
    }, []);

    const pageData = {
        newMethod: t("payment.newMethod"),
        logo: t("payment.logo"),
        name: t("payment.name"),
        namePlaceholder: t("payment.namePlaceholder"),
        nameValidationRequirMessage: t("payment.nameValidationRequirMessage"),
        nameValidationUniqueMessage: t("payment.nameValidationUniqueMessage"),
        upload: {
            addFromUrl: t("material.addFromUrl"),
            uploadImage: t("material.addFile"),
            messageTooBigSize: t("payment.messageTooBigSize")
        },
        media: {
            textNonImage: t("media.textNonImage"),
        },
        button: {
            ignore: t("button.ignore"),
            add: t("button.add"),
        }
    }

    const onFinish = () => {
        form.validateFields().then(async (values) => {
            values.logo = fnbImageSelectRef.current.getImageUrl();
            values.IsActive = true;
            values.name = values.name.replace(/(\r\n|\n|\r)/gm, "");
            paymentDataService.createPersonalPaymentMethodRequest(values).then((success) => {
                if (success === true) {
                    message.success(t("payment.createSuccess", { method_name: values.name }));
                    form.resetFields();
                    handleSuccess();
                }
            });            
        })
    }; 
    const onClose = () => {
        handleCancel();
    };

    const renderContent = () => {
        return (
            <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
                <Col span={24}>
                    <h4 className="fnb-form-label">{pageData.logo}</h4>
                    <FnbImageSelectComponent
                        ref={fnbImageSelectRef}
                        messageTooBigSize={pageData.upload.messageTooBigSize}
                        customTextNonImageClass={"create-edit-product-text-non-image"}
                        customNonImageClass={"create-edit-product-non-image"}
                        isShowMessageError = {true}
                    />
                </Col>
                <Col span={24} className="mt-4">
                    <h4 className="fnb-form-label">
                        {pageData.name}
                        <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                            required: true,
                            message: pageData.nameValidationRequirMessage,
                            },
                            {
                                validator:  (_, value) => (namePaymentMethods?.some(name => name == value) ? Promise.reject() : Promise.resolve()),
                                message: pageData.nameValidationUniqueMessage
                            }
                        ]}
                        >
                        <Input
                            className="fnb-input-with-count"
                            showCount
                            maxLength={100}
                            placeholder={pageData.namePlaceholder}
                        />
                    </Form.Item>
                </Col>
            </Form>
        )
    };
    return (
        <FnbModal
          className="new-method-dialog-component"
          width={"100%"}
          title={pageData.newMethod}
          visible={props.isModalVisible}
          handleCancel={onClose}
          cancelText={pageData.button.ignore}
          okText={pageData.button.add}
          onOk={onFinish}
          closable={false}
          content={renderContent()}
        ></FnbModal>
      );
}