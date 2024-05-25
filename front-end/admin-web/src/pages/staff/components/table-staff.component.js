import React, { useEffect, useState } from 'react'
import { Form, Row, Space, message } from 'antd'
import { executeAfter } from 'utils/helpers'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { EditButtonComponent } from 'components/edit-button/edit-button.component'
import { FnbTable } from 'components/shop-table/shop-table'
import TooltipParagraph from 'components/shop-tooltip-paragraph/shop-tooltip-paragraph'
import { FnbViewMoreComponent } from 'components/shop-view-more/shop-view-more'
import FilterStaff from './filter-staff.component'
import { useTranslation } from 'react-i18next'
import staffDataService from 'data-services/staff/staff-data.service'
import permissionDataService from 'data-services/permission/permission-data.service'

export default function TableStaff(props) {
  const { onEditStaff, screenKey } = props
  const [t] = useTranslation()
  const [dataSource, setDataSource] = useState([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [numberRecordCurrent, setNumberRecordCurrent] = useState()
  const [permissions, setPermissions] = useState([])
  const [countFilter, setCountFilter] = useState(0)
  const [selectedPermissionId, setSelectedPermissionId] = useState(null)
  const [keySearch, setKeySearch] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [showPopover, setShowPopover] = useState(true)
  const clearFilterFunc = React.useRef(null)

  const pageData = {
    searchPlaceholder: t('table.searchPlaceholder'),
    btnFilter: t('button.filter'),
    btnDelete: t('button.delete'),
    btnIgnore: t('button.ignore'),
    table: {
      no: t('table.no'),
      name: t('table.name'),
      phone: t('table.phone'),
      group: t('table.group'),
      action: t('table.action')
    },
    confirmDelete: t('dialog.confirmDelete'),
    confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
    staffDeleteSuccess: t('staff.staffDeleteSuccess'),
    staffDeleteFail: t('staff.staffDeleteFail')
  }
  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.no,
        dataIndex: 'index',
        key: 'index',
        width: '138px',
        align: 'left'
      },
      {
        title: pageData.table.name,
        dataIndex: 'name',
        key: 'name',
        width: '238px',
        render: (_, record) => {
          return (
            <div className="width-name text-overflow">
              <TooltipParagraph>{record.name}</TooltipParagraph>
            </div>
          )
        }
      },
      {
        title: pageData.table.phone,
        dataIndex: 'phone',
        key: 'phone',
        width: '185px',
        render: (_, record) => {
          return (
            <div className="width-phone text-overflow">
              <TooltipParagraph>{record.phone}</TooltipParagraph>
            </div>
          )
        }
      },
      {
        title: pageData.table.group,
        dataIndex: 'groupsName',
        key: 'groupsName',
        width: '375px',
        render: (values, record) => {
          const maxLine = 5
          const renderGroups = values?.map((groupName, index) => {
            const group = record.groups.find((item) => item.name === groupName)
            if (index < maxLine - 1) {
              return (

                <div key={index} className="width-group text-overflow">
                  <TooltipParagraph>
                    <a>{groupName}</a>
                  </TooltipParagraph>
                </div>

              )
            }
            if (index === maxLine) {
              return (
                <div key={index} className="view-more">
                  <FnbViewMoreComponent isLink={true} title={`Group (${values?.length})`} content={record?.groups} />
                </div>
              )
            }
          })
          return renderGroups
        }
      },

      {
        title: pageData.table.action,
        key: 'action',
        width: '99px',
        align: 'center',
        render: (_, record) => {
          if (record.isInitialStoreAccount === true) {
            return <></>
          }

          return (
            <>
              <Space size="middle">
                {<EditButtonComponent className="mr-3" onClick={() => onEditStaff(record.id)} />}
                {
                  <DeleteConfirmComponent
                    title={pageData.confirmDelete}
                    content={formatDeleteMessage(record?.name)}
                    okText={pageData.btnDelete}
                    cancelText={pageData.btnIgnore}
                    onOk={() => handleDeleteItem(record.id)}
                  />
                }
              </Space>
            </>
          )
        }
      }
    ],

    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, '')
    },
    onSearch: async (serchKey) => {
      setKeySearch(serchKey)
      executeAfter(500, async () => {
        await fetchDatableAsync(1, tableSettings.pageSize, serchKey)
      })
    }
  }

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, keySearch)
  }, [])

  const handleDeleteItem = async (id) => {
    const res = await staffDataService.deleteStaffByIdAsync(id)
    if (res) {
      message.success(pageData.staffDeleteSuccess)

      // Recount selected items after delete
      const newSelectedRowKeys = selectedRowKeys?.filter((x) => x !== id)
      if (newSelectedRowKeys) {
        setSelectedRowKeys(newSelectedRowKeys)
      }
    } else {
      message.error(pageData.staffDeleteFail)
    }
    await fetchDatableAsync(1, tableSettings.pageSize, keySearch)
  }

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    const mess = t(pageData.confirmDeleteMessage, { name })
    return mess
  }

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch, permissionId = null) => {
    if (!pageNumber || !pageSize) {
      return
    }

    let dataRequest = {
      pageNumber,
      pageSize,
      keySearch,
      screenKey
    }

    if (permissionId) {
      dataRequest = {
        ...dataRequest,
        groupPermissionId: permissionId
      }
    }

    const response = await staffDataService.getDataStaffManagementAsync(dataRequest)
    const data = response?.result.map((s) => mappingRecordToColumns(s))
    setDataSource(data)
    setTotalRecords(response?.paging?.total)
    setCurrentPageNumber(response?.paging?.pageIndex)
    let numberRecordCurrent = pageNumber * pageSize
    if (numberRecordCurrent > response.total) {
      numberRecordCurrent = response.total
    }
    setNumberRecordCurrent(numberRecordCurrent)
  }

  const mappingRecordToColumns = (staff) => {
    return {
      key: staff?.id,
      index: staff?.no,
      id: staff?.id,
      name: staff?.fullName,
      phone: staff?.phoneNumber,
      groups: mappingGroups(staff?.permissions),
      groupsName: staff?.permissions?.map((g) => g.name || '')
    }
  }

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true)
    }

    const resPermission = await permissionDataService.getAllPermissionAsync()
    if (resPermission) {
      const allPermissionOption = {
        id: '',
        name: t('staff.allGroupPermission')
      }
      const PermissionOptions = [allPermissionOption, ...resPermission]
      setPermissions(PermissionOptions)
    }
  }

  const handleFilterProduct = async (data) => {
    setSelectedPermissionId(data?.permissionId)
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, '', data?.permissionId)
    setCountFilter(data?.count)
  }

  const onSelectItemFilter = (key) => {
    if (countFilter > 0 && key === '') {
      setCountFilter(countFilter - 1)
    } else {
      setCountFilter(countFilter + 1)
    }
  }

  const onResetFilter = async () => {
    setCountFilter(0)
    setSelectedPermissionId('')
    await fetchDatableAsync(1, tableSettings.pageSize, keySearch)
  }
  const mappingGroups = (groups) => {
    const listGroup = []
    groups?.map((item) => {
      const group = {
        id: item?.id,
        name: item?.name,
        link: ``
      }
      listGroup.push(group)
    })

    return listGroup
  }

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterStaff
          onShowFilter={setShowFilter}
          fetchDataProducts={handleFilterProduct}
          groupPermissions={permissions}
          onSelectItemFilter={onSelectItemFilter}
          onResetFilter={onResetFilter}
          selectedPermissionId={selectedPermissionId}
          tableFuncs={clearFilterFunc}
        />
      )
    )
  }

  const onClearFilter = (e) => {
    clearFilterFunc.current()
    setShowPopover(false)
  }

  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  return (
    <Form className="form-staff">
      <Row className="mt-4">
        <FnbTable
          className="mt-4"
          columns={tableSettings.columns}
          pageSize={tableSettings.pageSize}
          dataSource={dataSource}
          currentPageNumber={currentPageNumber}
          total={totalRecords}
          onChangePage={tableSettings.onChangePage}
          search={{
            placeholder: pageData.searchPlaceholder,
            onChange: tableSettings.onSearch
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: onSelectedRowKeysChange,
            columnWidth: 40
          }}
          filter={{
            onClickFilterButton,
            totalFilterSelected: countFilter,
            onClearFilter,
            buttonTitle: pageData.btnFilter,
            component: filterComponent()
          }}
        />
      </Row>
    </Form>
  )
}
