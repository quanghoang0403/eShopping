import { StopOutlined } from '@ant-design/icons'
import { Card, Col, message, Row } from 'antd'
import Paragraph from 'antd/lib/typography/Paragraph'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { EditButtonComponent } from 'components/edit-button/edit-button.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import { FnbGuideline } from 'components/fnb-guideline/fnb-guideline.component'
import { FnbTable } from 'components/fnb-table/fnb-table'
import PageTitle from 'components/page-title'
import { tableSettings } from 'constants/default.constants'
import { StopFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { ListPromotionType, PromotionStatus } from 'constants/promotion.constants'
import { DateFormat, Percent } from 'constants/string.constants'
// import promotionDataService from 'data-services/promotion/promotion-data.service'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import { formatCurrency, formatDate, hasPermission } from 'utils/helpers'
import './promotion.scss'
import FilterDiscount from './components/filter-discount.component'

export default function PromotionPage (props) {
  const [t] = useTranslation()
  const history = useHistory()
  const [keySearch, setKeySearch] = useState('')
  const [listPromotion, setListPromotion] = useState([])
  const [typingTimeout, setTypingTimeout] = useState(0)
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const clearFilterFunc = React.useRef(null)
  const [dataFilter, setDataFilter] = useState(null)
  const [showPopover, setShowPopover] = useState(true)
  const [countFilter, setCountFilter] = useState(0)
  const [promotionTypeOptions, setPromotionTypeOptions] = useState([])

  const pageData = {
    linkAddNew: '/promotion/create',
    title: t('promotion:title'),
    allType: t('promotion:allType'),
    search: t('table:searchPlaceholder'),
    notificationTitle: t('dialog:notificationTitle'),
    confirmDelete: t('dialog:confirmDelete'),
    confirmStop: t('dialog:confirmStop'),
    confirmDeleteMessage: t('promotion:confirmDeletePromotionMessage'),
    confirmStopPromotion: t('promotion:confirmStopPromotion'),
    deletePromotionSuccess: t('promotion:deletePromotionSuccess'),
    stopPromotionSuccess: t('promotion:stopPromotionSuccess'),
    promotionDeleteFail: t('promotion:promotionDeleteFail'),
    promotionStopFail: t('promotion:promotionStopFail'),

    button: {
      addNew: t('button:addNew'),
      filter: t('button:filter'),
      btnDelete: t('button:delete'),
      btnIgnore: t('button:ignore'),
      btnStop: t('button:stop')
    },
    amount: t('promotion:amountValue'),
    maximum: t('promotion:maximum'),
    start: t('promotion:start'),
    end: t('promotion:end'),
    table: {
      no: t('table:no'),
      name: t('table:name'),
      time: t('table:time'),
      discount: t('table:discount'),
      status: t('table:status'),
      action: t('table:action')
    },
    guideline: {
      title: t('promotion:titleGuideline'),
      content: t('promotion:contentGuideline')
    }
  }

  useEffect(() => {
    getInitComboDataTable(tableSettings.page, tableSettings.pageSize, keySearch)
  }, [])

  const getInitComboDataTable = async (pageNumber, pageSize, keySearch, dataFilter) => {
    const checkStartDate = moment(dataFilter?.startDate, 'YYYY-MM-DD').isValid()
    const checkEndDate = moment(dataFilter?.endDate, 'YYYY-MM-DD').isValid()

    // await promotionDataService
    //   .getPromotionsAsync(
    //     pageNumber,
    //     pageSize,
    //     keySearch,
    //     dataFilter?.branchId ?? '',
    //     dataFilter?.statusId ?? '',
    //     dataFilter?.valueType ?? '',
    //     checkStartDate ? moment.utc(dataFilter?.startDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : '',
    //     checkEndDate ? moment.utc(dataFilter?.endDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2) : '',
    //     dataFilter?.minMinimumPurchaseOnBill ?? '',
    //     dataFilter?.maxMinimumPurchaseOnBill ?? '',
    //     dataFilter?.applicableType ?? '',
    //     dataFilter?.includeTopping ?? ''
    //   )
    //   .then((res) => {
    //     const { total, promotions } = res
    //     const promotionDataTable = mappingToDataTablePromotions(promotions)
    //     setListPromotion(promotionDataTable)
    //     setCurrentPageNumber(pageNumber)
    //     setTotalRecords(total)
    //   })

    // setCountFilter(dataFilter?.count)
  }

  const mappingToDataTablePromotions = (promotions) => {
    return promotions?.map((i, index) => {
      return {
        id: i.id,
        no: i.no,
        name: i.name,
        isPercentDiscount: i.isPercentDiscount,
        percentNumber: i.percentNumber,
        maximumDiscountAmount: i.maximumDiscountAmount,
        startDate: i.startDate,
        endDate: i.endDate,
        statusId: i.statusId,
        isStopped: i.isStopped
      }
    })
  }

  const onEditItem = (id) => {
    history.push(`/store/discount/edit/${id}`)
  }

  const onChangePage = async (pageNumber, pageSize) => {
    getInitComboDataTable(pageNumber, pageSize, keySearch, dataFilter)
  }

  const getColumns = () => {
    const columns = [
      {
        title: pageData.table.no,
        dataIndex: 'no',
        className: 'grid-no-column',
        width: '124px'
      },
      {
        title: pageData.table.name,
        dataIndex: 'name',
        className: 'grid-name-column',
        width: '423px',
        render: (_, record) => {
          const href = `/store/discount/detail/${record.id}`
          return (
            <div className="text-overflow">
              <Paragraph
                style={{ maxWidth: 'inherit' }}
                placement="top"
                ellipsis={{ tooltip: record?.name }}
                color="#50429B"
              >
                <Link to={href}>
                  <span className="text-name">{record.name}</span>
                </Link>
              </Paragraph>
            </div>
          )
        }
      },
      {
        title: pageData.table.discount,
        dataIndex: 'discount',
        className: 'grid-discount-column',
        width: '343px',
        render: (_, record) => {
          return (
            <>
              {record.isPercentDiscount
                ? (
                <>
                  <Row>
                    <Col span={12}>
                      <p className="discount-text">{pageData.amount}: </p>
                    </Col>
                    <Col span={12}>
                      <p className="discount-percent">{`${record.percentNumber} ${Percent}`}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <p className="discount-max">{pageData.maximum}: </p>
                    </Col>
                    <Col span={12}>
                      <p className="discount-amount">{formatCurrency(record.maximumDiscountAmount)}</p>
                    </Col>
                  </Row>
                </>
                  )
                : (
                <>
                  <Row>
                    <Col span={12}>
                      <p className="discount-text">{pageData.amount}: </p>
                    </Col>
                    <Col span={12}>
                      <p className="discount-percent">{formatCurrency(record.maximumDiscountAmount)}</p>
                    </Col>
                  </Row>
                </>
                  )}
            </>
          )
        }
      },
      {
        title: pageData.table.time,
        dataIndex: 'time',
        className: 'grid-time-column',
        width: '295px',
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={12}>
                  <p className="start-text">{pageData.start}: </p>
                </Col>
                <Col span={12}>
                  <p className="start-date">{formatDate(record.startDate)}</p>
                </Col>
              </Row>
              {record.endDate && (
                <Row>
                  <Col span={12}>
                    <p className="end-text"> {pageData.end}: </p>
                  </Col>
                  <Col span={12}>
                    <p className="end-date">{formatDate(record.endDate)}</p>
                  </Col>
                </Row>
              )}
            </>
          )
        }
      },
      {
        title: pageData.table.status,
        dataIndex: 'status',
        className: 'grid-status-column',
        width: '183px',
        render: (_, record) => {
          switch (record?.statusId) {
            case PromotionStatus.Schedule:
              return <div className="status-scheduled">{t('promotion:status.scheduled')}</div>
            case PromotionStatus.Active:
              return <div className="status-active">{t('promotion:status.active')}</div>
            default:
              return <div className="status-finished">{t('promotion:status.finished')}</div>
          }
        }
      }
    ]

    if (
      hasPermission(PermissionKeys.EDIT_PROMOTION) ||
      hasPermission(PermissionKeys.DELETE_PROMOTION) ||
      hasPermission(PermissionKeys.STOP_PROMOTION)
    ) {
      const actionColumn = {
        title: pageData.table.action,
        dataIndex: 'action',
        width: '95px',
        align: 'center',
        render: (_, record) => {
          if (record.isStopped) {
            return <></>
          }
          return (
            <div className="action-column">
              {hasPermission(PermissionKeys.EDIT_PROMOTION) && record.statusId === PromotionStatus.Schedule && (
                <a onClick={() => onEditItem(record?.id)}>
                  <EditButtonComponent
                    className="action-button-space"
                    onClick={() => onEditItem(record)}
                    permission={PermissionKeys.EDIT_PROMOTION}
                  />
                </a>
              )}

              {hasPermission(PermissionKeys.DELETE_PROMOTION) && record.statusId === PromotionStatus.Schedule && (
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatDeleteMessage(record?.name)}
                  okText={pageData.button.btnDelete}
                  cancelText={pageData.button.btnIgnore}
                  permission={PermissionKeys.DELETE_PROMOTION}
                  onOk={() => onDeletePromotion(record?.id)}
                />
              )}

              {hasPermission(PermissionKeys.STOP_PROMOTION) && record.statusId === PromotionStatus.Active && (
                <DeleteConfirmComponent
                  icon={<StopOutlined />}
                  buttonIcon={<StopFill className="icon-del" />}
                  title={pageData.notificationTitle}
                  content={t(pageData.confirmStopPromotion, { name: record?.name })}
                  okText={pageData.button.btnStop}
                  okButtonProps={{ style: { backgroundColor: '#FF8C21', height: '60px', minWidth: '114px' } }}
                  cancelText={pageData.button.btnIgnore}
                  cancelButtonProps={{
                    style: {
                      backgroundColor: 'transparent',
                      border: 'transparent',
                      boxShadow: 'none',
                      height: '60px',
                      minWidth: '114px'
                    }
                  }}
                  permission={PermissionKeys.STOP_PROMOTION}
                  onOk={() => onStopPromotion(record?.id)}
                  tooltipTitle={pageData.button.btnStop}
                  modalContainerStyle="confirm-stop-modal-sizing"
                />
              )}
            </div>
          )
        }
      }
      columns.push(actionColumn)
    }

    return columns
  }

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    const mess = t(pageData.confirmDeleteMessage, { name })
    return mess
  }

  const handleSearchByName = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch)
        getInitComboDataTable(tableSettings.page, tableSettings.pageSize, keySearch, dataFilter)
      }, 500)
    )
  }

  const onStopPromotion = async (id) => {
    // await promotionDataService.stopPromotionByIdAsync(id).then((res) => {
    //   if (res) {
    //     message.success(pageData.stopPromotionSuccess)
    //   } else {
    //     message.error(pageData.promotionStopFail)
    //   }
    //   getInitComboDataTable(tableSettings.page, tableSettings.pageSize, keySearch, dataFilter)
    // })
  }

  const onDeletePromotion = async (id) => {
    // await promotionDataService.deletePromotionByIdAsync(id).then((res) => {
    //   if (res) {
    //     message.success(pageData.stopPromotionSuccess)
    //   } else {
    //     message.error(pageData.promotionDeleteFail)
    //   }
    //   getInitComboDataTable(tableSettings.page, tableSettings.pageSize, keySearch, dataFilter)
    // })
  }

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterDiscount
          fetchDataDiscount={getInitComboDataTable}
          categories={[]}

          tableFuncs={clearFilterFunc}
          promotionTypeOptions={promotionTypeOptions}
          pageSize={tableSettings.pageSize}
          keySearch={keySearch}
          setDataFilter={setDataFilter}
        />
      )
    )
  }

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true)
    }

    const allPromotionType = {
      id: '',
      name: pageData.allType
    }
    const listPromotionType = ListPromotionType?.map((item) => ({
      id: item.key,
      name: t(item.name)
    }))
    const promotionTypeOptions = [allPromotionType, ...listPromotionType]
    setPromotionTypeOptions(promotionTypeOptions)
  }

  const onClearFilter = (e) => {
    if (clearFilterFunc.current) {
      clearFilterFunc.current()
      setShowPopover(false)
    } else {
      setCountFilter(0)
      setShowPopover(false)
      setDataFilter(null)
    }
  }

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle className="promotion-guideline-page-title" content={pageData.title} />
          <FnbGuideline placement="rightTop" title={pageData.guideline.title} content={pageData.guideline.content} />
        </Col>
        <Col span={12}>
          <ShopAddNewButton
            className="float-right"
            permission={PermissionKeys.CREATE_PROMOTION}
            onClick={() => history.push(pageData.linkAddNew)}
            text={pageData.button.addNew}
          />
        </Col>
      </Row>
      <Row>
        <Card className="w-100 fnb-card-full">
          <Row>
            <Col span={24}>
              <FnbTable
                className="mt-3"
                columns={getColumns()}
                pageSize={tableSettings.pageSize}
                dataSource={listPromotion}
                currentPageNumber={currentPageNumber}
                total={totalRecords}
                // onChangePage={tableSettings.onChangePage}
                onChangePage={onChangePage}
                search={{
                  placeholder: `${pageData.search}`,
                  onChange: handleSearchByName
                }}
                filter={{
                  onClickFilterButton,
                  totalFilterSelected: countFilter,
                  onClearFilter,
                  buttonTitle: pageData.btnFilter,
                  component: filterComponent(),
                  filterClassName: 'filter-discount-management'
                }}
              />
            </Col>
          </Row>
        </Card>
      </Row>
    </>
  )
}
