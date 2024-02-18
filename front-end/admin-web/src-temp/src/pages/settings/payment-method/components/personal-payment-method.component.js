import { Button, Col, Form, Input, Row, message, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./new-method-dialog.component.scss";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { CancelButton } from "components/cancel-button";
import "./personal-payment-method.component.scss";
import paymentDataService from "data-services/payment/payment-data.service";

export function PersonalPaymentConfigComponent(props) {
    const { t } = useTranslation();
    const { onCompleted, initData, namePaymentMethods } = props;
    const [form] = Form.useForm();
    const fnbImageSelectRef = React.useRef();
    const [isChangeForm, setIsChangeForm] = useState(false);
    const maxLengthNamePersonalMethod = 60;

    useEffect(() => {
        if (initData) {
            loadPaymentMethod(initData);
        }
    }, [initData]);

    const loadPaymentMethod = (data) => {
        setIsChangeForm(false);
        form.setFieldsValue(data);
        /// Update image
        fnbImageSelectRef.current.setImageUrl(data.logo);
    }

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
            update: t("button.update"),
            cancel: t("button.cancel"),
        },
        personalUpdateSuccess: t("payment.personalUpdateSuccess"),
    }

    const onFinish = () => {
        form.validateFields().then(async (values) => {
            const personalPaymentMethod = {
                name: values.name.replace(/(\r\n|\n|\r)/gm, ""),
                logo: fnbImageSelectRef.current.getImageUrl()
            }
            paymentDataService.updatePersonalPaymentMethodAsync(initData.id, personalPaymentMethod).then((success) => {
                if (success === true) {
                    message.success(pageData.personalUpdateSuccess);
                    setIsChangeForm(false);
                    onCompleted();
                }
            });
        })
    }; 

    const onCancel = () => {
        loadPaymentMethod(initData);
    };

    const onFormChanged = () => {
        setIsChangeForm(true);
    };

    const onChangeImage = () => {
        setIsChangeForm(true);
    }

    return (
        <Form className="personal-payment-config" form={form} layout="vertical" autoComplete="off" onFieldsChange={(e) => { onFormChanged(); }} disabled={!initData?.isActive}>
            <Col span={24} className="component-title mb-4">
                {initData?.name?.length > maxLengthNamePersonalMethod ?
                    <Tooltip placement="topLeft" className="custom-width-tooltip" title={t(initData?.name)}>
                        <h1 className="title method-title">{initData?.name}</h1>   
                    </Tooltip> :
                    <h1 className="title method-title">{initData?.name}</h1>}                          
                {isChangeForm && 
                    <Row className="list-button">
                        <CancelButton onOk={() => onCancel()} className="action-cancel">
                        </CancelButton>
                        <Button type="primary" htmlType="submit" onClick={() => onFinish()}>
                            {pageData.button.update}
                        </Button>
                    </Row>  
                }
            </Col>
            <Col span={24}>
                <h4 className="fnb-form-label">{pageData.logo}</h4>
                <Form.Item name="logo" className="select-logo">
                    <FnbImageSelectComponent
                        ref={fnbImageSelectRef}
                        customTextNonImageClass={"create-edit-product-text-non-image"}
                        customNonImageClass={"create-edit-product-non-image"}
                        messageTooBigSize={pageData.upload.messageTooBigSize}
                        onChange={() => onChangeImage()}
                        isDisabled = {!initData?.isActive}
                        className = {initData?.isActive ? "" : "disable"}
                        isShowMessageError = {true}
                    />
                </Form.Item>
            </Col>
            <Col span={24}>
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
                            validator:  (_, value) => (namePaymentMethods.some(name => name == value) ? Promise.reject() : Promise.resolve()),
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
}