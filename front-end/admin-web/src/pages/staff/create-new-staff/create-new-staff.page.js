import { PlusSquareOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Layout, message, Radio, Row, Tooltip } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbSelectMultiple } from 'components/fnb-select-multiple/fnb-select-multiple'
import PageTitle from 'components/page-title'
import { DELAYED_TIME, EmptyId } from 'constants/default.constants'
import { TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getValidationMessagesWithParentField } from 'utils/helpers'
import '../staff.page.scss'

const { Content } = Layout

export function CreateNewStaff (props) {
  const history = useHistory()
  const { t, staffDataService } = props
  // eslint-disable-next-line no-unused-vars
  const [formHasValue, setFormHasValue] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [disableSaveButton, setDisableSaveButton] = useState(true)
  const [isChangeForm, setIsChangeForm] = useState(false)
  // #region Page data
  const pageData = {
    btnCancel: t('button:cancel'),
    btnCreate: t('button:createNewStaff'),
    createStaff: t('staff:createStaff'),
    btnDiscard: t('button:discard'),
    leaveDialog: {
      confirmLeaveTitle: t('dialog:confirmLeaveTitle'),
      confirmLeaveContent: t('dialog:confirmLeaveContent'),
      confirmLeave: t('dialog:confirmLeave')
    },
    generalInformation: {
      title: t('staff:titleInfo'),
      fullName: {
        label: t('staff:fullName'),
        placeholder: t('staff:fullNamePlaceholder'),
        required: true,
        maxLength: 50,
        validateMessage: t('staff:fullNameValidateMessage')
      },
      phoneNumber: {
        label: t('staff:phone'),
        placeholder: t('staff:phonePlaceholder'),
        required: true,
        maxLength: 15,
        format: '^[0-9]*$',
        validateMessage: t('staff:phoneValidateMessage'),
        invalidMessage: t('staff:phoneInvalidMessage'),
        existValidateMessage: t('staff:phoneExisted')
      },
      email: {
        label: t('staff:email'),
        placeholder: t('staff:emailPlaceholder'),
        required: true,
        format: 'email',
        validateMessage: t('staff:emailValidateMessage'),
        invalidMessage: t('staff:emailInvalidMessage'),
        existValidateMessage: t('staff:emailExisted')
      },
      birthDay: {
        label: t('staff:birthday'),
        placeholder: t('staff:birthdayPlaceholder'),
        format: 'date'
      },
      gender: {
        label: t('staff:male'),
        male: t('staff:male'),
        female: t('staff:female')
      }
    },
    permission: {
      title: t('staff:titlePermission'),
      selectGroup: {
        label: t('staff:labelPermission'),
        placeholder: t('staff:placeholderPermission'),
        required: true,
        validateMessage: t('staff:validatePermission')
      },
      btnAddGroup: t('staff:btnAddGroupPermission'),
      allGroup: t('staff:allGroupPermission')
    },
    staffAddedSuccessfully: t('staff:staffAddedSuccessfully'),
    staffAddedFailed: t('staff:staffAddedFailed')
  }
  // #endregion

  const [groupPermissionStaff, setGroupPermissionStaff] = useState([
    {
      index: 0,
      groupPermissionIds: [],
      selectedAllGroups: false
    }
  ])
  const [groupPermissions, setGroupPermissions] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    // const fetchPrepareCreateNewStaffData = async () => {
    //   const response = await staffDataService.getPrepareCreateNewStaffDataAsync()
    //   if (response) {
    //     const { groupPermissions } = response
    //     setGroupPermissions(groupPermissions)
    //   }
    // }
    // fetchPrepareCreateNewStaffData()
  }, [])

  const onClickSaveStaff = () => {
    if (groupPermissions?.length > 0) {
      form.validateFields().then((values) => {
        // Copy array from the old array.
        const formData = { ...values }

        // The array contains new items after handling.
        const newGroups = []

        // Go to each item and check the condition.
        for (const item of groupPermissionStaff) {
          const aGroup = {}

          // If the user clicks on the checkbox control Permission Group and the checkbox is checked,
          // set data for the object's property from the permission list.
          if (item.selectedAllGroups) {
            aGroup.groupPermissionIds = groupPermissions.map((item) => item.id)
          } else {
            aGroup.groupPermissionIds = item.groupIds
          }

          // Push this object to the array list.
          newGroups.push(aGroup)
        }

        // Set data
        formData.groupPermissionStaff = newGroups
        formData.staff.birthday = formData.staff.birthday
          ? moment.utc(formData.staff.birthday).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2)
          : null
        // staffDataService
        //   .createNewStaffAsync(formData)
        //   .then((response) => {
        //     if (response === true) {
        //       setFormHasValue(false)
        //       onCompleted({
        //         savedSuccessfully: true,
        //         message: pageData.staffAddedSuccessfully
        //       })
        //     } else {
        //       message.error(pageData.staffAddedFailed)
        //     }
        //   })
        //   .catch((errs) => {
        //     form.setFields(getValidationMessagesWithParentField(errs, 'staff'))
        //   })
      })
    } else {
      form.validateFields().then(() => {
        groupPermissionStaff.forEach((_, index) => {
          form.setFields([
            {
              name: ['groupPermissionStaff', index, 'tmpGroupPermissionIds'],
              errors: [pageData.permission.selectGroup.validateMessage]
            }
          ])
        })
      })
    }
  }

  const onRemoveGroupPermissionAndBranch = (index) => {
    const formData = form.getFieldsValue()
    const { groupPermissionStaff } = formData
    if (groupPermissionStaff.length <= 1) {
      return
    }

    groupPermissionStaff.splice(index, 1)
    setGroupPermissionStaff([...groupPermissionStaff])
    form.setFieldsValue(formData)
  }

  const onAddGroupPermissionAndBranch = () => {
    // add new item into group permission
    form.validateFields().then(() => {
      const newGroupPermissionBranch = {
        index: groupPermissionStaff?.length,
        groupPermissionIds: [],
        selectedAllGroups: false
      }
      setGroupPermissionStaff([...groupPermissionStaff, newGroupPermissionBranch])
    })
  }

  const renderGroupPermissionAndBranch = () => {
    return groupPermissionStaff?.length === 0
      ? (
      <div className="permission-placeholder">{pageData.permission.permissionPlaceholder}</div>
        )
      : (
          groupPermissionStaff.map((item, index) => (
        <Row key={index} gutter={[16, 16]}>
          <Col xs={22} sm={22} lg={22}>
            <Row className="group-permission-item" gutter={[22, 18]}>
              <Col xs={24} sm={24} lg={12}>
                <div className="select-all">
                  <Checkbox onChange={(event) => onSelectAllGroups(event, index)}>
                    {pageData.permission.allGroup}
                  </Checkbox>
                </div>

                <Form.Item
                  hidden={item?.selectedAllGroups}
                  className="select-control"
                  label={pageData.permission.selectGroup.label}
                  name={['groupPermissionStaff', index, 'groupPermissionIds']}
                  rules={[
                    {
                      required: item?.selectedAllGroups
                        ? false
                        : item?.groupIds?.length > 0
                          ? false
                          : pageData.permission.selectGroup.required,
                      message: pageData.permission.selectGroup.validateMessage
                    }
                  ]}
                >
                  <FnbSelectMultiple
                    disabled={item?.selectedAllGroups}
                    showArrow
                    placeholder={pageData.permission.selectGroup.placeholder}
                    option={item?.selectedAllGroups ? [] : groupPermissions}
                    onChange={(values) => onUpdateGroupPermission(index, values, true)}
                  />
                </Form.Item>

                <Form.Item
                  name={['groupPermissionStaff', index, 'tmpGroupPermissionIds']}
                  className="select-control"
                  label={pageData.permission.selectGroup.label}
                  hidden={!item?.selectedAllGroups}
                >
                  <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col className="btn-remove-icon" xs={2} sm={2} lg={1}>
            <Tooltip placement="top" title={t('button:delete')} color="#50429B">
              <TrashFill
                onClick={() => onRemoveGroupPermissionAndBranch(index)}
                className="icon-del mt-4 pt-2 float-right"
              />
            </Tooltip>
          </Col>
        </Row>
          ))
        )
  }

  /**
   * This function is used to set the form status,
   * if value is true when you leave this page then a confirmation box will be displayed.
   *
   */
  const onFormChanged = () => {
    if (form.getFieldsValue()) {
      setFormHasValue(true)
      setDisableSaveButton(false)
    } else {
      setFormHasValue(false)
      setDisableSaveButton(true)
    }
  }

  /**
   * This method is used to set value for the variable 'isSelectedAllGroups', it will be called when the user clicks on the control.
   * @param  {CheckboxChangeEvent} event The event data
   */
  const onSelectAllGroups = (event, index) => {
    const isChecked = event.target.checked
    const groups = [...groupPermissionStaff]
    const itemInGroups = groups[index]
    if (itemInGroups) {
      itemInGroups.selectedAllGroups = isChecked
      setGroupPermissionStaff(groups)
      if (isChecked && !groupPermissions?.length > 0) {
        form.setFields([
          {
            name: ['groupPermissionStaff', index, 'tmpGroupPermissionIds'],
            errors: [pageData.permission.selectGroup.validateMessage]
          }
        ])
      }
    }
  }

  /**
   * This function is used to set value for the control.
   * @param  {int} index The current index of the control.
   * @param  {listOfString} values The values (it's array) of the control.
   * @param  {bool} setValueForGroup If the value is true, set value for the group Ids.
   */
  const onUpdateGroupPermission = (index, values, setValueForGroup) => {
    // Copy array.
    const groups = [...groupPermissionStaff]

    // Get object from the array by the current index.
    const itemInGroups = groups[index]
    if (itemInGroups) {
      itemInGroups.groupIds = values
      // Set the new value for the variable.
      setGroupPermissionStaff(groups)
    }
  }

  /**
   * This function is used to navigate to the Staff Management page.
   * @param  {any} data This data will be called at the Staff Management page.
   */
  const onCompleted = (data) => {
    setIsChangeForm(false)
    setFormHasValue(false)
    setTimeout(() => {
      if (data) {
        history.push({ pathname: '/staff', state: data })
      } else {
        history.push('/staff')
      }
    }, DELAYED_TIME)
  }

  /**
   * This function is used to close the confirmation modal.
   */
  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      onCompleted()
    }
  }

  const changeForm = (e) => {
    setIsChangeForm(true)
  }

  function updateDateFields (event) {
    const checkDate = moment(event.target.value, DateFormat.DD_MM_YYYY, true)
    if (checkDate.isValid() && checkDate <= moment()) {
      form.setFieldsValue({
        staff: {
          birthday: moment(event.target.value, DateFormat.DD_MM_YYYY, true)
        }
      })
    }
  }

  const disabledDate = (current) => {
    return current.isAfter(moment())
  }

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.createStaff} />
          </p>
        </Col>

        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    disabled={disableSaveButton}
                    icon={<PlusSquareOutlined />}
                    type="primary"
                    htmlType="submit"
                    onClick={() => onClickSaveStaff()}
                  >
                    {pageData.btnCreate}
                  </Button>
                ),
                permission: PermissionKeys.ADMIN
              },
              {
                action: (
                  <a onClick={() => onCancel()} className="action-cancel">
                    {pageData.btnCancel}
                  </a>
                ),
                permission: null
              }
            ]}
          />
        </Col>
      </Row>

      <div className="clearfix"></div>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onChange={onFormChanged}
        onFieldsChange={(e) => changeForm(e)}
      >
        <Content>
          <Card className="fnb-box custom-box">
            <Row className="group-header-box">
              <Col xs={24} sm={24} lg={24}>
                {pageData.generalInformation.title}
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} lg={12}>
                <Form.Item
                  name={['staff', 'code']}
                  label={pageData.generalInformation.code.label}
                  rules={[
                    {
                      required: pageData.generalInformation.code.required,
                      message: pageData.generalInformation.code.validateMessage
                    },
                    { type: 'string', warningOnly: true },
                    {
                      pattern: new RegExp(pageData.generalInformation.code.format),
                      message: pageData.generalInformation.code.invalidMessage
                    },
                    {
                      type: 'string',
                      max: pageData.generalInformation.code.maxLength
                    }
                  ]}
                >
                  <Input
                    className="fnb-input"
                    placeholder={pageData.generalInformation.code.placeholder}
                    maxLength={pageData.generalInformation.code.maxLength}
                  />
                </Form.Item>

                <Form.Item
                  name={['staff', 'phone']}
                  label={pageData.generalInformation.phoneNumber.label}
                  rules={[
                    {
                      required: pageData.generalInformation.phoneNumber.required,
                      message: pageData.generalInformation.phoneNumber.validateMessage
                    },
                    {
                      pattern: new RegExp(pageData.generalInformation.phoneNumber.format),
                      message: pageData.generalInformation.phoneNumber.invalidMessage
                    },
                    { type: 'string', warningOnly: true },
                    {
                      type: 'string',
                      max: pageData.generalInformation.phoneNumber.maxLength
                    }
                  ]}
                >
                  <Input
                    className="fnb-input"
                    placeholder={pageData.generalInformation.phoneNumber.placeholder}
                    maxLength={pageData.generalInformation.phoneNumber.maxLength}
                  />
                </Form.Item>

                <Form.Item
                  name={['staff', 'birthday']}
                  label={pageData.generalInformation.birthDay.label}
                  onChange={(event) => updateDateFields(event)}
                >
                  <DatePicker
                    className="w-100 fnb-input"
                    format={DateFormat.DD_MM_YYYY}
                    placeholder={pageData.generalInformation.birthDay.placeholder}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} lg={12}>
                <Form.Item
                  name={['staff', 'name']}
                  label={pageData.generalInformation.fullName.label}
                  rules={[
                    {
                      required: pageData.generalInformation.fullName.required,
                      message: pageData.generalInformation.fullName.validateMessage
                    },
                    { type: 'string', warningOnly: true },
                    {
                      type: 'string',
                      max: pageData.generalInformation.fullName.maxLength
                    }
                  ]}
                >
                  <Input
                    className="fnb-input"
                    placeholder={pageData.generalInformation.fullName.placeholder}
                    maxLength={pageData.generalInformation.fullName.maxLength}
                  />
                </Form.Item>

                <Form.Item
                  name={['staff', 'email']}
                  label={pageData.generalInformation.email.label}
                  rules={[
                    {
                      required: pageData.generalInformation.email.required,
                      message: pageData.generalInformation.email.validateMessage
                    },
                    {
                      type: 'email',
                      message: pageData.generalInformation.email.invalidMessage
                    }
                  ]}
                >
                  <Input className="fnb-input" placeholder={pageData.generalInformation.email.placeholder} />
                </Form.Item>

                <Form.Item
                  initialValue={true}
                  className="gender-control"
                  name={['staff', 'gender']}
                  label={pageData.generalInformation.gender.label}
                >
                  <Radio.Group>
                    <Radio value={true}>{pageData.generalInformation.gender.female}</Radio>
                    <Radio value={false}>{pageData.generalInformation.gender.male}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Content>

        <Content className="mt-3">
          <Card className="fnb-box group-permission custom-box">
            <Row className="group-header-box">
              <Col className="items-in-group-header-box" xs={24} sm={24} lg={24}>
                <span>{pageData.permission.title}</span>
                <Button className="mt-4" icon={<PlusSquareOutlined />} onClick={() => onAddGroupPermissionAndBranch()}>
                  {pageData.permission.addStaffPermission}
                </Button>
              </Col>
            </Row>
            {renderGroupPermissionAndBranch()}
          </Card>
        </Content>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.leaveDialog.confirmLeave}
        onCancel={() => setShowConfirm(false)}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  )
}
