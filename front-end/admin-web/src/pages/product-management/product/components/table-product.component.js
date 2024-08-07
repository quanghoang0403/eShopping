import { EllipsisOutlined } from '@ant-design/icons'
import { Checkbox, Col, message, Popover, Row, Space, Tooltip } from 'antd'
import { BadgeStatus } from 'components/badge-status'
import { EditButtonComponent } from 'components/edit-button/edit-button.component'
import { ShopTable } from 'components/shop-table/shop-table'
import { Thumbnail } from 'components/thumbnail/thumbnail'
import { TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { useTranslation } from 'react-i18next'
import productCategoryDataService from 'data-services/product-category/product-category-data.service';
import productDataService from 'data-services/product/product-data.service';
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  executeAfter,
  formatCurrencyWithoutSuffix,
  getCurrency,
  getThumbnailUrl,
  hasPermission,
  isJsonString
} from 'utils/helpers'
import { getStorage, localStorageKeys, setStorage } from 'utils/localStorage.helpers'
import DeleteProductComponent from './delete-product.component'
import FilterProduct from './filter-product.component'
import { guidIdEmptyValue } from 'constants/string.constants'

export default function TableProduct(props) {
  const history = useHistory()
  const { t } = useTranslation()
  const [dataSource, setDataSource] = useState([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [productCategories, setProductCategories] = useState([])
  const [countFilter, setCountFilter] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [showPopover, setShowPopover] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [preventDeleteProduct, setPreventDeleteProduct] = useState({})
  const [titleModal, setTitleModal] = useState()
  const [dataFilter, setDataFilter] = useState(null)
  const [keySearch, setKeySearch] = useState('')
  const clearFilterFunc = React.useRef(null)
  const maxNumberToShowPrice = 5

  const pageData = {
    btnFilter: t('button.filter'),
    btnSort: t('button.sort'),
    btnIgnore: t('button.ignore'),
    btnDelete: t('button.delete'),
    confirmDelete: t('dialog.confirmDelete'),
    productDeleteSuccess: t('product.productDeleteSuccess'),
    productDeleteFail: t('product.productDeleteFail'),
    productEditSuccess: t('product.productEditedSuccess'),
    table: {
      searchPlaceholder: t('table.searchPlaceholder'),
      no: t('table.no'),
      name: t('table.name'),
      price: t('table.price'),
      status: t('table.status'),
      action: t('table.action'),
      feature: t('table.feature')
    },
    notificationTitle: t('dialog.notificationTitle')
  }
  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.name,
        dataIndex: 'name',
        key: 'name',
        className: 'grid-product-name-column',
        align: 'left',
        width: '35%',
        render: (value, record) => {
          return (
            <Row className="table-img-box">
              <div>
                <Thumbnail
                  // src={getThumbnailUrl(record?.thumbnail, 'mobile')}
                  src={record?.thumbnail}
                />
              </div>
              <div className="product-name">
                <Link to={`/product/detail/${record?.id}`}>{value}</Link>
              </div>
            </Row>
          )
        }
      },
      {
        title: `${pageData.table.price} (${getCurrency()})`,
        dataIndex: 'price',
        key: 'price',
        align: 'left',
        className: 'grid-price-column',
        width: '25%',
        render: (value) => <div className="grid-price-column-text">{value}</div>
      },
      {
        title: pageData.table.status,
        dataIndex: 'status',
        key: 'status',
        align: 'left',
        className: 'grid-status-column',
        width: '15%',
        render: (_, record) => {
          return <BadgeStatus isActive={record?.status} />
        }
      },
      {
        title: pageData.table.feature,
        align: 'center',
        key: 'isFeatured',
        width: '15%',
        dataIndex: 'isFeatured',
        render: (_, record) => {
          return <Checkbox checked={record?.isFeatured} onChange={(e) => onChangeFeatureStatus(record?.id, e.target.checked)} />
        }
      },
      {
        title: pageData.table.action,
        key: 'action',
        align: 'center',
        width: '10%',
        render: (_, record) => {
          return (
            <div className="action-column action-column-center">
              <EditButtonComponent
                className="action-button-space mr-3"
                onClick={() => onEditItem(record?.id)}
                permission={PermissionKeys.EDIT_PRODUCT}
              />
              {hasPermission(PermissionKeys.EDIT_PRODUCT) && (
                <Space wrap>
                  <div className="shop-table-action-icon">
                    <Tooltip placement="top" title={pageData.btnDelete} color="#50429B">
                      <TrashFill className="icon-svg-hover" onClick={() => onDeleteItem(record?.id, record?.name)} />
                    </Tooltip>
                  </div>
                </Space>
              )}
            </div>
          )
        }
      }
    ],
    onChangePage: async (page, pageSize) => {
      await handleFilterProduct(dataFilter, page, pageSize, keySearch)
    },
    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        setKeySearch(keySearch)
        await handleFilterProduct(dataFilter, 1, tableSettings.pageSize, keySearch)
      })
    }
  }
  const onChangeFeatureStatus = async (id, status) => {
    const data = {
      id: id,
      isActivate: status
    }
    try {
      const res = await productDataService.changeFeatureStatus(data)
      if (res) {
        message.success(pageData.productEditSuccess)
        await handleFilterProduct(dataFilter || { filter: true }, 1, tableSettings.pageSize, keySearch);
      }
    } catch (err) {
      message.error(err)
    }
  }
  const onDeleteItem = (productId, productName) => {
    // productDataService.getAllOrderNotCompletedByProductIdAsync(productId).then((res) => {
    //   if(res){
    //     const { preventDeleteProduct } = res;
    //     // Set property for object
    //     Object.assign(preventDeleteProduct, { productName: productName });

    //     setPreventDeleteProduct(preventDeleteProduct);
    //     if (!preventDeleteProduct?.isPreventDelete) {
    //       setTitleModal(pageData.confirmDelete);
    //     } else {
    //       setTitleModal(pageData.notificationTitle);
    //     }
    //     setIsModalVisible(true);
    //   }

    // });
    productDataService.getProductByIdAsync(productId).then(res => {
      const product = res
      setPreventDeleteProduct(product)
    }).catch(err => {
      console.log(err)
    })
    setTitleModal(pageData.confirmDelete);
    setIsModalVisible(true);
  }

  const onCloseModal = () => {
    setIsModalVisible(false)
    setPreventDeleteProduct({})
  }
  const handleDeleteItem = async (productId) => {
    var res = await productDataService.deleteProductByIdAsync(productId);
    if (res) {
      message.success(pageData.productDeleteSuccess);
      // Recount selected items after delete
      const newSelectedRowKeys = selectedRowKeys?.filter((x) => dataSource.find(d => d.index === x).id !== productId);
      if (newSelectedRowKeys) {
        setSelectedRowKeys(newSelectedRowKeys);
      }
      handleFilterProduct(dataFilter, 1, tableSettings.pageSize, keySearch);
    } else {
      message.error(pageData.productDeleteFail);
    }
    setIsModalVisible(false);
  }

  const onEditItem = (productId) => {
    return history.push(`/product/edit/${productId}`)
  }

  useEffect(() => {
    const sessionProductFilter = getStorage(localStorageKeys.PRODUCT_FILTER)
    if (isJsonString(sessionProductFilter)) {
      const productFilter = JSON.parse(sessionProductFilter)
      if (productFilter && productFilter.count > 0) {
        const data = {
          productCategoryId: productFilter.productCategoryId,
          status: !productFilter.statusId ? 0 : 1,
          count: productFilter.count,
          filter: productFilter.statusId === '' ? true : false
        }
        setDataFilter(data)
        handleFilterProduct(data, currentPageNumber, tableSettings.pageSize, '')
      } else {
        handleFilterProduct({ filter: true }, currentPageNumber, tableSettings.pageSize, '')
      }
    } else {
      handleFilterProduct({ filter: true }, currentPageNumber, tableSettings.pageSize, '')
    }
  }, [])

  const PopoverContentComponent = (props) => {
    return (
      <div className="popover-container-custom">
        <div className="popover-container-custom-header">
          <span className="popover-container-custom-header-title">{props?.title}</span>
        </div>

        <div className="popover-container-custom-body">{props?.children}</div>
      </div>
    )
  }

  const renderPopoverItems = (productPrices, take, onPopover) => {
    let priceList = []
    if (productPrices?.length > 0) {
      priceList = [...productPrices]
    }

    if (take) {
      priceList = priceList.splice(0, take)
    }

    return priceList?.map((p) => {
      if (p.priceName) {
        return (
          <>
            <Row className="product-price-box">
              {onPopover
                ? (
                  <>
                    <Col offset={4} span={6} className="mt-1">
                      <span className="float-left">{p?.priceName}</span>
                    </Col>
                    <Col offset={4} span={6} className="mt-1">
                      <span className="float-right">{formatCurrencyWithoutSuffix(p?.priceValue)}{getCurrency()}</span>
                    </Col>
                  </>
                )
                : (
                  <>
                    <Col span={12} className="price-box-inline">
                      <span className="float-left mt-1" title={p?.priceName}>
                        {p?.priceName}
                      </span>
                    </Col>
                    <Col span={12} className="mt-1">
                      <span className="float-right">{formatCurrencyWithoutSuffix(p?.priceValue)}{getCurrency()}</span>
                    </Col>
                  </>
                )}
            </Row>
          </>
        )
      } else {
        return (
          <>
            <Row>
              <Col span={12}></Col>
              <Col span={12}>
                <span className="float-right">{formatCurrencyWithoutSuffix(p?.priceValue)}</span>
              </Col>
            </Row>
          </>
        )
      }
    })
  }

  const onVisibleChange = (isShow, item) => {
    const button = document.getElementById(`btn-show-more-${item.id}`)
    if (isShow) {
      button?.classList?.add('btn-show-more-hover')
    } else {
      button?.classList?.remove('btn-show-more-hover')
    }
  }

  const mappingRecordToColumns = (item) => {
    return {
      key: item?.id,
      index: item?.no,
      id: item?.id,
      name: item?.name,
      thumbnail: item?.thumbnail,
      prices: item?.prices,
      isFeatured: item?.isFeatured,
      price: (
        <>
          {item?.productPrices &&
            (item?.productPrices?.length > maxNumberToShowPrice
              ? (
                <div>
                  {renderPopoverItems(item?.productPrices, maxNumberToShowPrice)}
                  <Popover
                    onVisibleChange={(isShow) => onVisibleChange(isShow, item)}
                    content={
                      <PopoverContentComponent title={`Prices (${item?.productPrices?.length})`}>
                        {renderPopoverItems(item?.productPrices, null, true)}
                      </PopoverContentComponent>
                    }
                    trigger="click"
                  >
                    <div className="btn-show-more-container">
                      <button id={`btn-show-more-${item.id}`} className="btn-show-more">
                        <EllipsisOutlined />
                      </button>
                    </div>
                  </Popover>
                </div>
              )
              : (
                <>{renderPopoverItems(item?.productPrices)}</>
              ))}
        </>
      ),
      status: item?.isActive
    }
  }

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true)
    }
    var resCategory = await productCategoryDataService.getAllProductCategoriesAsync();
    if (resCategory) {
      const allCategoryOption = {
        id: '',
        name: 'Tất cả'
      };
      const categoryOptions = [allCategoryOption, ...resCategory.allProductCategories];
      setProductCategories(categoryOptions);
    }
  }

  const handleFilterProduct = async (data, pageNumber, pageSize, keySearch) => {
    const response = await productDataService.getProductsByFilterAsync(
      pageNumber,
      pageSize,
      keySearch,
      data?.productCategoryId ?? guidIdEmptyValue,
      data?.statusId ?? 0,
      data?.filter ?? true
    );

    const products = response?.result.map((s) => mappingRecordToColumns(s));
    setDataSource(products);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
    setCountFilter(data?.count);
  }

  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const onClearFilter = (e) => {
    if (clearFilterFunc.current) {
      clearFilterFunc.current()
      setShowPopover(false)
    } else {
      setStorage(localStorageKeys.PRODUCT_FILTER, null)
      setCountFilter(0)
      setShowPopover(false)
      handleFilterProduct({ filter: true }, 1, tableSettings.pageSize, keySearch)
      setDataFilter({ filter: true })
    }
  }

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterProduct
          fetchDataProducts={handleFilterProduct}
          categories={productCategories}
          tableFuncs={clearFilterFunc}
          pageSize={tableSettings.pageSize}
          keySearch={keySearch}
          setDataFilter={setDataFilter}
        />
      )
    )
  }

  return (
    <>
      <Row className="form-staff mt-4">
        <ShopTable
          className="mt-4 table-striped-rows table-product-management"
          columns={tableSettings.columns}
          pageSize={tableSettings.pageSize}
          dataSource={dataSource}
          currentPageNumber={currentPageNumber}
          total={totalRecords}
          onChangePage={tableSettings.onChangePage}
          editPermission={PermissionKeys.EDIT_PRODUCT}
          deletePermission={PermissionKeys.EDIT_PRODUCT}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: onSelectedRowKeysChange,
            columnWidth: 40
          }}
          search={{
            maxLength: 100,
            placeholder: pageData.table.searchPlaceholder,
            onChange: tableSettings.onSearch
          }}
          filter={{
            onClickFilterButton,
            totalFilterSelected: countFilter,
            onClearFilter,
            buttonTitle: pageData.btnFilter,
            component: filterComponent()
          }}
        />
        <DeleteProductComponent
          isModalVisible={isModalVisible}
          preventDeleteProduct={preventDeleteProduct}
          titleModal={titleModal}
          handleCancel={() => onCloseModal()}
          onDelete={handleDeleteItem}
        />
      </Row>
    </>
  )
}
