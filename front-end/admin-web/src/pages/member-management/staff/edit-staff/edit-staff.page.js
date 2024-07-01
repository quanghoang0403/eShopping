import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Layout, message, Radio, Row, Tooltip } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple'
import PageTitle from 'components/page-title'
import { DELAYED_TIME, PHONE_NUMBER_REGEX } from 'constants/default.constants'
import { TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { compareTwoArrays, getValidationMessagesWithParentField } from 'utils/helpers'
import '../staff.page.scss'
import permissionDataService from 'data-services/permission/permission-data.service'
import staffDataService from 'data-services/staff/staff-data.service'
import { useTranslation } from 'react-i18next'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component'
import ShopActiveStatus from 'components/shop-active-status/shop-active-status.component'
import ChangeStatusButton from 'components/shop-change-active-status-button/shop-change-active-status-button.component'

const { Content } = Layout

export function EditStaff(props) {
  const history = useHistory()
  const { t } = useTranslation();
  const [formHasValue, setFormHasValue] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [disableSaveButton, setDisableSaveButton] = useState(true)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [staff, setStaff] = useState({})
  const shopImageSelectRef = useRef(null)
  // #region Page data
  const pageData = {
    active: t('common.active'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnUpdate: t('button.updateStaff'),
    btnDiscard: t('button.discard'),
    editingStaff: t('staff.editingStaff'),
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    },
    media: {
      upload: t('common.uploadTitle')
    },
    generalInformation: {
      title: t('staff.titleInfo'),
      fullName: {
        label: t('staff.fullName'),
        placeholder: t('staff.fullNamePlaceholder'),
        required: true,
        maxLength: 50,
        validateMessage: t('staff.fullNameValidateMessage')
      },
      phoneNumber: {
        label: t('staff.phone'),
        placeholder: t('staff.phonePlaceholder'),
        required: true,
        maxLength: 10,
        format: PHONE_NUMBER_REGEX,
        validateMessage: t('staff.phoneValidateMessage'),
        invalidMessage: t('staff.phoneInvalidMessage'),
        existValidateMessage: t('staff.phoneExisted')
      },
      email: {
        label: t('staff.email'),
        placeholder: t('staff.emailPlaceholder'),
        required: true,
        format: 'email',
        validateMessage: t('staff.emailValidateMessage'),
        invalidMessage: t('staff.emailInvalidMessage'),
        existValidateMessage: t('staff.emailExisted')
      },
      birthDay: {
        label: t('staff.birthday'),
        placeholder: t('staff.birthdayPlaceholder'),
        format: 'date'
      },
      gender: {
        label: t('staff.male'),
        male: t('staff.male'),
        female: t('staff.female')
      }
    },
    permission: {
      title: t('staff.titlePermission'),
      selectGroup: {
        label: t('staff.labelPermission'),
        placeholder: t('staff.placeholderPermission'),
        required: true,
        validateMessage: t('staff.validatePermission')
      },
      allpermission: [
        [t('staff.permissionAdmin')],
        [
          t('staff.permissionViewProduct'),
          t('staff.permissionCreateProduct'),
          t('staff.permissionEditProduct')
        ],
        [
          t('staff.permissionViewProductCategory'),
          t('staff.permissionCreateProductCategory'),
          t('staff.permissionEditProductCategory')
        ],
        [
          t('staff.permissionViewCustomer'),
          t('staff.permissionCreateCustomer'),
          t('staff.permissionEditCustomer')
        ],
        [
          t('staff.permissionViewStaff'),
          t('staff.permissionCreateStaff'),
          t('staff.permissionEditStaff')
        ],
        [
          t('staff.permissionViewOrder'),
          t('staff.permissionCreateOrder'),
          t('staff.permissionEditOrder')
        ],
        [
          t('staff.permissionViewBlog'),
          t('staff.permissionCreateBlog'),
          t('staff.permissionEditBlog')
        ],
        [
          t('staff.permissionStoreWeb')
        ]
      ],
      btnAddGroup: t('staff.btnAddGroupPermission'),
      allGroup: t('staff.allGroupPermission')
    },
    staffAddedSuccessfully: t('staff.staffAddedSuccessfully'),
    staffAddedFailed: t('staff.staffAddedFailed'),
    staffUpdatedSuccessfully: t('staff.staffUpdatedSuccessfully'),
    staffUpdatedFailed: t('staff.staffUpdatedFailed')
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

  const onChangeStatus = active=>{
    form.setFieldValue(['staff','isActive'],!active)
    setStaff(s=>({...s,isActive:!active}))
  }

  const loadDataToEditStaff = async (staffId, response) => {
    if (staffId) {
      const staff = await staffDataService.getStaffByIdAsync(staffId)
      if (shopImageSelectRef && shopImageSelectRef.current) {
        shopImageSelectRef.current.setImageUrl(staff?.thumbnail);
      }
      setStaff(staff)
      form.setFieldsValue({
        staff: {
          ...staff,
          staffId: staff.id,
          birthday: staff.birthday ? moment.utc(staff.birthday).local() : null,
          permissionIds: staff.permissions.map(p => p.id)
        }

      })
      setPermissionIds(staff?.permissions.map(p => p.id))
      renderGroupPermissionForEdit(staff.permissionGroupControls, response)
    }
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
    const response = await permissionDataService.getAllPermissionAsync();
    if (response) {
      const permissionGroups = response
      setGroupPermissions(permissionGroups.slice(0, -1))
    }
    const { id } = props?.match?.params || {}
    loadDataToEditStaff(id, response)
  }

  const onClickUpdateStaff = () => {
    if (shopImageSelectRef && shopImageSelectRef.current) {
      var imageUrl = shopImageSelectRef.current.getImageUrl()
    }
    if (groupPermissions?.length > 0) {
      form.validateFields().then((values) => {
        const formData = { ...values }
        formData.staff.permissionIds = permissionIds
        formData.staff.thumbnail = imageUrl
        staffDataService
          .updateStaffAsync(values.staff)
          .then((response) => {
            if (response === true) {
              message.success(pageData.staffUpdatedSuccessfully)
              onCompleted()
            } else {
              message.error(pageData.staffUpdatedFailed)
            }
          })
          .catch((errs) => {
            form.setFields(getValidationMessagesWithParentField(errs, 'staff'))
          })
      })
    } else {
      form.validateFields().then(() => {
        groupPermissionStaff.forEach((_, index) => {
          form.setFields([
            {
              name: ['groupPermissionStaff', index, 'groupPermissionIds'],
              errors: [pageData.permission.selectGroup.validateMessage]
            }
          ])
        })
      })
    }
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
  const [activeTabKey, setTab] = useState(0)
  const [permissionIds, setPermissionIds] = useState([])
  const onChangePermission = (e, index) => {
    if (e.target.checked) {
      setPermissionIds(ids => [...ids, groupPermissions[activeTabKey]?.permissions[index]?.id])
    }
    else {
      setPermissionIds(ids => ids.filter(id => id != groupPermissions[activeTabKey]?.permissions[index]?.id))
    }
  }
  const onSelectAllGroups = (event) => {
    if (event.target.checked) {
      setPermissionIds([])
      let allpermission = [];
      groupPermissions.forEach(gp => {
        allpermission = gp.permissions.reduce((acc, curr) => {
          return acc.concat(curr.id)
        }, allpermission)
      })
      setPermissionIds(allpermission)
    }
    else {
      setPermissionIds([])
    }
  }
  const renderGroupPermission = () => {
    // return groupPermissionStaff.map((item, index) => {
    //   return (
    //     <Row key={index} gutter={[16, 16]}>
    //       <Col xs={22} sm={22} lg={22}>
    //         <Row className="group-permission-item" gutter={[22, 18]}>
    //           <Col xs={24} sm={24} lg={12}>
    //             <div className="select-all">
    //               <Checkbox checked={item.selectedAllGroups} onChange={(event) => onSelectAllGroups(event, index)}>
    //                 {pageData.permission.allGroup}
    //               </Checkbox>
    //             </div>
    //             <Form.Item
    //               hidden={item?.selectedAllGroups}
    //               label={pageData.permission.selectGroup.label}
    //               name={['groupPermissionStaff', index, 'permissionGroupId']}
    //               rules={[
    //                 {
    //                   required: item?.selectedAllGroups
    //                     ? false
    //                     : item?.groupIds?.length > 0
    //                       ? false
    //                       : pageData.permission.selectGroup.required,
    //                   message: pageData.permission.selectGroup.validateMessage
    //                 }
    //               ]}
    //             >
    //               <FnbSelectMultiple
    //                 disabled={item?.selectedAllGroups || item.selectedAllGroups}
    //                 showArrow
    //                 placeholder={pageData.permission.selectGroup.placeholder}
    //                 option={item?.selectedAllGroups ? [] : groupPermissions}
    //                 onChange={(values, item) => onUpdateGroupPermission(index, values, true)}
    //               />
    //             </Form.Item>

    //             <Form.Item
    //               name={['groupPermissionStaff', index, 'groupPermissionIds']}
    //               className="select-control"
    //               label={pageData.permission.selectGroup.label}
    //               hidden={!item?.selectedAllGroups}
    //             >
    //               <FnbSelectMultiple
    //                 className={item?.selectedAllGroups ? 'hide-select-option' : ''}
    //                 disabled={true}
    //               ></FnbSelectMultiple>
    //             </Form.Item>
    //           </Col>
    //         </Row>
    //       </Col>

    //       {groupPermissionStaff?.length > 1 && (
    //         <Col className="btn-remove-icon" xs={2} sm={2} lg={1}>
    //           <Tooltip placement="top" title={t('button.delete')} color="#50429B">
    //             <TrashFill
    //               onClick={() => onRemoveGroupPermission(index)}
    //               className="icon-del mt-4 pt-2 float-right"
    //             />
    //           </Tooltip>
    //         </Col>
    //       )}
    //     </Row>
    //   )
    // })
    return (
      <Row>
        {/* <Col className="select-all" >
            <Checkbox checked={groupPermissions.reduce((totalLength,current)=>totalLength+current.permissions.length,0) === permissionIds.length} onChange={(event) => onSelectAllGroups(event)}>
                {pageData.permission.allGroup}
            </Checkbox>
        </Col> */}
        <Card
          className='w-100'
          tabList={groupPermissions?.reduce((acc, cur, index) => {
            return acc.concat({ key: index, tab: cur.name })
          }, [])}
          onTabChange={key => setTab(key)}
        >
          <Row gutter={[8, 16]}>
            {
              groupPermissions[activeTabKey]?.permissions?.map((p, index) => {
                return (
                  <Col key={index} span={24}>
                    <Checkbox
                      checked={activeTabKey == 0 ? groupPermissions.reduce((totalLength, current) => totalLength + current.permissions.length, 0) === permissionIds.length ? true : false : permissionIds.includes(p.id)}
                      onChange={e => activeTabKey == 0 ? onSelectAllGroups(e) : onChangePermission(e, index)}
                    >
                      {pageData.permission.allpermission[activeTabKey][index]}
                    </Checkbox>
                  </Col>
                )
              })
            }
          </Row>
        </Card>
      </Row>

    )
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

  function updateDateFields(event) {
    setDisableSaveButton(false)
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
        <Col xs={24} sm={24} lg={12} className='edit-title'>
          <p className="card-header">
            <PageTitle content={pageData.editingStaff} />
          </p>
          <ShopActiveStatus status={staff?.isActive}/>
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

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} lg={12}>
                <Form.Item
                  name={['staff', 'staffId']}
                  hidden={true}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name={['staff', 'phoneNumber']}
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
                    className="shop-input"
                    placeholder={pageData.generalInformation.phoneNumber.placeholder}
                    maxLength={pageData.generalInformation.phoneNumber.maxLength}
                  />
                </Form.Item>

                <Form.Item
                  name={['staff', 'birthday']}
                  label={pageData.generalInformation.birthDay.label}

                >
                  <DatePicker
                    className="w-100 shop-input"
                    format={DateFormat.DD_MM_YYYY}
                    placeholder={pageData.generalInformation.birthDay.placeholder}
                    disabledDate={disabledDate}
                    onChange={(event) => updateDateFields(event)}
                  />
                </Form.Item>
                <div className='shop-card-status'>
                  <h3 className='mr-5'>{pageData.active}</h3>
                  <Form.Item name={['staff','isActive']}>
                    <ChangeStatusButton onChange={onChangeStatus}/>
                  </Form.Item>
                </div>
              </Col>

              <Col xs={24} sm={24} lg={12}>
                <Form.Item
                  name={['staff', 'fullName']}
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
                    className="shop-input"
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
                  <Input className="shop-input" placeholder={pageData.generalInformation.email.placeholder} />
                </Form.Item>

                <Form.Item
                  initialValue={true}
                  className="gender-control"
                  name={['staff', 'gender']}
                  label={pageData.generalInformation.gender.label}
                >
                  <Radio.Group>
                    <Radio checked={staff?.gender === 1} value={2}>{pageData.generalInformation.gender.female}</Radio>
                    <Radio checked={staff?.gender === 0} value={1}>{pageData.generalInformation.gender.male}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Card className="w-100 shop-card h-auto">
                  <h4 className="title-group">{pageData.media.upload}</h4>
                  <FnbImageSelectComponent
                    ref={shopImageSelectRef}
                    customTextNonImageClass={'create-edit-product-text-non-image'}
                    customNonImageClass={'create-edit-product-non-image'}
                  />
                </Card>
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
            {/* <Button className="mt-4" icon={<PlusOutlined />} onClick={() => onAddGroupPermissionAndBranch()}>
              {pageData.permission.btnAddGroup}
            </Button> */}
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
