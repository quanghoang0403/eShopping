import { Col, Form, Image, message, Row, Space } from 'antd'
import Paragraph from 'antd/lib/typography/Paragraph'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { EditButtonComponent } from 'components/edit-button/edit-button.component'
import { FnbTable } from 'components/shop-table/shop-table'
import { PermissionKeys } from 'constants/permission-key.constants'
// import customerDataService from 'data-services/customer/customer-data.service'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import { executeAfter } from 'utils/helpers'
import '../index.scss'

export default function TableCustomer (props) {
  const [t] = useTranslation()
  const [dataSource, setDataSource] = useState([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [keySearch, setKeySearch] = useState('')
  const history = useHistory()
  const DEFAULT_PAGE_SIZE = 20
  const DEFAULT_PAGE_NUMBER = 1
  const DEFAULT_KEY_SEARCH = ''

  const pageData = {
    btnDelete: t('button:delete'),
    btnIgnore: t('button:ignore'),
    searchPlaceholder: t('table:searchPlaceholder'),
    no: t('table:no'),
    name: t('table:name'),
    phone: t('table:phone'),
    action: t('table:action'),
    confirmDelete: t('dialog:ConfirmDelete'),
    confirmDeleteCustomerMessage: t('customer:confirmDeleteCustomerMessage'),
    customerDeleteSuccess: t('customer:customerDeleteSuccess'),
    customerDeleteFail: t('customer:customerDeleteFail')
  }

  const tableSettings = {
    pageSize: DEFAULT_PAGE_SIZE,
    columns: [
      {
        title: pageData.no,
        dataIndex: 'index',
        key: 'index',
        width: '10%',
        align: 'center'
      },
      {
        title: pageData.name,
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        className: 'table-text-membership-name-overflow',
        render: (_, record) => {
          return (
            <div>
              <Link to={`/customer/detail/${record?.id}`}>
                <Paragraph
                  style={{ maxWidth: 'inherit' }}
                  placement="top"
                  ellipsis={{ tooltip: record.name }}
                  color="#50429B"
                >
                  <a className="text-customer-name-center"> {record.name}</a>
                </Paragraph>
              </Link>
            </div>
          )
        }
      },
      {
        title: pageData.phone,
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: '16%'
      },
      {
        title: pageData.action,
        key: 'action',
        width: '7%',
        align: 'center',
        render: (_, record) => (
          <Space size="middle">
            {
              <EditButtonComponent
                className="mr-3"
                onClick={() => onEditItem(record)}
                permission={PermissionKeys.EDIT_CUSTOMER}
              />
            }
            {
              <DeleteConfirmComponent
                title={pageData.confirmDelete}
                content={formatDeleteMessage(record?.name)}
                okText={pageData.btnDelete}
                cancelText={pageData.btnIgnore}
                permission={PermissionKeys.DELETE_CUSTOMER}
                onOk={() => handleDeleteItem(record.id)}
              />
            }
          </Space>
        )
      }
    ],

    onSearch: async (value) => {
      executeAfter(500, async () => {
        setKeySearch(value)
        await fetchDatableAsync(1, tableSettings.pageSize, value)
      })
    },

    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, keySearch)
    }
  }

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    const mess = t(pageData.confirmDeleteCustomerMessage, { name })
    return mess
  }

  const handleDeleteItem = async (id) => {
    // await customerDataService.deleteCustomerByIdAsync(id).then((res) => {
    //   if (res) {
    //     message.success(pageData.customerDeleteSuccess)
    //   } else {
    //     message.error(pageData.customerDeleteFail)
    //   }
    // })
    await fetchDatableAsync(DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, keySearch, dataFilter)
  }

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, DEFAULT_PAGE_SIZE, DEFAULT_KEY_SEARCH)
  }, [])

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch) => {
    // const response = await customerDataService.getCustomersAsync(
    //   keySearch,
    //   pageNumber,
    //   pageSize
    // )
    // const data = response?.customers?.map((s) => mappingRecordToColumns(s))
    // setDataSource(data)
    // setTotalRecords(response.total)
    // setCurrentPageNumber(pageNumber)
  }

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      id: item?.id,
      name: item?.fullName,
      phoneNumber: item?.phoneNumber,
      color: item?.color ?? '#efbb00'
    }
  }

  const onEditItem = (item) => {
    return history.push(`/customer/edit/${item?.id}`)
  }

  return (
    <>
      <Form className="form-staff form-filter-customer-manager">
        <Row>
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
            editPermission={PermissionKeys.EDIT_CUSTOMER}
            deletePermission={PermissionKeys.EDIT_CUSTOMER}
          />
        </Row>
      </Form>
    </>
  )
}
