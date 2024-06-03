import { Form, Row, Tooltip, message } from 'antd'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { EditButtonComponent } from 'components/edit-button/edit-button.component'
import { ShopTable } from 'components/shop-table/shop-table'
import { tableSettings } from 'constants/default.constants'
import { ViewMoreIcon } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import ProductSizeCategoryDataService from 'data-services/product-category/product-size-category-data.service'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { executeAfter, getAllPermissions } from 'utils/helpers'
import TableProductSize from './product-size-table.component'
import { useCurrentProductSizeCategoryContext } from '../product-size-category.page'

export default function TableProductSizeCategory(props) {
  const {isChangeData, setIsChangeData, setOpenEditModal, setCurrentProductSizeCategory} = props
  const { t } = useTranslation()
  const [dataSource, setDataSource] = useState([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [isOpenProductSizeTable,setOpenProductSizeTable] = useState(false)
  const currentProductSizeCategory = useCurrentProductSizeCategoryContext()
  const permissions = getAllPermissions()
  const pageData = {
    btnFilter: t('button.filter'),
    btnDelete: t('button.delete'),
    btnIgnore: t('button.ignore'),
    confirmDelete: t('dialog.confirmDelete'),
    confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
    productCategoryDeleteSuccess: t('productCategory.productCategoryDeleteSuccess'),
    productCategoryUpdateSuccess: t('productCategory.productCategoryUpdateSuccess'),
    productCategoryDeleteFail: t('productCategory.productCategoryDeleteFail'),
    table: {
      searchPlaceholder: t('table.searchPlaceholder'),
      no: t('table.no'),
      name: t('table.name'),
      priority: t('table.priority'),
      product: t('table.product'),
      action: t('table.action')
    },
    viewAll:t('productSizeCategory.viewAll')
  }
  const fetchDataTableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await ProductSizeCategoryDataService.GetProductSizesCategoriesAsync(pageNumber, pageSize, keySearch);
    const data = response?.result?.map((s) => mappingRecordToColumns(s));
    setDataSource(data);
    setTotalRecords(response?.paging?.total);
    setCurrentPageNumber(response?.paging?.pageIndex);
  }

  const onRemoveItem = async (id) => {
    try {
      const res = await ProductSizeCategoryDataService.DeleteProductSizeCategoryAsync(id);
      if (res) {
        message.success(pageData.productCategoryDeleteSuccess);

        // Recount selected items after delete
        const newSelectedRowKeys = selectedRowKeys?.filter((x) => x !== id);
        if (newSelectedRowKeys) {
          setSelectedRowKeys(newSelectedRowKeys);
        }
      } else {
        message.error(pageData.productCategoryDeleteFail);
      }
      await fetchDataTableAsync(currentPageNumber, tableConfigs.pageSize, '');
    } catch (error) {
      console.log(error);
    }
  }

  const onEditItem = (item) => {
    console.log(item)
    setOpenEditModal(true)
    setCurrentProductSizeCategory(item)
  }

  const formatDeleteMessage = (name) => {
    const mess = t(pageData.confirmDeleteMessage, { name })
    return mess
  }

  const onOpenProductSizeTable = (record)=>{
    setCurrentProductSizeCategory(record)
    setOpenProductSizeTable(true)
  }

  const tableConfigs = {
    pageSize: tableSettings.pageSize,
    columns: [
      {
        title: pageData.table.no,
        dataIndex: 'no',
        key: 'no',
        width: '10%',
        align: 'right'
      },
      {
        title: pageData.table.name,
        dataIndex: 'name',
        key: 'name',
        width: '45%',
        className: 'category-name-column',
        ellipsis: {
          showTitle: false
        },
        render: (_, record) => <Tooltip title={record?.name}>{record?.name}</Tooltip>
      },
      {
        title: pageData.table.product,
        dataIndex: 'numberOfProductSize',
        key: 'numberOfProductSize',
        width: '25%',
        align: 'center',
        render:(text,record)=>{
          return(
            <div onClick={()=>onOpenProductSizeTable(record)} className='w-100 d-flex justify-content-center'>
              <b className='mx-2'>{text}</b>
              <ViewMoreIcon className="style-icon-view-more" />
            </div>
          )
        }
      },
      {
        title: pageData.table.action,
        key: 'action',
        width: '20%',
        align: 'center',
        render: (_, record) => {
          return (
            <>
              {permissions?.find((x) => x?.id?.toString().toUpperCase() === PermissionKeys.EDIT_PRODUCT_CATEGORY) && (
                <EditButtonComponent
                  className="mr-3"
                  onClick={() => onEditItem(record)}
                  permission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
                />
              )}

              {permissions?.find((x) => x?.id?.toString().toUpperCase() === PermissionKeys.EDIT_PRODUCT_CATEGORY) && (
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatDeleteMessage(record?.name)}
                  okText={pageData.btnDelete}
                  cancelText={pageData.btnIgnore}
                  permission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
                  onOk={() => onRemoveItem(record?.id)}
                  productCategoryId={record?.id}
                  productCategoryName={record?.name}
                />
              )}
            </>
          )
        }
      }
    ],

    onChangePage: async (page, pageSize) => {
      await fetchDataTableAsync(page, pageSize, '')
    },

    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        await fetchDataTableAsync(1, tableConfigs.pageSize, keySearch)
      })
    }
  }

  const mappingRecordToColumns = (item) => {
    return {
      key: item?.id,
      id: item?.id,
      name: item?.name,
      no: item?.no,
      numberOfProductSize: item?.numberOfProductSize,
      productSizes:item?.productSizes
    }
  }

  useEffect(() => {
    if(isChangeData){
      fetchDataTableAsync(currentPageNumber, tableConfigs.pageSize, '')
      setIsChangeData(false)
    }

  }, [isChangeData])

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  return (
    <>
      <Form className="form-staff">
        <Row>
          <ShopTable
            className="mt-4"
            columns={tableConfigs.columns}
            pageSize={tableConfigs.pageSize}
            dataSource={dataSource}
            currentPageNumber={currentPageNumber}
            total={totalRecords}
            onChangePage={tableConfigs.onChangePage}
            editPermission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
            deletePermission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: onSelectedRowKeysChange,
              columnWidth: 40
            }}
            search={{
              placeholder: pageData.table.searchPlaceholder,
              onChange: tableConfigs.onSearch
            }}
          />
        </Row>
      </Form>
      <TableProductSize
        currentProductSizeCategory={currentProductSizeCategory}
        isOpenProductSizeTable={isOpenProductSizeTable}
        setOpenProductSizeTable={setOpenProductSizeTable}
        setIsChangeData={setIsChangeData}
        allProductSizeCategory={dataSource}
      />
    </>
  )
}