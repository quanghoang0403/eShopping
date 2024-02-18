import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import { CancelButton } from "components/cancel-button";
import FnbFroalaEditor from "components/fnb-froala-editor";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import { CloseModalIcon } from "constants/icons.constants";
import { SizeScreen } from "constants/size-screen.constants";
import areaDataService from "data-services/area/area-data.service";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useWindowDimensions from "utils/check-screen";
import { getValidationMessages } from "utils/helpers";
import "./create-new-area.component.scss";
import { LockMultipleCalls } from "themes/services/promotion.services";

export default function AddNewArea(props) {
  const [t] = useTranslation();
  const { isModalVisible, handleCancel, storeBranchId } = props;
  const [form] = Form.useForm();
  const imageRef = useRef(null);
  const checkScreen = useWindowDimensions();
  const widthModal = checkScreen === SizeScreen.IS_TABLET ? 984 : 1336;
  const [image, setImage] = useState(null);
  const [descriptionArea, setDescriptionArea] = useState("");

  const pageData = {
    area: t("area.area"),
    addNewArea: t("area.addNewArea"),
    areaName: t("area.areaName"),
    image: t("area.image"),
    areaNameMaxLength: 100,
    description: t("form.description"),
    descriptionMaxLength: 2000,
    cancel: t("button.cancel"),
    addNew: t("button.addNew"),
    add: t("button.add"),
    enterAreaName: t("area.enterAreaName"),
    pleaseEnterAreaName: t("area.pleaseEnterAreaName"),
    areaAddedSuccessfully: t("area.areaAddedSuccessfully"),
    areaAddedUnSuccessfully: t("area.areaAddedUnSuccessfully"),
    upload: {
      addFile: t("upload.addFile"),
      addFromUrl: t("upload.addFromUrl"),
    },
  };

  useEffect(() => {
    form.setFieldsValue({
      storeBranchId: storeBranchId,
    });
  });

  const [formDataChanged, setFormDataChanged] = useState(false);

  const onCancelAfterConfirm = async () => {
    resetImage();
    setFormDataChanged(false);
    setDescriptionArea(null);
    await form.resetFields();
    handleCancel();
  };

  const onFinish = async (values) => {
    values.imageUrl = image?.url;
    var req = { ...values, shortDescription: values?.description?.replace(/<.*?>/gm, "").slice(0, 200) };
    setFormDataChanged(false);
    LockMultipleCalls(
      async () => {
        const res = await areaDataService.createAreaManagementAsync(req);
        if (res?.succeeded) {
          form.resetFields();        
          resetImage();
          message.success(pageData.areaAddedSuccessfully);
          handleCancel(storeBranchId);
        } else {
          if (res?.message) {
            message.error(t(res?.message));
          } else {
            message.success(pageData.areaAddedUnSuccessfully);
          }
        }
      },
      "Lock_createNewArea",
      1000,
    );
  };

  const onUploadImage = (file) => {
    setFormDataChanged(true);
    setImage(file);
  };

  const resetImage = () => {
    setImage(null);
    imageRef.current.setImage(null);
  };

  const renderInputImage = () => {
    return (
      <Col xl={7} md={7} xs={24} className="w-100">
        <Row className="w-100">
          <h3>{t(pageData.image)}</h3>
          <Col span={24}>
            <div className={`add-area-images w-100 ${image == null ? "" : "border-none"}`}>
              <div className={"input-area-images d-flex"}>
                <FnbUploadImageComponent buttonText={pageData.upload.addFile} onChange={onUploadImage} ref={imageRef} />
                <a className="upload-image-url" hidden={image !== null ? true : false}>
                  {pageData.upload.addFromUrl}
                </a>
              </div>
              {image === null ? (
                <p className="text-accept-image">Accepts images: .JPG, .PNG, .JPG2000, .GIF...</p>
              ) : null}
            </div>
          </Col>
        </Row>
      </Col>
    );
  };

  return (
    <Modal
      className="modal-add-area"
      title={pageData.addNewArea}
      closeIcon={
        checkScreen === SizeScreen.IS_MOBILE ? (
          <div className="close-modal-icon" onClick={() => onCancelAfterConfirm()}>
            <CloseModalIcon width={16} height={16} />
          </div>
        ) : (
          <></>
        )
      }
      open={isModalVisible}
      footer={(null, null)}
      centered
      width={widthModal}
    >
      <Form
        autoComplete="off"
        form={form}
        name="basic"
        onFinish={onFinish}
        onKeyDown={(event) => {
          if (event.keyCode === 13 || event.key === "Enter") event.preventDefault();
        }}
        onFieldsChange={() => {
          if (formDataChanged === false) {
            setFormDataChanged(true);
          }
        }}
      >
        <Row gutter={16}>
          {checkScreen === SizeScreen.IS_MOBILE ? renderInputImage() : null}
          <Col xl={17} md={17} xs={24} className="container-input">
            <Row>
              <Col span={24}>
                <h3>
                  {pageData.areaName}
                  <span style={{ color: "red" }}>*</span>
                </h3>
              </Col>
              <Col span={24}>
                <Form.Item name="storeBranchId" className="d-none">
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: pageData.pleaseEnterAreaName,
                    },
                  ]}
                >
                  <FnbInput showCount placeholder={pageData.enterAreaName} maxLength={pageData.areaNameMaxLength} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h3>{pageData.description}</h3>
              </Col>
              <Col span={24}>
                <Form.Item name="description">
                  <FnbFroalaEditor
                    value={descriptionArea}
                    onChange={(value) => {
                      if (value !== "" && value !== "<div></div>");
                      setDescriptionArea(value);
                    }}
                    charCounterMax={-1}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          {checkScreen !== SizeScreen.IS_MOBILE ? renderInputImage() : null}
        </Row>
        <Row className="float-center justify-content-center">
          <CancelButton
            buttonText={pageData.cancel}
            className="mr-1 width-100 button-cancel-addnew"
            key="back"
            showWarning={formDataChanged}
            onOk={onCancelAfterConfirm}
          />
          <Button
            className="button-add-new"
            type="primary"
            htmlType="submit"
            style={
              formDataChanged === false
                ? { backgroundColor: "rgba(255, 140, 33, 0.5)" }
                : { backgroundColor: "#FF8C21" }
            }
            disabled={!formDataChanged}
          >
            {pageData.add}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
}
