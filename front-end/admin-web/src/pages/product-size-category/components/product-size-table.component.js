import { Col, Input, Modal, Row, Table, message } from 'antd';
import { PermissionKeys } from 'constants/permission-key.constants';
import ProductSizeDataService from 'data-services/product/product-size-data.service';
import { useTranslation } from 'react-i18next'
import { getAllPermissions } from 'utils/helpers';
import './product-size-table.component.scss'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import { useEffect, useState } from 'react';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import PageTitle from 'components/page-title';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import ProductSizeCategoryDataService from 'data-services/product-category/product-size-category-data.service';

export default function TableProductSize(props){
  const [t] = useTranslation();
  const permissions = getAllPermissions()
  const {
    currentProductSizeCategory,
    isOpenProductSizeTable,
    setOpenProductSizeTable,
    setIsChangeData
  } = props
  const [dataSource,setDataSource] = useState(null)
  const pageData={
    btnCancel: t('button.cancel'),
    title:t('productSize.title'),
    messageDeleteSuccess:t('productSize.messageDeleteSuccess'),
    labelName :t('productSizeCategory.labelName'),
    placeholderName:t('productSizeCategory.placeholderName') ,
    validateName:t('productSizeCategory.validateName'),
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
    confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
    successCreateProductSize:t('productSizeCategory.successCreateProductSize'),
    successEditProductSize:t('productSizeCategory.successEditProductSize'),
    failUpdate:t('productSizeCategory.messageUpdateFail')
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
      handleSyncData(currentProductSizeCategory?.productSizes)
    }
  }

  const mappingRecordToColumns = (item,index) => {
    return {
      id: item?.id,
      name: item?.name,
      no: index+1,
      priority: currentProductSizeCategory.productSizes.length - index+1,
      productSizeCategoryId:item?.productSizeCategoryId
    }
  }

  const fetchDataTable = ()=>{
    const data = currentProductSizeCategory?.productSizes?.map((s,k)=>mappingRecordToColumns(s,k))
    setDataSource(data)
  }

  useEffect(()=>{
    if(currentProductSizeCategory){
      fetchDataTable()
    }
  },[currentProductSizeCategory])

  const setProductSizeName = (name,index)=>{
    const data = [...dataSource]
    data[index].name = name
    setDataSource(data)
  }

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
      width: '60%',
      className: 'category-name-column',
      ellipsis: {
        showTitle: false
      },
      render: (_, record,index) => (
        <div>
          <Input className='shop-input' value={record?.name} placeholder={pageData.placeholderName} onChange={e=>setProductSizeName(e.target.value,index)}/>
          <p className={`text-danger m-1 ${record?.name !== '' && 'd-none'}`}>{pageData.validateName}</p>
        </div>
      )

    },
    {
      title: pageData.table.action,
      key: 'action',
      width: '30%',
      align: 'center',
      render: (_, record) => {
        return (
          <>
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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1
      }
    }),
  );

  const handleSyncData = data =>{
    const newData = data.map((d,index)=>mappingRecordToColumns(d,index))
    setDataSource(newData)
  }

  const handleUpdateProductSize = async()=>{
    const nameIsBlank = dataSource.some(d=>d.name === '')
    if(!nameIsBlank){
      const data = {
        id:currentProductSizeCategory.id,
        name:currentProductSizeCategory.name,
        productSizes: dataSource
      }
      const res = await ProductSizeCategoryDataService.UpdateProductSizeCategoryAsync(data)
      if(res){
        message.success(pageData.successEditProductSize)
        setIsChangeData(true)
        handleSyncData(currentProductSizeCategory?.productSizes)
      }
    }
    else{
      message.error(pageData.failUpdate)
      handleSyncData(currentProductSizeCategory?.productSizes)
    }
  }

  const handleAddProductSize = async()=>{
    const newProductSize = {
      name: `new product size ${dataSource.length+1}`,
      priority: 1,
      productSizeCategoryId: currentProductSizeCategory.id
    }
    const res = await ProductSizeDataService.CreateProductSizeAsync(newProductSize)
    if(res){
      message.success(pageData.successCreateProductSize)
      setIsChangeData(true)
      handleSyncData(currentProductSizeCategory?.productSizes)
    }
  }

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldData = dataSource
      const activeIndex = oldData.findIndex((i) => i.id === active.id);
      const overIndex = oldData.findIndex((i) => i.id === over?.id);
      const newData = arrayMove(oldData, activeIndex, overIndex);
      handleSyncData(newData)
    }
  };

  const rowComponents = {
    rows: (props) => {
      const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key']
      });
      const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
        ...(isDragging
          ? {
            position: 'relative',
            zIndex: 9999
          }
          : {})
      };
      return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
    }
  }

  const tableProductSize = (
    <Row>
      <Col className="category-title-box" xs={24} sm={12}>
        <PageTitle content={pageData.title} />
      </Col>
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={currentProductSizeCategory?.productSizes.map(d=>d.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            className='shop-table form-table'
            columns={columns}
            dataSource={dataSource}
            total={currentProductSizeCategory?.productSizes?.length}
            editPermission={PermissionKeys.EDIT_PRODUCT}
            deletePermission={PermissionKeys.EDIT_PRODUCT}
            components={{
              body: {
                row: rowComponents.rows
              }
            }}
            rowKey="id"
          />
        </SortableContext>
      </DndContext>
      <ShopAddNewButton
        permission={PermissionKeys.CREATE_PRODUCT}
        onClick={() => handleAddProductSize()}
        text={t('button.add')}
      />
    </Row>

  );

  return(
    <>
      <Modal
        title={currentProductSizeCategory?.name}
        open={isOpenProductSizeTable}
        cancelText={pageData.btnCancel}
        onCancel={onCancel}
        className={'table-product-size modal-component '}
        closable
        footer={null}
        afterClose={handleUpdateProductSize}
      >
        {tableProductSize}
      </Modal>
      {/* <CreateProductSizeModal
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
      /> */}
    </>

  )
}