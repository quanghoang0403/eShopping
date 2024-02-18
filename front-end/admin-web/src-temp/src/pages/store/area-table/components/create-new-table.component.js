import { Button, Col, Form, InputNumber, Modal, Row, message } from "antd";
import { CancelButton } from "components/cancel-button";
import FnbFroalaEditor from "components/fnb-froala-editor";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import { TableName } from "constants/areaTable.constants";
import { CloseModalIcon } from "constants/icons.constants";
import { SizeScreen } from "constants/size-screen.constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useWindowDimensions from "utils/check-screen";
import { checkOnKeyPressValidation } from "utils/helpers";
import "./create-new-table.component.scss";
import { LockMultipleCalls } from "themes/services/promotion.services";

export default function AddNewAreaTable(props) {
  const { isModalVisible, listArea, onCancel, areaTableDataService } = props;
  const [form] = Form.useForm();
  const [t] = useTranslation();
  const [image, setImage] = useState(null);
  const [descriptionAreaTable, setDescriptionAreaTable] = useState("");
  const [formDataChanged, setFormDataChanged] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const imageRef = useRef(null);

  const checkScreen = useWindowDimensions();
  const widthModal = checkScreen === SizeScreen.IS_TABLET ? 984 : 1336;

  const pageData = {
    titleAddNewTable: t("areaTable.tableForm.titleAddNewTable"),
    areaName: t("areaTable.areaForm.areaName"),
    selectArea: t("areaTable.areaForm.selectArea"),
    pleaseSelectArea: t("areaTable.areaForm.pleaseSelectArea"),
    addtable: t("areaTable.tableForm.addtable"),
    nameTable: t("areaTable.tableForm.nameTable"),
    nameTableRequired: t("areaTable.tableForm.nameTableIsRequired"),
    namePlaceholder: t("areaTable.tableForm.namePlaceholder"),
    numberOfSeat: t("areaTable.seat"),
    validNumberSeat: t("areaTable.tableForm.validNumberSeat"),
    addNew: t("button.addNew"),
    cancel: t("button.cancel"),
    createTableSuccess: t("messages.createTableSuccess"),
    createTableUnSuccess: t("messages.createTableUnSuccess"),
    description: t("form.description"),
    max: 999999999,
    image: t("areaTable.image"),
    upload: {
      addFile: t("upload.addFile"),
      addFromUrl: t("upload.addFromUrl"),
    },
    tableNameMaxLength: 50,
  };

  useEffect(() => {
    if (listArea?.length > 0) {
      onChange(listArea[0]?.id);
    } else {
      setSelectedArea(null);
    }
  }, [listArea]);

  const onFinish = async () => {
    setFormDataChanged(false);
    var formValue = form.getFieldsValue();
    formValue.imageUrl = image?.url;
    let req = {
      ...formValue,
      areaId: selectedArea,
      shortDescription: descriptionAreaTable?.replace(/<.*?>/gm, "")?.slice(0, 200),
    };
    LockMultipleCalls(
      async () => {
        const res = await areaTableDataService.createAreaTableByAreaIdAsync(req);
        if (res?.succeeded) {
          message.success(pageData.createTableSuccess);
          handleCancelAndResetForm();
        } else {
          if (res?.message) {
            message.error(t(res?.message));
          } else {
            message.success(pageData.createTableUnSuccess);
          }
        }
      },
      "Lock_createNewTable",
      1000,
    );
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

  const handleCancelAndResetForm = () => {
    setFormDataChanged(false);
    setDescriptionAreaTable(null);
    imageRef.current.setImage(null);
    setImage(null);
    form.resetFields();
    onCancel();
  };

  const onUploadImage = (file) => {
    setFormDataChanged(true);
    setImage(file);
  };

  const renderInputImage = () => {
    return (
      <Col xl={7} md={7} xs={24}>
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
      title={pageData.titleAddNewTable}
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
            <Row>
              <h3>
                {pageData.nameTable}
                <span style={{ color: "red" }}>*</span>
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
                />
              </Form.Item>
            </Row>
            <Row gutter={24} className="box-area-seat">
              <Col span={12} xl={12} md={12} xs={24} className="dropdown-area">
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
              <Col span={12} xl={12} md={12} xs={24} className="input-seat">
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
        <Row className="float-center justify-content-center">
          <CancelButton
            buttonText={pageData.cancel}
            className="mr-1 width-100 button-cancel-addnew"
            key="back"
            showWarning={formDataChanged}
            onOk={handleCancelAndResetForm}
          />
          <Button className="width-100" type="primary" htmlType="submit" disabled={!formDataChanged}>
            {pageData.addNew}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
}
