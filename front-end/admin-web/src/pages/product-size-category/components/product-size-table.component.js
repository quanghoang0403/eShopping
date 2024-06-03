import { Button, Col, Row, Tooltip, message } from 'antd';
import { FnbModal } from 'components/shop-modal/shop-modal-component'
import { ShopTable } from 'components/shop-table/shop-table';
import { PermissionKeys } from 'constants/permission-key.constants';
import ProductSizeDataService from 'data-services/product/product-size-data.service';
import { useTranslation } from 'react-i18next'
import { getAllPermissions } from 'utils/helpers';
import './product-size-table.component.scss'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import { useEffect, useState } from 'react';
import CreateProductSizeModal from './create-product-size.component';
import { EditButtonComponent } from 'components/edit-button/edit-button.component';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import EditProductSizeModal from './edit-product-size.component';
import PageTitle from 'components/page-title';

export default function TableProductSize(props){
  const [t] = useTranslation();
  const permissions = getAllPermissions()
  const [openCreateModal,setOpenCreateModal] = useState(false)
  const [openEditModal,setOpenEditModal] = useState(false)
  const [currentProductSize,setCurrentProductSize] = useState(null)
  const [dataFilter,setDataFilter] = useState(null)
  const {
    currentProductSizeCategory,
    isOpenProductSizeTable,
    setOpenProductSizeTable,
    setIsChangeData,
    allProductSizeCategory
  } = props
  const [dataSource,setDataSource] = useState(null)
  const pageData={
    btnCancel: t('button.cancel'),
    title:t('productSize.title'),
    messageDeleteSuccess:t('productSize.messageDeleteSuccess'),
    table: {
      searchPlaceholder: t('table.searchPlaceholder'),
      no: t('table.no'),
      name: t('table.name'),
      priority: t('table.priority'),
      product: t('table.product'),
      action: t('table.action')
    },
    btnDelete: t('button.delete'),
    btnIgnore: t('button.ignore'),
    confirmDelete: t('dialog.confirmDelete'),
    confirmDeleteMessage: t('dialog.confirmDeleteMessage')
  }

  const onCancel = ()=>{
    setOpenProductSizeTable(false)
  }

  const formatDeleteMessage = (name) => {
    const mess = t(pageData.confirmDeleteMessage, { name })
    return mess
  }

  const onRemoveItem = async id =>{
    const res = await ProductSizeDataService.DeleteProductSizeAsync(id)
    if(res){
      message.success(pageData.messageDeleteSuccess)
      setIsChangeData(true)
      setOpenProductSizeTable(false)
    }
  }

  const mappingRecordToColumns = (item,index) => {
    return {
      key: item?.id,
      id: item?.id,
      name: item?.name,
      no: index+1,
      priority: item?.priority,
      productSizeCategoryId:item?.productSizeCategoryId
    }
  }

  const fetchDataTable = ()=>{
    const data = currentProductSizeCategory?.productSizes?.map((s,k)=>mappingRecordToColumns(s,k))
    setDataSource(data)
    setDataFilter(data)
  }

  const onEditItem = record =>{
    console.log(record)
    setCurrentProductSize(record)
    setOpenEditModal(true)
  }

  useEffect(()=>{
    if(currentProductSizeCategory){
      fetchDataTable()
    }
  },[currentProductSizeCategory])

  const columns = [
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
      width: '50%',
      className: 'category-name-column',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => <Tooltip title={record?.name}>{record?.name}</Tooltip>
    },
    {
      title: pageData.table.priority,
      key: 'priority',
      dataIndex: 'priority',
      width: '20%',
      align: 'center'
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
                permission={PermissionKeys.EDIT_PRODUCT}
              />
            )}

            {permissions?.find((x) => x?.id?.toString().toUpperCase() === PermissionKeys.EDIT_PRODUCT) && (
              <DeleteConfirmComponent
                title={pageData.confirmDelete}
                content={formatDeleteMessage(record?.name)}
                okText={pageData.btnDelete}
                cancelText={pageData.btnIgnore}
                permission={PermissionKeys.EDIT_PRODUCT}
                onOk={() => onRemoveItem(record?.id)}
              />
            )}
          </>
        )
      }
    }
  ]

  const onSearch = (keySearch)=>{
    setDataFilter(data=>{
      if(keySearch === '') return dataSource
      return data.filter(d=>d.name.trim().toLowerCase().includes(keySearch))
    })
  }

  const tableProductSize = (
    <Row>
      <Col className="category-title-box" xs={24} sm={12}>
        <PageTitle content={pageData.title} />
      </Col>
      <Col span={12} sp className="button-box product-filter-box page-action-group">
        <ActionButtonGroup
          arrayButton={[
            {
              action: (
                <ShopAddNewButton
                  permission={PermissionKeys.CREATE_PRODUCT}
                  onClick={() => setOpenCreateModal(true)}
                  text={t('button.add')}
                />
              ),
              permission: PermissionKeys.CREATE_PRODUCT
            },
            {
              action:(
                <Button onClick={onCancel} danger>{pageData.btnCancel}</Button>
              ),
              permissions: 'public'
            }
          ]}
        />
      </Col>
      <ShopTable
        columns={columns}
        dataSource={dataFilter}
        total={currentProductSizeCategory?.productSizes?.length}
        editPermission={PermissionKeys.EDIT_PRODUCT}
        deletePermission={PermissionKeys.EDIT_PRODUCT}
        search={{
          onChange: onSearch
        }}
      />
    </Row>

  );

  return(
    <>
      <FnbModal
        title={currentProductSizeCategory?.name}
        visible={isOpenProductSizeTable}
        cancelText={pageData.btnCancel}
        handleCancel={onCancel}
        content={tableProductSize}
        className={'table-product-size'}
        closable
        footer={null}
      />
      <CreateProductSizeModal
        visible={openCreateModal}
        openModal={setOpenCreateModal}
        setIsChangeData={setIsChangeData}
        allProductSizeCategory={allProductSizeCategory}
        currentProductSizeCategory={currentProductSizeCategory}
        setOpenProductSizeTable={setOpenProductSizeTable}
      />
      <EditProductSizeModal
        visible={openEditModal}
        productSize={currentProductSize}
        openModal={setOpenEditModal}
        setIsChangeData={setIsChangeData}
        allProductSizeCategory={allProductSizeCategory}
        setOpenProductSizeTable={setOpenProductSizeTable}
      />
    </>

  )
}