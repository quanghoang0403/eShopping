import { PlusSquareOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Layout, message, Radio, Row, Space, Tooltip } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME, EmptyId, PHONE_NUMBER_REGEX } from 'constants/default.constants'
import { TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getValidationMessagesWithParentField } from 'utils/helpers'
import { useTranslation } from 'react-i18next'
import '../staff.page.scss'
import permissionDataService from 'data-services/permission/permission-data.service'
import staffDataService from 'data-services/staff/staff-data.service'
import product from 'pages/product'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component'
const { Content } = Layout

export function CreateNewStaff(props) {
  const shopImageSelectRef = useRef(null)
  const history = useHistory()
  const { t } = useTranslation()
  // eslint-disable-next-line no-unused-vars
  const [formHasValue, setFormHasValue] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [disableSaveButton, setDisableSaveButton] = useState(true)
  const [isChangeForm, setIsChangeForm] = useState(false)
  // #region Page data
  const pageData = {
    btnCancel: t('button.cancel'),
    btnCreate: t('button.createNewStaff'),
    createStaff: t('staff.createStaff'),
    btnDiscard: t('button.discard'),
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
        label: t('staff.gender'),
        male: t('staff.male'),
        female: t('staff.female'),
        validateMessage: t('staff.validateGender')
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
          t('staff.permissionStoreWeb'),
        ],
      ],
      btnAddGroup: t('staff.btnAddGroupPermission'),
      allGroup: t('staff.allGroupPermission')
    },
    staffAddedSuccessfully: t('staff.staffAddedSuccessfully'),
    staffAddedFailed: t('staff.staffAddedFailed')
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
    const fetchPrepareCreateNewStaffData = async () => {
      const response = await permissionDataService.getAllPermissionAsync();
      if (response) {
        const permissionGroups = response
        setGroupPermissions(permissionGroups.slice(0, -1))
      }
    }
    fetchPrepareCreateNewStaffData()
  }, [])
  const onClickSaveStaff = () => {
    if (shopImageSelectRef && shopImageSelectRef.current) {
      var imageUrl = shopImageSelectRef.current.getImageUrl()
    }
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
        // formData.groupPermissionStaff = newGroups
        formData.staff.permissionIds = permissionIds
        formData.staff.birthday = formData.staff.birthday
        formData.staff.thumbnail = imageUrl
        console.log(formData)
          ? moment.utc(formData.staff.birthday).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2)
          : null
        staffDataService
          .createNewStaffAsync(formData.staff)
          .then((response) => {
            if (response === true) {
              setFormHasValue(false)
              onCompleted({
                savedSuccessfully: true,
                message: pageData.staffAddedSuccessfully
              })
            } else {
              message.error(pageData.staffAddedFailed)
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
  /**
   * This method is used to set value for the variable 'isSelectedAllGroups', it will be called when the user clicks on the control.
   * @param  {CheckboxChangeEvent} event The event data
   */
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
  const renderGroupPermissionAndBranch = () => {
    // return groupPermissionStaff?.length === 0
    //   ? (
    //   <div className="permission-placeholder">{pageData.permission.permissionPlaceholder}</div>
    //     )
    //   : (
    //       groupPermissionStaff.map((item, index) => (
    //     <Row key={index} gutter={[16, 16]}>
    //       <Col xs={22} sm={22} lg={22}>
    //         <Row className="group-permission-item" gutter={[22, 18]}>
    //           <Col xs={24} sm={24} lg={12}>
    //             <div className="select-all">
    //               <Checkbox onChange={(event) => onSelectAllGroups(event, index)}>
    //                 {pageData.permission.allGroup}
    //               </Checkbox>
    //             </div>

    //             <Form.Item
    //               hidden={item?.selectedAllGroups}
    //               className="select-control"
    //               label={pageData.permission.selectGroup.label}
    //               name={['staff', 'PermissionIds']}
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
    //                 disabled={item?.selectedAllGroups}
    //                 showArrow
    //                 placeholder={pageData.permission.selectGroup.placeholder}
    //                 option={item?.selectedAllGroups ? [] : groupPermissions}
    //                 onChange={(values) => onUpdateGroupPermission(index, values, true)}
    //               />
    //             </Form.Item>

    //             <Form.Item
    //               name={['groupPermissionStaff', index, 'tmpGroupPermissionIds']}
    //               className="select-control"
    //               label={pageData.permission.selectGroup.label}
    //               hidden={!item?.selectedAllGroups}
    //             >
    //               <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
    //             </Form.Item>
    //           </Col>
    //         </Row>
    //       </Col>

    //       <Col className="btn-remove-icon" xs={2} sm={2} lg={1}>
    //         <Tooltip placement="top" title={t('button.delete')} color="#50429B">
    //           <TrashFill
    //             onClick={() => onRemoveGroupPermissionAndBranch(index)}
    //             className="icon-del mt-4 pt-2 float-right"
    //           />
    //         </Tooltip>
    //       </Col>
    //     </Row>
    //       ))
    //     )

    return (
      <Row>
        {/*         
        <Col className="select-all" >
            <Checkbox checked={groupPermissions.reduce((totalLength,current)=>totalLength+current.permissions.length,0) === permissionIds.length} onChange={(event) => onSelectAllGroups(event)}>
                {pageData.permission.allGroup}
            </Checkbox>
        </Col>
         */}
        <Card
          style={{
            width: '100%',
          }}
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

  function updateDateFields(event) {
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
      <Row className="shop-row-page-header">
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
          <Card className="shop-box custom-box">
            <Row className="group-header-box">
              <Col xs={24} sm={24} lg={24}>
                {pageData.generalInformation.title}
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} lg={12}>
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
                  onChange={(event) => updateDateFields(event)}
                >
                  <DatePicker
                    className="w-100 shop-input"
                    format={DateFormat.DD_MM_YYYY}
                    placeholder={pageData.generalInformation.birthDay.placeholder}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
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
                  rules={[{
                    required: true,
                    message: pageData.generalInformation.gender.validateMessage
                  }]}
                >
                  <Radio.Group>
                    <Radio value={2}>{pageData.generalInformation.gender.female}</Radio>
                    <Radio value={1}>{pageData.generalInformation.gender.male}</Radio>
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
          <Card className="shop-box group-permission custom-box">
            <Row className="group-header-box">
              <Col className="items-in-group-header-box mt-4" xs={24} sm={24} lg={24}>
                <span>{pageData.permission.title}</span>
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
