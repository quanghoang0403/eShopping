import { Button, Col, Form, InputNumber, Modal, Radio, Row, message } from "antd";
import { CancelButton } from "components/cancel-button";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import FnbFroalaEditor from "components/fnb-froala-editor";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import { ActivateStatus } from "constants/activate-status.constants";
import { TableName } from "constants/areaTable.constants";
import { CloseModalIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { SizeScreen } from "constants/size-screen.constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useWindowDimensions from "utils/check-screen";
import { checkOnKeyPressValidation } from "utils/helpers";
import "./edit-table.component.scss";

export default function EditAreaTable(props) {
  const { isModalVisible, listArea, storeBranchId, onCancel, areaTableDataService, handleDelete, selectedAreaTable } =
    props;
  const [form] = Form.useForm();
  const [t] = useTranslation();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initTableImage, setInitTableImage] = useState(null);
  const [descriptionAreaTable, setDescriptionAreaTable] = useState("");
  const [formDataChanged, setFormDataChanged] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const checkScreen = useWindowDimensions();
  const widthModal = checkScreen === SizeScreen.IS_TABLET ? 984 : 1336;

  const imageRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [id, setId] = useState(null);
  const [nameTable, setNameTable] = useState(null);

  const pageData = {
    active: t("status.active"),
    inActive: t("status.inactive"),
    titleUpdateTable: t("areaTable.tableForm.titleUpdateTable"),
    areaName: t("areaTable.areaForm.areaName"),
    selectArea: t("areaTable.areaForm.selectArea"),
    pleaseSelectArea: t("areaTable.areaForm.pleaseSelectArea"),
    updateTable: t("areaTable.tableForm.updateTable"),
    nameTable: t("areaTable.tableForm.nameTable"),
    namePlaceholder: t("areaTable.tableForm.namePlaceholder"),
    numberOfSeat: t("areaTable.seat"),
    validNumberSeat: t("areaTable.tableForm.validNumberSeat"),
    addNew: t("button.addNew"),
    update: t("button.update"),
    cancel: t("button.cancel"),
    updateTableSuccess: t("areaTable.updateTableSuccess"),
    updateTableFail: t("areaTable.updateTableFail"),
    status: t("areaTable.status"),
    max: 999999999,
    image: t("areaTable.image"),
    upload: {
      addFile: t("upload.addFile"),
      addFromUrl: t("upload.addFromUrl"),
    },
    update: t("button.update"),
    deActive: t("button.deactive"),
    delete: t("button.delete"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    tableNameMaxLength: 50,
    description: t("form.description"),
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    var req = {
      ...values,
      areaId: selectedArea,
      imageUrl: image?.url,
      isActive: isActive,
      shortDescription: values?.description?.replace(/<.*?>/gm, "").slice(0, 200),
    };
    const res = await areaTableDataService.updateAreaTableByAreaIdAsync(req);
    if (res) {
      message.success(pageData.updateTableSuccess);
    } else {
      message.error(pageData.updateTableFail);
    }
    setIsLoading(false);
    handleCancelAndResetForm();
  };

  useEffect(() => {
    getEditData(selectedAreaTable);
  }, [selectedAreaTable]);

  useEffect(() => {
    if (initTableImage != null) {
      setImage(initTableImage);
      imageRef.current?.setImage(initTableImage);
    }
  }, [initTableImage]);

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const getEditData = (data) => {
    if (data) {
      form.setFieldsValue({
        id: data?.id,
        storeBranchId: storeBranchId,
        areaId: data?.areaId,
        isActive: data?.isActive,
        name: data?.name,
        numberOfSeat: data?.numberOfSeat,
        description: data?.description,
        imageUrl: data?.imageUrl,
      });
      setId(data.id);
      setIsActive(data?.isActive);
      setSelectedArea(data?.areaId);
      setDescriptionAreaTable(data?.description);
      setNameTable(data?.name);
      if (data?.imageUrl) {
        setInitTableImage(data?.imageUrl);
      } else {
        setInitTableImage(null);
      }
    }
  };

  const handleCancelAndResetForm = () => {
    setIsLoading(false);
    setFormDataChanged(false);
    setInitTableImage(null);
    setImage(null);
    imageRef.current.setImage(null);
    form.resetFields();
    onCancel();
  };

  const onUploadImage = (file) => {
    setFormDataChanged(true);
    setImage(file);
  };

  const onHandleDelete = async () => {
    await setFormDataChanged(false);
    handleDelete(id);
  };

  const onChange = (id) => {
    let area = listArea.find((area) => area.id === id);
    let count = area?.areaTables?.length ?? 0;
    var name = `${TableName} ${count + 1}`;
    form.setFieldsValue({
      name: name,
      areaId: id,
    });
    setSelectedArea(id);
  };

  const renderInputImage = () => {
    return (
      <Col xl={7} md={7} xs={24} className="w-100">
        <Row>
          <h3>{pageData.image}</h3>

          <Col span={24}>
            <div className={`add-area-images ${image == null ? "" : "border-none"}`}>
              <div className="input-area-images">
                <FnbUploadImageComponent buttonText={pageData.upload.addFile} onChange={onUploadImage} ref={imageRef} />
                <a className="upload-image-url" hidden={image !== null ? true : false}>
                  {pageData.upload.addFromUrl}
                </a>
              </div>
              {image === null ? <p>Accepts images: .JPG, .PNG, .JPG2000, .GIF...</p> : null}
            </div>
          </Col>
        </Row>
      </Col>
    );
  };

  return (
    <Modal
      className="modal-add-table"
      title={pageData.titleUpdateTable}
      closeIcon={
        checkScreen === SizeScreen.IS_MOBILE ? (
          <div className="close-modal-icon" onClick={() => handleCancelAndResetForm()}>
            <CloseModalIcon width={16} height={16} />
          </div>
        ) : (
          <></>
        )
      }
      open={isModalVisible}
      footer={(null, null)}
      width={widthModal}
    >
      <Form
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
              <Col span={12} xs={24} md={12} xl={12}>
                <h3>
                  {pageData.nameTable} <span style={{ color: "red" }}>*</span>
                </h3>
                <Form.Item
                  name={"name"}
                  rules={[
                    {
                      required: true,
                      message: pageData.nameTableRequired,
                    },
                  ]}
                  className="w-100"
                >
                  <FnbInput
                    showCount
                    className="w-100"
                    placeholder={pageData.namePlaceholder}
                    maxLength={pageData.tableNameMaxLength}
                    onChange={(text) => setNameTable(text?.target?.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12} xs={24} md={12} xl={12}>
                <Row>
                  <h3>{pageData.status}</h3>
                </Row>
                <Form.Item name="isActive" className="checkbox-status">
                  <Radio.Group onChange={(e) => setIsActive(e.target.value)} value={isActive}>
                    <Radio value={ActivateStatus.Activate}>{pageData.active}</Radio>
                    <Radio value={ActivateStatus.Deactivate}>{pageData.deActive}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} className="box-area-seat">
              <Col span={12} xs={24} md={12} xl={12} className="dropdown-area">
                <h3>
                  {pageData.areaName}
                  <span style={{ color: "red" }}>*</span>
                </h3>
                <Form.Item name={"areaId"} className="w-100">
                  <FnbSelectSingle
                    option={listArea?.map((item) => ({
                      id: item.id,
                      name: item.name,
                    }))}
                    onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12} xs={24} md={12} xl={12} className="input-seat">
                <Row>
                  <h3>
                    {pageData.numberOfSeat}
                    <span style={{ color: "red" }}>*</span>
                  </h3>
                </Row>
                <Form.Item
                  name={"numberOfSeat"}
                  rules={[
                    {
                      validator(rule, value) {
                        if (value == null || value == undefined || value < 1) {
                          return Promise.reject(new Error(pageData.validNumberSeat));
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                  className="w-100"
                >
                  <InputNumber
                    id="minQuantity"
                    className="w-100 fnb-input-number"
                    placeholder={pageData.numberOfSeat}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    onKeyPress={(event) => {
                      const checkValidKey = checkOnKeyPressValidation(event, "minQuantity", 0, pageData.max, 0);
                      if (!checkValidKey) event.preventDefault();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h3>{pageData.description}</h3>
              </Col>
              <Col span={24}>
                <Form.Item name={"description"}>
                  <FnbFroalaEditor
                    value={descriptionAreaTable}
                    onChange={(value) => {
                      if (value !== "" && value !== "<div></div>");
                      setDescriptionAreaTable(value);
                    }}
                    charCounterMax={-1}
                    heightMin={270}
                    heightMax={270}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          {checkScreen !== SizeScreen.IS_MOBILE ? renderInputImage() : null}
        </Row>
        <Row className="float-center justify-content-center  m-0">
          <div className="d-flex flex-wrap text-white">
            <div class="p-2 flex-fill">
              <DeleteConfirmComponent
                buttonText={pageData.delete}
                buttonType={"NotIcon"}
                title={pageData.confirmDelete}
                content={formatDeleteMessage(nameTable)}
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
                onOk={handleCancelAndResetForm}
              />
            </div>
            <div class="p-2 flex-fill">
              <Button
                className="btnEdit"
                style={{ minWidth: "60px", minHeight: "60px" }}
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={!formDataChanged}
              >
                {pageData.update}
              </Button>
            </div>
          </div>
        </Row>

        <Form.Item name="storeBranchId" hidden="true"></Form.Item>
        <Form.Item name={"id"} hidden="true"></Form.Item>
      </Form>
    </Modal>
  );
}
