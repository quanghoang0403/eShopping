import { Button, Col, Form, Input, Modal, Radio, Row, message } from "antd";
import { CancelButton } from "components/cancel-button";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import FnbFroalaEditor from "components/fnb-froala-editor";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import { ActivateStatus } from "constants/activate-status.constants";
import { CloseModalIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { SizeScreen } from "constants/size-screen.constants";
import areaDataService from "data-services/area/area-data.service";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useWindowDimensions from "utils/check-screen";
import "./edit-area.component.scss";

export const EditAreaComponent = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { isModalVisible, handleCancel, storeBranchId, handleDelete } = props;
  const [form] = Form.useForm();
  const imageRef = useRef(null);

  const checkScreen = useWindowDimensions();
  const widthModal = checkScreen === SizeScreen.IS_TABLET ? 984 : 1336;

  const pageData = {
    active: t("status.active"),
    inActive: t("status.inactive"),
    area: t("area.area"),
    image: t("area.image"),
    status: t("area.status"),
    updateArea: t("area.updateArea"),
    areaName: t("area.areaName"),
    areaNameMaxLength: 100,
    description: t("form.description"),
    descriptionMaxLength: 2000,
    cancel: t("button.cancel"),
    save: t("button.save"),
    enterAreaName: t("area.enterAreaName"),
    pleaseEnterAreaName: t("area.pleaseEnterAreaName"),
    areaUpdatedSuccessfully: t("area.areaUpdatedSuccessfully"),
    areaUpdatedUnSuccessfully: t("area.areaUpdatedUnSuccessfully"),
    upload: {
      addFile: t("upload.addFile"),
      addFromUrl: t("upload.addFromUrl"),
    },
    update: t("button.update"),
    deActive: t("button.deactive"),
    delete: t("button.delete"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
  };

  useImperativeHandle(ref, () => ({
    initData(recordId) {
      form.setFieldsValue({
        storeBranchId: storeBranchId,
      });
      setInitData(recordId);
    },
  }));

  const [image, setImage] = useState(null);
  const [descriptionArea, setDescriptionArea] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [formDataChanged, setFormDataChanged] = useState(false);

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const setInitData = (recordId) => {
    let request = {
      id: recordId,
      storeBranchId: storeBranchId,
    };
    areaDataService.getAreaByIdAsync(request).then((res) => {
      if (res.area) {
        const { id, description, name, isActive, imageUrl } = res.area;
        const formValues = {
          id: id,
          name: name,
          description: description ?? "",
          isActive: isActive,
        };
        setIsActive(isActive);
        setId(id);
        setName(name);
        setDescriptionArea(description ?? "");
        form.setFieldsValue(formValues);
        if (imageUrl) {
          setImage({ url: imageUrl });
          imageRef.current.setImage(imageUrl);
        } else {
          setImage(null);
          imageRef.current.setImage(null);
        }
      } else {
        form.resetFields();
        setIsActive(false);
        setId(0);
        setName("name");
        setDescriptionArea("");
      }
    });
  };

  const onFinish = async (values) => {
    message.destroy();
    values.imageUrl = image?.url;
    values.isActive = isActive;
    var req = { ...values, shortDescription: values?.description?.replace(/<.*?>/gm, "").slice(0, 200) };
    let res = await areaDataService.updateAreaAsync(req);
    if (res?.succeeded) {
      form.resetFields();
      message.success(pageData.areaUpdatedSuccessfully);
      handleCancel(storeBranchId);
    } else {
      if (res?.message) {
        message.error(t(res?.message));
      } else {
        message.success(pageData.areaUpdatedUnSuccessfully);
      }
    }
  };

  const onUploadImage = (file) => {
    setFormDataChanged(true);
    setImage(file);
  };

  const onHandleDelete = async () => {
    await setFormDataChanged(false);
    handleDelete(id);
  };

  const onCancelAfterConfirm = async () => {
    setFormDataChanged(false);
    await form.resetFields();
    resetImage();
    handleCancel();
  };

  const resetImage = () => {
    setImage(null);
    imageRef.current.setImage(null);
  };

  const renderInputImage = () => {
    return (
      <Col xl={7} md={7} xs={24} className="w-100">
        <Row>
          <h3>{t(pageData.image)}</h3>
          <Col span={24}>
            <div className={`add-area-images ${image == null ? "" : "border-none"}`}>
              <div className="input-area-images">
                <FnbUploadImageComponent buttonText={pageData.upload.addFile} ref={imageRef} onChange={onUploadImage} />
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
      title={pageData.updateArea}
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
        onFieldsChange={() => {
          if (formDataChanged === false) {
            setFormDataChanged(true);
          }
        }}
      >
        <Row gutter={16}>
          {checkScreen === SizeScreen.IS_MOBILE ? renderInputImage() : null}
          <Col xl={17} md={17} xs={24} className="container-input">
            <Row gutter={32}>
              <Col span={12} md={12} xs={24}>
                <h3>
                  {pageData.areaName} <span style={{ color: "red" }}>*</span>
                </h3>
                <Form.Item name="id" className="d-none">
                  <Input type="hidden" />
                </Form.Item>
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
              <Col span={12} md={12} xs={24}>
                <Row>
                  <h3>{pageData.status}</h3>
                </Row>
                <Form.Item name="id" className="d-none">
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name="storeBranchId" className="d-none">
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name="isActive" className="checkbox-status">
                  <Radio.Group onChange={(e) => setIsActive(e.target.value)} value={isActive}>
                    <Radio value={ActivateStatus.Activate}>{pageData.active}</Radio>
                    <Radio value={ActivateStatus.Deactivate}>{pageData.deActive}</Radio>
                  </Radio.Group>
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
          <div className="d-flex flex-wrap text-white justify-content-center">
            <div class="p-2 flex-fill">
              <DeleteConfirmComponent
                buttonText={pageData.delete}
                buttonType={"NotIcon"}
                title={pageData.confirmDelete}
                content={formatDeleteMessage(name)}
                okText={pageData.btnDelete}
                className={"delete-button"}
                cancelText={pageData.btnIgnore}
                permission={PermissionKeys.DELETE_AREA_TABLE}
                cancelButtonProps={{
                  style: { border: "none !important", color: "none !important" },
                }}
                onOk={onHandleDelete}
              />
            </div>
            <div class="p-2 flex-fill">
              <CancelButton
                buttonText={pageData.cancel}
                className="mr-1 width-100 btnCancel"
                key="back"
                showWarning={formDataChanged}
                onOk={onCancelAfterConfirm}
              />
            </div>
            <div class="p-2 flex-fill">
              <Button
                className="btnEdit"
                style={{ minWidth: "60px", minHeight: "60px" }}
                type="primary"
                htmlType="submit"
                disabled={!formDataChanged}
              >
                {pageData.update}
              </Button>
            </div>
          </div>
        </Row>
      </Form>
    </Modal>
  );
});
