import { Card, Col, Row, Table } from 'antd'
import { FnbDatePicker } from 'components/shop-date-picker/shop-data-picker'
import FnbParagraph from 'components/shop-paragraph/shop-paragraph'
import FnbWidget from 'components/shop-widget/shop-widget.component'
import PageTitle from 'components/page-title'
import { Thumbnail } from 'components/thumbnail/thumbnail'
import { FolderIcon, ReceiptShiftIcon, WalletIcon } from 'constants/icons.constants'
import { OptionDateTime } from 'constants/option-date.constants'
import { TRANSACTION_TABPANE_KEY } from 'constants/report.constants'
import { DateFormat } from 'constants/string.constants'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { resetSession } from 'store/modules/session/session.actions'
import { formatTextNumber, getCurrency, tokenExpired, getCurrencyWithSymbol } from 'utils/helpers'
import { getStorage, localStorageKeys } from 'utils/localStorage.helpers'
import './index.scss'
import { images } from 'constants/images.constants'

export default function HomePage (props) {
  const { orderDataService } = props
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const currency = getCurrency()
  const pageData = {
    title: t('dashboard:title'),
    order: t('dashboard:order', 'Order'),
    revenue: t('dashboard:revenue'),
    cost: t('dashboard:cost'),
    txt_reduce: t('dashboard:txt_reduce'),
    txt_increase: t('dashboard:txt_increase'),
    date: {
      yesterday: 'dashboard:yesterday',
      previousDay: 'dashboard:previousDay',
      lastWeek: 'dashboard:lastWeek',
      previousWeek: 'dashboard:previousWeek',
      lastMonth: 'dashboard:lastMonth',
      previousMonth: 'dashboard:previousMonth',
      lastYear: 'dashboard:lastYear',
      previousSession: t('dashboard:previousSession')
    },
    noDataFound: t('table:noDataFound'),
    topProductTitle: t('dashboard:titleProduct'),
    topCustomerTitle: t('dashboard:titleCustomer'),
    viewMore: t('dashboard:viewMore'),
    parts: t('dashboard:parts'),
    orders: t('dashboard:orders'),
    totalOrder: t('dashboard:totalOrder'),
    totalRevenue: t('dashboard:totalRevenue'),
    totalCost: t('dashboard:totalCost')
  }

  const [initData, setInitData] = useState({})
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString('en-US'),
    endDate: moment().toDate().toLocaleDateString('en-US')
  })
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.date.yesterday)
  const [typeOptionDate, setTypeOptionDate] = useState(OptionDateTime.today)
  const [topProducts, setTopProducts] = useState([])
  const [topCustomers, setTopCustomers] = useState([])
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 })
  const tableLineChartRef = React.useRef(null)
  const [dataChart, setDataChart] = useState()

  useEffect(() => {
    const isTokenExpired = checkTokenExpired()
    if (isTokenExpired) {
      dispatch(resetSession())
      props.history.push('/login')
    } else {
      getOrderInfoByFilter(selectedDate, typeOptionDate)
      getStatisticalData(selectedDate, typeOptionDate)
      onConditionCompare(OptionDateTime.today)
    }
  }, [])

  const checkTokenExpired = () => {
    let isTokenExpired = true
    const token = getStorage(localStorageKeys.TOKEN)
    if (token || token !== null) {
      isTokenExpired = tokenExpired(token)
    }
    return isTokenExpired
  }

  const getStatisticalData = (date, typeOptionDate) => {
    const req = {
      startDate: date?.startDate,
      endDate: date?.endDate,
      segmentTimeOption: typeOptionDate
    }

    // orderDataService
    //   .calculateStatisticalDataAsync(req)
    //   .then((res) => {
    //     if (tableLineChartRef && tableLineChartRef.current) {
    //       tableLineChartRef.current.fillData(date, typeOptionDate, res)
    //     }
    //     setDataChart(res)
    //   })
    //   .catch((errors) => {
    //     if (tableLineChartRef && tableLineChartRef.current) {
    //       tableLineChartRef.current.fillData(date, typeOptionDate, { orderData: [] })
    //     }
    //     setDataChart({ orderData: [] })
    //   })
  }

  const getOrderInfoByFilter = async (date, typeOptionDate) => {
    // startDate and endDate are local time from client
    const startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY)
    const endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY)
    const req = {
      startDate,
      endDate,
      typeOptionDate
    }
    // const resultSummaryWidget = await orderDataService.getOrderBusinessSummaryWidgetAsync({
    //   ...req,
    //   startDate: date?.startDate,
    //   endDate: date?.endDate
    // })
    // const resultTopProducts = await orderDataService.getOrderTopProductsAsync(req)

    // setInitData(resultSummaryWidget)
    // setTopProducts(resultTopProducts.listTopProducts)
    // setTopCustomers(resultTopProducts.listTopCustomer)
  }

  const renderWidgets = () => {
    const listBusiness = [
      {
        icon: <ReceiptShiftIcon />,
        title: pageData.totalOrder,
        suffix: pageData.orders,
        summaryItem: {
          percent: initData?.percentOrder,
          total: initData?.totalOrder,
          average: initData?.averageTotalRevenue,
          percentAverage: initData?.percentAverageRevenue
        }
      },
      {
        icon: <WalletIcon />,
        title: pageData.totalRevenue,
        suffix: currency,
        summaryItem: {
          percent: initData?.percentRevenue,
          total: initData?.totalRevenue,
          average: initData?.averageTotalRevenue,
          percentAverage: initData?.percentAverageRevenue
        }
      },
      {
        icon: <ReceiptShiftIcon />,
        title: pageData.totalCost,
        suffix: currency,
        summaryItem: {
          percent: initData?.percentCost,
          total: initData?.totalCost,
          average: initData?.averageTotalCost,
          percentAverage: initData?.percentAverageCost
        }
      }
    ]
    const widgets = listBusiness?.map((item, index) => {
      return (
        <Col key={index} sm={8} span={24} className="col-group-business col-with-auto">
          <FnbWidget
            summaryItem={item.summaryItem}
            titleTotal={item.title}
            icon={item.icon}
            suffixData={item.suffix}
          />
        </Col>
      )
    })

    return <>{widgets}</>
  }

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date)
    setTypeOptionDate(typeOptionDate)
    getOrderInfoByFilter(date, typeOptionDate)
    getStatisticalData(date, typeOptionDate)
  }

  const onConditionCompare = (key) => {
    let titleConditionCompare = ''
    switch (key) {
      case OptionDateTime.today:
        titleConditionCompare = pageData.date.yesterday
        break
      case OptionDateTime.yesterday:
        titleConditionCompare = pageData.date.previousDay
        break
      case OptionDateTime.thisWeek:
        titleConditionCompare = pageData.date.lastWeek
        break
      case OptionDateTime.lastWeek:
        titleConditionCompare = pageData.date.previousWeek
        break
      case OptionDateTime.thisMonth:
        titleConditionCompare = pageData.date.lastMonth
        break
      case OptionDateTime.lastMonth:
        titleConditionCompare = pageData.date.previousMonth
        break
      case OptionDateTime.thisYear:
        titleConditionCompare = pageData.date.lastYear
        break
      default:
        break
    }

    setTitleConditionCompare(titleConditionCompare)
  }

  const tableTopProductsSettings = {
    pageSize: 20,
    columns: [
      {
        dataIndex: 'productName',
        align: 'left',
        render: (value, record) => {
          return isTabletOrMobile
            ? (
            <Row className="table-selling-product-row">
              <div className="table-selling-product-row-title">
                <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
                <div className="table-selling-product-thumbnail">
                  <Thumbnail src={record?.thumbnail} imageDefault={images.productDefault} />
                </div>
                <div className="table-selling-product-name">
                  <Row>
                    <Col span={24} className="table-selling-product-text-product-name">
                      <Link to={`/product/detail/${record?.productId}`} target="_blank">
                        <FnbParagraph>{value}</FnbParagraph>
                      </Link>
                    </Col>
                  </Row>
                  <Row style={record?.priceName && { marginTop: '4px' }}>
                    <Col span={24} className="table-selling-product-text-no" style={{ fontSize: '14px' }}>
                      {record?.priceName}
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="table-selling-product-row-description">
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name table-selling-product-text-no-font-size"
                  >
                    {`${record?.quantity} ${pageData.parts}`}
                  </Col>
                </Row>
                <Row className="table-selling-product-text-no table-selling-product-quantity-style">
                  <Col span={24}>{`${formatTextNumber(record?.totalCost)} ${currency}`}</Col>
                </Row>
              </div>
            </Row>
              )
            : (
            <Row className="table-selling-product-row">
              <div className="table-selling-product-row-title">
                <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
                <div className="table-selling-product-thumbnail">
                  <Thumbnail src={record?.thumbnail} imageDefault={productImageDefault} />
                </div>
                <Col span={10} className="table-selling-product-no">
                  <Row>
                    <Col
                      span={24}
                      className="table-selling-product-text-product-name table-selling-product-name-overflow"
                    >
                      <Link to={`/product/detail/${record?.productId}`} target="_blank">
                        <FnbParagraph>{value}</FnbParagraph>
                      </Link>
                    </Col>
                  </Row>
                  <Row style={record?.priceName && { marginTop: '4px' }}>
                    <Col span={24} className="table-selling-product-text-no table-selling-product-text-no-font-size">
                      {record?.priceName}
                    </Col>
                  </Row>
                </Col>
              </div>
              <div className="table-selling-product-row-description">
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name table-selling-product-text-no-font-size"
                  >
                    {`${record?.quantity} ${pageData.parts}`}
                  </Col>
                </Row>
                <Row className="table-selling-product-text-no table-selling-product-quantity-style">
                  <Col span={24}>{`${formatTextNumber(record?.totalCost)} ${currency}`}</Col>
                </Row>
              </div>
            </Row>
              )
        }
      }
    ]
  }

  const tableTopCustomerSettings = {
    pageSize: 20,
    columns: [
      {
        dataIndex: 'customerName',
        width: '65%',
        align: 'left',
        render: (value, record) => {
          return isTabletOrMobile
            ? (
            <div className="table-customer-row">
              <Row>
                <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
                <div className="table-selling-product-thumbnail">
                  <Thumbnail src={record?.thumbnail} />
                </div>
                <div className="table-selling-product-no table-selling-product-name-mobile">
                  <Row>
                    <Col span={24} className="table-selling-product-text-product-name">
                      <Link to={`/customer/detail/${record?.id}`} target="_blank">
                        <FnbParagraph>{value}</FnbParagraph>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
              )
            : (
            <Row>
              <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
              <div className="table-selling-product-thumbnail">
                <Thumbnail src={record?.thumbnail} />
              </div>
              <Col span={10} className="table-selling-product-no">
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name home-page table-selling-product-name-overflow"
                  >
                    <Link to={`/customer/detail/${record?.id}`} target="_blank">
                      <FnbParagraph>{value}</FnbParagraph>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
              )
        }
      },
      {
        dataIndex: 'cost',
        width: '35%',
        align: 'right',
        render: (value) => {
          return isTabletOrMobile
            ? (
            <>
              <div className="table-selling-product-item-mobile table-customer-row table-customer-item-mobile-margin">
                <Row className="table-selling-product-text-no table-selling-product-text-no-font-size">
                  <Col span={24}>{`${formatTextNumber(value)} ${getCurrencyWithSymbol()}`}</Col>
                </Row>
              </div>
            </>
              )
            : (
            <>
              <Row className="table-selling-product-text-no table-selling-product-text-no-font-size">
                <Col span={24}>{`${formatTextNumber(value)} ${getCurrencyWithSymbol()}`}</Col>
              </Row>
            </>
              )
        }
      }
    ]
  }

  const renderTopProductsAndCustomer = () => {
    return (
      <>
        <Row className="mt-5">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} style={isTabletOrMobile ? '' : { paddingRight: '20px' }}>
            <Card
              className={
                isTabletOrMobile
                  ? 'shop-box custom-box card-selling-product-thumbnail'
                  : 'shop-box custom-box card-selling-product-thumbnail top-selling-product-card-width'
              }
            >
              <Row className="group-header-top-selling-product-box">
                <Col xs={18} sm={18} lg={18}>
                  <p style={{ color: '#2B2162' }}>{pageData.topProductTitle}</p>
                </Col>
                <Col xs={6} sm={6} lg={6} className="table-selling-product-see-more-text-align">
                  <p
                    className="table-selling-product-see-more"
                    onClick={() => {
                      props.history.push(`/report/transaction/${TRANSACTION_TABPANE_KEY.PRODUCT}`)
                    }}
                  >
                    {pageData.viewMore}
                  </p>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: (
                    <>
                      <p className="text-center table-emty-icon">
                        <FolderIcon />
                      </p>
                      <p className="text-center body-2 table-emty-text">{pageData.noDataFound}</p>
                    </>
                  )
                }}
                className="shop-table form-table table-selling-product"
                columns={tableTopProductsSettings.columns}
                dataSource={topProducts}
                pagination={false}
              />
            </Card>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={isTabletOrMobile ? { marginTop: '36px' } : { paddingLeft: '20px' }}
          >
            <Card
              className={
                isTabletOrMobile
                  ? 'shop-box custom-box card-selling-product-thumbnail'
                  : 'shop-box custom-box card-selling-product-thumbnail top-selling-product-card-width'
              }
            >
              <Row className="group-header-top-selling-product-box">
                <Col xs={18} sm={18} lg={18}>
                  <p style={{ color: '#2B2162' }}>{pageData.topCustomerTitle}</p>
                </Col>
                <Col xs={6} sm={6} lg={6} className="table-selling-product-see-more-text-align">
                  <p
                    className="table-selling-product-see-more"
                    onClick={() => {
                      props.history.push('/report/customer')
                    }}
                  >
                    {pageData.viewMore}
                  </p>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: (
                    <>
                      <p className="text-center table-emty-icon">
                        <FolderIcon />
                      </p>
                      <p className="text-center body-2 table-emty-text">{pageData.noDataFound}</p>
                    </>
                  )
                }}
                className="shop-table form-table table-selling-product"
                columns={tableTopCustomerSettings.columns}
                dataSource={topCustomers}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </>
    )
  }

  return (
    <Row className="shop-form-title" gutter={[0, 29]}>
      <Col span={24}>
        <Row gutter={[24, 24]} align="middle" justify="center" className="top-dashboard">
          <Col xs={24} sm={24} md={24} lg={8}>
            <PageTitle className="mb-0 title-dashboard" content={pageData.title} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={16} className="shop-form-btn-popover">
            <Row className="shop-row-top" gutter={[24, 24]} justify="end">
              <FnbDatePicker
                selectedDate={selectedDate}
                setSelectedDate={(date, typeOptionDate) => onSelectedDatePicker(date, typeOptionDate)}
                setConditionCompare={onConditionCompare}
              />
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[12, 12]} className="row-width-auto">
          {renderWidgets()}
        </Row>
        <Row gutter={[40, 0]}>
          <Col xs={24} sm={24} lg={16} className="mt-4">
            {renderTopProductsAndCustomer()}
          </Col>
          <Col xs={24} sm={24} lg={8} className="mt-4">
            {/* TO DO SOMETHING ELSE */}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
