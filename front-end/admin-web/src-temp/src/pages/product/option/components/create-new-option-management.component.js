import { Button, Card, Col, Form, Input, InputNumber, Modal, Radio, Row, message } from "antd";
import DialogTitle from "components/dialog-title";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTrashFillIcon } from "components/fnb-trash-fill-icon/fnb-trash-fill-icon";
import { inputNumberRange0To100 } from "constants/default.constants";
import { PlusOrangeIcon } from "constants/icons.constants";
import materialDataService from "data-services/material/material-data.service";
import optionDataService from "data-services/option/option-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getValidationMessages } from "utils/helpers";

const setDefaultData = [
  {
    name: "",
    setDefault: true,
  },
];

export default function CreateNewOptionManagement(props) {
  const { handleCancel } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const [listMaterial, setListMaterial] = useState([]);
  const [hiddenQuota, setHiddenQuota] = useState(true);
  const [hiddenOptionLevel, setHiddenOptionLevel] = useState(true);
  const [hiddenAddNewButton, setHiddenAddNewButton] = useState(true);

  useEffect(() => {
    getMaterials();
  }, []);

  const getMaterials = () => {
    materialDataService.getAllMaterialManagementsAsync().then((res) => {
      if (res) {
        setListMaterial(res.materials);
      }
    });
  };

  const pageData = {
    addOption: t("option.addOption"),
    cancel: t("button.cancel"),
    addNew: t("option.add"),
    nameOption: t("option.nameOption"),
    enterOptionName: t("option.enterOptionName"),
    pleaseEnterNameOption: t("option.pleaseEnterNameOption"),
    materialName: t("material.name"),
    selectMaterialName: t("material.selectMaterialName"),
    pleaseSelectMaterial: t("material.pleaseSelectMaterial"),
    optionLevel: t("option.optionLevel"),
    addOptionLevel: t("option.addOptionLevel"),
    setDefault: t("option.setDefault"),
    enterOptionLevelName: t("option.enterOptionLevelName"),
    pleaseEnterNameOptionLevel: t("option.pleaseEnterNameOptionLevel"),
    createOptionSuccess: t("option.createOptionSuccess"),
    minQuota: 0,
    maxQuota: 300,
    enterQuota: t("option.enterQuota"),
    pleaseEnterQuota: t("option.pleaseEnterQuota"),
    quotaValidateRange: t("option.quotaValidateRange"),
    nameOptionExisted: t("option.nameOptionExisted"),
  };

  const onFinish = (values) => {
    form.validateFields().then(() => {
      setHiddenAddNewButton(true);
      optionDataService
        .createOptionManagementAsync(values)
        .then((res) => {
          if (res) {
            form.resetFields();
            setHiddenQuota(true);
            setHiddenOptionLevel(true);
            setHiddenAddNewButton(true);
            message.success(t("option.createSuccess", { name: values?.name }));
            handleCancel();
          }
        })
        .catch((errs) => {
          setHiddenOptionLevel(false);
          setHiddenAddNewButton(false);
          form.setFields(getValidationMessages(errs));
        });
    }).catch(() => {
    })

  };

  const onCancel = () => {
    form.resetFields();
    setHiddenQuota(true);
    setHiddenOptionLevel(true);
    setHiddenAddNewButton(true);
    handleCancel();
  };

  const onChangeDefault = (fieldKey) => {
    let formValue = form.getFieldsValue();
    let { optionLevels } = formValue;
    optionLevels.map((value, index) => {
      if (index === fieldKey) {
        value.setDefault = true;
      } else {
        value.setDefault = false;
      }
    });
    form.setFieldsValue(formValue);
  };

  const checkValidOption = (e) => {
    e.preventDefault();
    var isErrorForm = false;
    let formValue = form.getFieldsValue();
    if (formValue.optionLevels.length > 19) {
      isErrorForm = true;
    }

    if (formValue.optionLevels.filter((o) => o.name === undefined || o.name === "").length > 0) {
      isErrorForm = true;
    }

    if (formValue.optionLevels.length > 0) {
      setHiddenOptionLevel(false);
      setHiddenAddNewButton(false);
    }

    return isErrorForm;
  };

  const handleRemoveOptionLevel = (index) => {
    let formValue = form.getFieldsValue();
    let { optionLevels } = formValue;
    var isRemove = false;
    if (optionLevels && optionLevels.length > 1) {
      var isSetDefault = optionLevels.find((value, i) => i === index)?.setDefault;
      if (isSetDefault) {
        if (index === 0) {
          optionLevels[index + 1].setDefault = true;
        } else {
          optionLevels[0].setDefault = true;
        }
      }
      form.setFieldsValue(formValue);
      isRemove = true;
    }

    if (optionLevels.length === 1) {
      let formValue = form.getFieldsValue();
      let { optionLevels } = formValue;
      optionLevels[0].name = "";
      optionLevels[0].setDefault = true;
      optionLevels[0].quota = null;
      form.setFieldsValue({ ...formValue, optionLevels: optionLevels });
      setHiddenOptionLevel(true);
      setHiddenAddNewButton(true);
    }

    return isRemove;
  };

  const onSelectMaterial = (value) => {
    if (value) {
      setHiddenQuota(false);
    } else {
      setHiddenQuota(true);
    }
  };
  const isSameName = (name) => {
    const optionLevels = form.getFieldsValue()?.optionLevels;
    if (optionLevels && optionLevels.length > 1) {
      return optionLevels?.filter((item) => item.name.toLowerCase() === name.toLowerCase()).length > 1;
    }
  };

  return (
    <Modal
      className="modal-create-option"
      title={<DialogTitle content={pageData.addOption} />}
      closeIcon
      visible={props.isModalVisible}
      footer={(null, null)}
      width={"800px"}
    >
      <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
        <Row>
          <Col span={24}>
            <h4 className="fnb-form-label" style={{ color: "#000000" }}>
              {pageData.nameOption}
              <span className="text-danger">*</span>
            </h4>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: pageData.pleaseEnterNameOption },
                { type: "string", max: 50, min: 1 },
              ]}
            >
              <Input
                className="fnb-input-with-count"
                showCount
                maxLength={50}
                placeholder={pageData.enterOptionName}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h4 className="fnb-form-label" style={{ color: "#000000" }}>
              {pageData.materialName}
            </h4>
            <Form.Item name="materialId">
              <FnbSelectSingle
                showSearch
                allowClear
                placeholder={pageData.selectMaterialName}
                onChange={(value) => onSelectMaterial(value)}
                size="large"
                option={listMaterial?.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginTop: "12px" }}>
          <Col span={24}>
            <Form.List name="optionLevels" initialValue={setDefaultData}>
              {(fields, { add, remove }) => (
                <>
                  <Card style={{ borderRadius: "12px", backgroundColor: "#F7F5FF" }}>
                    <Row>
                      <Col span={12} className="top-page">
                        <h3>{pageData.optionLevel}</h3>
                      </Col>
                      <Col sm={24} xs={24} lg={12} className="top-page top-page-float-right">
                        <FnbAddNewButton
                          icon={<PlusOrangeIcon className="icon-add-new-import-unit" />}
                          onClick={(e) => !checkValidOption(e) && add()}
                          className="float-right"
                          htmlType="submit"
                          text={pageData.addOptionLevel}
                        />
                      </Col>
                    </Row>
                    <div className="form-add-option-level-scroll">
                      {fields.map((field) => (
                        <>
                          <Row key={field.key} style={{ alignItems: "center" }} hidden={hiddenOptionLevel}>
                            <Col sm={20} xs={20} lg={21} className="card-option-level-margin">
                              <Card className="option-card">
                                <div key={field.key} align="center" style={{ alignItems: "center" }}>
                                  {hiddenQuota === true ? (
                                    <>
                                      <Row>
                                        <Form.Item
                                          name={[field.name, "setDefault"]}
                                          valuePropName="checked"
                                          className="check-default-option-level"
                                        >
                                          <Radio onChange={(e) => onChangeDefault(field.name)} defaultChecked>
                                            <h3>{pageData.setDefault}</h3>
                                          </Radio>
                                        </Form.Item>
                                      </Row>
                                      <Row>
                                        <Col span={24}>
                                          <Form.Item
                                            name={[field.name, "name"]}
                                            rules={[
                                              {
                                                required: true,
                                                message: pageData.pleaseEnterNameOptionLevel,
                                              },
                                              { type: "string", max: 50, min: 1 },
                                            ]}
                                            className="margin-bottom-form-item "
                                          >
                                            <Input
                                              className="fnb-input-with-count btn-optionlevel-resize"
                                              showCount
                                              maxLength={50}
                                              placeholder={pageData.enterOptionLevelName}
                                              size="large"
                                            />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    </>
                                  ) : (
                                    <>
                                      <Row>
                                        <Form.Item
                                          name={[field.name, "setDefault"]}
                                          valuePropName="checked"
                                          className="check-default-option-level"
                                        >
                                          <Radio onChange={(e) => onChangeDefault(field.name)} defaultChecked>
                                            <h3>{pageData.setDefault}</h3>
                                          </Radio>
                                        </Form.Item>
                                      </Row>
                                      <Row>
                                        <Col sm={24} xs={24} lg={12}>
                                          <Form.Item
                                            name={[field.name, "name"]}
                                            rules={[
                                              {
                                                required: true,
                                                message: pageData.pleaseEnterNameOptionLevel,
                                              },
                                              { type: "string", max: 50, min: 1 },
                                              {
                                                validator(_, value) {
                                                  if (isSameName(value)) {
                                                    return Promise.reject(new Error(pageData.nameOptionExisted));
                                                  } else {
                                                    return Promise.resolve();
                                                  }
                                                },
                                              },
                                            ]}
                                            className="margin-bottom-form-item "
                                          >
                                            <Input
                                              className="fnb-input-with-count"
                                              showCount
                                              maxLength={50}
                                              placeholder={pageData.enterOptionLevelName}
                                              size="large"
                                            />
                                          </Form.Item>
                                        </Col>
                                        <Col lg={1}></Col>
                                        <Col sm={24} xs={24} lg={11} className="option-quota">
                                          <Form.Item
                                            name={[field.name, "quota"]}
                                            rules={[
                                              {
                                                required: true,
                                                message: pageData.pleaseEnterQuota,
                                              },
                                              {
                                                pattern: new RegExp(inputNumberRange0To100.range),
                                                message: pageData.quotaValidateRange,
                                              },
                                            ]}
                                            className="margin-bottom-form-item"
                                          >
                                            <InputNumber
                                              size="large"
                                              className="w-100 fnb-input"
                                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                              min={pageData.minQuota}
                                              max={pageData.maxQuota}
                                              placeholder={pageData.enterQuota}
                                              onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                  event.preventDefault();
                                                }
                                              }}
                                            />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    </>
                                  )}
                                </div>
                              </Card>
                            </Col>
                            <Col sm={3} xs={3} lg={2}>
                              <a
                                onClick={(e) => handleRemoveOptionLevel(field.name) && remove(field.name)}
                                className={
                                  hiddenQuota === true ? "option-level-delete-icon" : "option-level-delete-icon-quota"
                                }
                              >
                                <FnbTrashFillIcon />
                              </a>
                            </Col>
                          </Row >
                        </>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
        <Row className="float-center option-level-action-btn">
          <Button className="btn-cancel" key="back" onClick={() => onCancel()}>
            {pageData.cancel}
          </Button>
          <Button type="primary" className="btn-option-level-add" htmlType="submit" disabled={hiddenAddNewButton}>
            {pageData.addNew}
          </Button>
        </Row>
      </Form>
    </Modal >
  );
}
