import { Col, Form, Modal, Row, Select, Tooltip, Typography, Table, Divider, Button } from "antd";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { SearchIcon, TrashFill, DragDropIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { hasPermission } from "utils/helpers";
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
const { Option } = Select
const { Text } = Typography

const DragHandle = SortableHandle(() => <DragDropIcon />)
const SortableItem = SortableElement((props) => <tr {...props} />)
const SortableBody = SortableContainer((props) => <tbody {...props} />)
export default function TableBlog(props){
    const {isOpen,onCancel,record,onSelectBlog,onSearch,blogs,onHandleRemoveItem,onSubmitModal} = props
    const [t] = useTranslation()
    const pageData = {
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    addNew: t('button.addNew'),
    title: t('productCategory.manageCategory'),
    confirmDelete: t('dialog.confirmDelete'),
    confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
    productCategoryDeleteSuccess: t('productCategory.productCategoryDeleteSuccess'),
    table: {
      searchPlaceholder: t('table.searchPlaceholder'),
      no: t('table.no'),
      name: t('table.name'),
      action: t('table.action')
    }
  }
  const DraggableContainer = (props) => (
    <SortableBody useDragHandle disableAutoscroll helperclassName="row-dragging" onSortEnd={onSortEnd} {...props} />
  )
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataModal.slice(), oldIndex, newIndex).filter((el) => !!el)
      setDataModal(newData)
    }
  }
  const DraggableBodyRow = ({ ...restProps }) => {
    const index = record?.blogs?.findIndex((x,index) => x.index === restProps['data-row-key'])
    return <SortableItem style={{ zIndex: 9999 }} index={index} {...restProps} />
  }

    const renderHeaderModal = () => {
        if (hasPermission(PermissionKeys.ADMIN)) {
          return (
            <>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                value={null}
                placeholder={pageData.table.searchPlaceholder}
                showSearch
                onChange={(value) => onSelectBlog(value)}
                className="search-product-information"
                suffixIcon=""
              >
                {blogs?.filter(b=>!record?.blogs?.find(rblog=>rblog.id === b.id)).map((item) => {
                  return (
                    <Option key={item?.id} value={item?.name} className="select-product-option">
                      <Row>
                        <Col xs={6} sm={9} md={9} lg={3}>
                          <Thumbnail src={item?.thumbnail} />
                        </Col>
                        <Col xs={0} sm={0} md={0} lg={21}>
                          <Row className="group-information-product">
                            <Col span={12} className="item-information-product">
                              <Row>
                                <Col span={24} className="item-product-end text-bold">
                                  <Text strong>{item?.name}</Text>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={12} className="item-information-product">
                              <Row>
                                <Col
                                  span={24}
                                  className="item-product-end justify-right text-normal"
                                  style={{ textAlign: 'right' }}
                                >
                                  <Text>{item?.unitName}</Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={15} sm={15} md={15} lg={0} className="select-responsive">
                          <Row align="middle" justify="start">
                            <Col span={24} className="select-option-name">
                              <Text strong>{item?.name}</Text>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Option>
                  )
                })}
              </Select>
              <div className="icon-search-product">
                <SearchIcon />
              </div>
            </>
          )
        } else {
          return (
            <Input
              maxLength={100}
              allowClear
              size="large"
              placeholder={pageData.table.searchPlaceholder}
              className="modal-input-search"
              onChange={(e) => onSearch(e.target.value)}
              prefix={<SearchOutlined />}
            />
          )
        }
    }
    const getColumns = ()=>{
        const columns = [
            {
              title: pageData.table.no,
              dataIndex: 'sort',
              width: 30,
              className: 'drag-visible',
              render: () => {
                if (hasPermission(PermissionKeys.ADMIN)) return <DragHandle className="drag-handle" />
              }
            },
            {
              title: ' ',
              dataIndex: 'index'
            },
            {
              title: pageData.table.name,
              dataIndex: 'thumbnail',
              render: (_, record) => {
                return (
                  <Row className="table-img-box">
                    <div>
                      <Thumbnail src={record?.thumbnail} />
                    </div>
                  </Row>
                )
              }
            },
            {
              title: ' ',
              dataIndex: 'name',
              align: 'left',
              width: '60%'
            }
          ]
      
          if (hasPermission(PermissionKeys.ADMIN)) {
            const actionColumn = {
              title: pageData.table.action,
              key: 'action',
              width: '10%',
              align: 'center',
              className: '',
              render: (_, record) => {
                return (
                  <>
                    <a onClick={() => onHandleRemoveItem(record?.id)}>
                      <div className="shop-table-action-icon">
                        <Tooltip placement="top" title={t('button.delete')} color="#50429B">
                          <TrashFill className="icon-svg-hover" />
                        </Tooltip>
                      </div>
                    </a>
                  </>
                )
              }
            }
            columns.push(actionColumn)
          }
      
          return columns
    }
    const renderFooterModal = () => {
        if (hasPermission(PermissionKeys.ADMIN)) {
          return (
            <>
              <Button key="back" onClick={onCancel} className="mr-3">
                {pageData.btnCancel}
              </Button>
              <Button onClick={onSubmitModal} type="primary">
                {pageData.btnSave}
              </Button>
            </>
          )
        } else {
          return (
            <Button key="back" onClick={onCancel} className="mr-3">
              {pageData.btnCancel}
            </Button>
          )
        }
      }
    return(
        <Modal
        open={isOpen}
        className="modal-product-in-category"
        onCancel={onCancel}
        closeIcon
        width={800}
        footer={null}
        title={record?.name}
        >
            <Form>
                <Row style={{ display: 'contents' }}>
                    <Row>
                        <Col span={24}>
                            <Form.Item className="form-wrapper">{renderHeaderModal()}</Form.Item>
                        </Col>
                    </Row>
                    <div className="shop-table-wrapper product-modal-table">
                        <Row>
                            <Col span={24}>
                            <Table
                                className="table-modal-product table-product"
                                pagination={false}
                                dataSource={record?.blogs?.map((item, index) => {
                                item.index = index + 1
                                return item
                                })}
                                columns={getColumns()}
                                rowKey="index"
                                components={{
                                body: {
                                    wrapper: DraggableContainer,
                                    row: DraggableBodyRow
                                }
                                }}
                            />
                            </Col>
                        </Row>
                    </div>
                </Row>
                <Row style={{ justifyContent: 'center' }}>
                    <Divider className="m-8" />
                    {renderFooterModal()}
                </Row>
            </Form>
        </Modal>
    );
}