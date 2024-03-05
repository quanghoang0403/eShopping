import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Layout, message, Radio, Row, Tooltip } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { compareTwoArrays, getValidationMessagesWithParentField } from 'utils/helpers'
import '../staff.page.scss'

const { Content } = Layout

export function EditStaff (props) {
  const history = useHistory()
  const { t, staffDataService } = props
  const [formHasValue, setFormHasValue] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [disableSaveButton, setDisableSaveButton] = useState(true)
  const [isChangeForm, setIsChangeForm] = useState(false)
  // #region Page data
  const pageData = {
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnUpdate: t('button.update'),
    btnDiscard: t('button.discard'),
    editingStaff: t('staff:editingStaff'),
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
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
    staffAddedFailed: t('staff:staffAddedFailed'),
    staffUpdatedSuccessfully: t('staff:staffUpdatedSuccessfully'),
    staffUpdatedFailed: t('staff:staffUpdatedFailed')
  }
  // #endregion

  const [groupPermissionStaff, setGroupPermissionStaff] = useState([
    {
      index: 0,
      groupIds: [],
      selectedAllGroups: false
    }
  ])
  const [groupPermissions, setGroupPermissions] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadDataToEditStaff = async (staffId, response) => {
    // if (staffId) {
    //   const { staff } = await staffDataService.getStaffByIdAsync(staffId)

    //   form.setFieldsValue({
    //     staff: {
    //       id: staff.id,
    //       name: staff.name,
    //       phone: staff.phone,
    //       email: staff.email,
    //       birthday: staff.birthday ? moment.utc(staff.birthday).local() : null,
    //       gender: staff.gender
    //     },
    //     groupPermissionStaff: [...staff?.permissionGroupControls]
    //   })

    //   renderGroupPermissionForEdit(staff.permissionGroupControls, response)
    // }
  }

  const renderGroupPermissionForEdit = (items, response) => {
    if (items && items.length > 0) {
      const groupPermissionStaff = items?.map((item, index) => {
        const selectedAllGroups = compareTwoArrays(
          item.groupPermissionIds,
          response?.groupPermissions.map((item) => item.id)
        )

        return {
          index,
          groupIds: item.groupPermissionIds,
          selectedAllGroups
        }
      })
      setGroupPermissionStaff(groupPermissionStaff)
    }
  }

  const loadData = async () => {
    // const response = await props.staffDataService.getPrepareCreateNewStaffDataAsync()
    // if (response) {
    //   const { groupPermissions } = response
    //   setGroupPermissions(groupPermissions)
    // }
    // const { id } = props?.match?.params || {}
    // loadDataToEditStaff(id, response)
  }

  const onClickUpdateStaff = () => {
    // if (groupPermissions?.length > 0) {
    //   form.validateFields().then((values) => {
    //     staffDataService
    //       .updateStaffAsync(values)
    //       .then((response) => {
    //         if (response === true) {
    //           message.success(pageData.staffUpdatedSuccessfully)
    //           onCompleted()
    //         } else {
    //           message.error(pageData.staffUpdatedFailed)
    //         }
    //       })
    //       .catch((errs) => {
    //         form.setFields(getValidationMessagesWithParentField(errs, 'staff'))
    //       })
    //   })
    // } else {
    //   form.validateFields().then(() => {
    //     groupPermissionStaff.forEach((_, index) => {
    //       form.setFields([
    //         {
    //           name: ['groupPermissionStaff', index, 'groupPermissionIds'],
    //           errors: [pageData.permission.selectGroup.validateMessage]
    //         }
    //       ])
    //     })
    //   })
    // }
  }

  const onRemoveGroupPermission = (index) => {
    const formData = form.getFieldsValue()
    const { groupPermissionStaff } = formData
    if (groupPermissionStaff.length === 1) {
      return
    }

    groupPermissionStaff.splice(index, 1)
    setGroupPermissionStaff([...groupPermissionStaff])
    form.setFieldsValue(formData)
    setDisableSaveButton(false)
  }

  const onAddGroupPermissionAndBranch = () => {
    // add new item into group permission
    form.validateFields().then((values) => {
      const newGroupPermissionBranch = {
        index: groupPermissionStaff.length,
        groupPermissionIds: [],
        selectedAllGroups: false
      }
      setGroupPermissionStaff([...groupPermissionStaff, newGroupPermissionBranch])
    })
  }

  const renderGroupPermission = () => {
    return groupPermissionStaff.map((item, index) => {
      return (
        <Row key={index} gutter={[16, 16]}>
          <Col xs={22} sm={22} lg={22}>
            <Row className="group-permission-item" gutter={[22, 18]}>
              <Col xs={24} sm={24} lg={12}>
                <div className="select-all">
                  <Checkbox checked={item.selectedAllGroups} onChange={(event) => onSelectAllGroups(event, index)}>
                    {pageData.permission.allGroup}
                  </Checkbox>
                </div>
                <Form.Item
                  hidden={item?.selectedAllGroups}
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
                    disabled={item?.selectedAllGroups || item.selectedAllGroups}
                    showArrow
                    placeholder={pageData.permission.selectGroup.placeholder}
                    option={item?.selectedAllGroups ? [] : groupPermissions}
                    onChange={(values, item) => onUpdateGroupPermission(index, values, true)}
                  />
                </Form.Item>

                <Form.Item
                  name={['groupPermissionStaff', index, 'groupPermissionIds']}
                  className="select-control"
                  label={pageData.permission.selectGroup.label}
                  hidden={!item?.selectedAllGroups}
                >
                  <FnbSelectMultiple
                    className={item?.selectedAllGroups ? 'hide-select-option' : ''}
                    disabled={true}
                  ></FnbSelectMultiple>
                </Form.Item>
              </Col>
            </Row>
          </Col>

          {groupPermissionStaff?.length > 1 && (
            <Col className="btn-remove-icon" xs={2} sm={2} lg={1}>
              <Tooltip placement="top" title={t('button.delete')} color="#50429B">
                <TrashFill
                  onClick={() => onRemoveGroupPermission(index)}
                  className="icon-del mt-4 pt-2 float-right"
                />
              </Tooltip>
            </Col>
          )}
        </Row>
      )
    })
  }

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
            name: ['groupPermissionStaff', index, 'groupPermissionIds'],
            errors: [pageData.permission.selectGroup.validateMessage]
          }
        ])
      }
    }

    if (isChecked === true) {
      const formValues = form.getFieldsValue()
      const groupPermissionStaff = formValues.groupPermissionStaff
      groupPermissionStaff[index].groupPermissionIds = groupPermissions?.map((group) => group.id) ?? []
      form.setFieldsValue({
        groupPermissionStaff
      })
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
   * This function is used to set value for the control.
   * @param  {int} index The current index of the control.
   * @param  {listOfString} values The values (it's array) of the control.
   * @param  {bool} setValueForGroup If the value is true, set value for the group Ids.
   */
  const onUpdateGroupPermission = (index, values) => {
    // Copy array.
    const groups = [...groupPermissionStaff]

    // Get object from the array by the current index.
    const itemInGroups = groups[index]
    if (itemInGroups) {
      itemInGroups.groupIds = values
      // Set the new value for the variable.
      setGroupPermissionStaff(groups)
      setDisableSaveButton(false)
    }
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

  const onChangeDate = () => {
    setDisableSaveButton(false)
  }

  return (
    <>
      <Row className="shop-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.editingStaff} />
          </p>
        </Col>

        <Col span={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    disabled={disableSaveButton}
                    type="primary"
                    htmlType="submit"
                    onClick={() => onClickUpdateStaff()}
                  >
                    {pageData.btnUpdate}
                  </Button>
                ),
                permission: PermissionKeys.ADMIN
              },
              {
                action: (
                  <button className="action-cancel" onClick={() => onCancel()}>
                    {pageData.btnCancel}
                  </button>
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
          <Card className="shop-box custom-box">
            <Row className="group-header-box">
              <Col xs={24} sm={24} lg={24}>
                {pageData.generalInformation.title}
              </Col>
            </Row>

          </Card>
        </Content>

        <Content className="mt-3">
          <Card className="shop-box custom-box">
            <Row className="group-header-box">
              <Col xs={24} sm={24} lg={24}>
                {pageData.permission.title}
              </Col>
            </Row>

            {renderGroupPermission()}
            <Button className="mt-4" icon={<PlusOutlined />} onClick={() => onAddGroupPermissionAndBranch()}>
              {pageData.permission.btnAddGroup}
            </Button>
          </Card>
        </Content>
        <Form.Item name={['staff', 'id']} hidden="true"></Form.Item>
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
