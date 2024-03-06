import { Modal } from 'antd'
import { FnbTable } from 'components/shop-table/shop-table'
import { CloseModalPurpleIcon } from 'constants/icons.constants'
import { DateFormat } from 'constants/string.constants'
import { useState, forwardRef, useEffect, useImperativeHandle } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, formatTextNumber, getCurrency } from 'utils/helpers'
import './promotion-campaign-usage-detail.style.scss'

export const PromotionCampaignUsageDetailComponent = forwardRef((props, ref) => {
  const { t, showModalUsageDetail, promotionDataService, onCancel } = props
  const [dataSource, setDataSource] = useState([])
  const [promotionCampaignId, setPromotionCampaignId] = useState(null)
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  useImperativeHandle(ref, () => ({
    fetchData (promotionCampaignId) {
      setPromotionCampaignId(promotionCampaignId)
      fetchDataTableAsync(currentPageNumber, tableSettings.pageSize, promotionCampaignId)
    }
  }))

  useEffect(() => {}, [])

  const fetchDataTableAsync = async (pageNumber, pageSize, promotionCampaignId) => {
    const responseData = await promotionDataService?.getPromotionCampaignUsageDetailAsync(
      pageNumber,
      pageSize,
      promotionCampaignId
    )

    if (responseData) {
      const { promotionCampaignUsageDetails, total, pageNumber } = responseData
      const records = promotionCampaignUsageDetails?.map((item) => mappingRecordToColumns(item))
      setDataSource(records)
      setTotalRecords(total)
      setCurrentPageNumber(pageNumber)
    }
  }

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      orderId: item?.orderId,
      orderCode: item?.orderCode,
      discountAmount: formatTextNumber(item?.discountAmount),
      orderDate: formatDate(item?.orderDate, DateFormat.DD_MM_YYYY_HH_MM)
    }
  }

  const pageData = {
    no: t('table.no'),
    title: t('promotion.usageDetail.title'),
    orderId: t('promotion.usageDetail.orderId'),
    discountAmount: t('promotion.usageDetail.discountAmount'),
    orderDate: t('promotion.usageDetail.orderDate')
  }

  const tableSettings = {
    page: currentPageNumber,
    pageSize: 20,
    columns: [
      {
        title: pageData.no,
        dataIndex: 'index',
        key: 'index',
        width: '96px'
      },
      {
        title: pageData.orderId,
        dataIndex: 'orderCode',
        key: 'orderCode',
        width: '400px',
        render: (_, record) => {
          return (
            <Link to={`/report/order/detail/${record?.orderId}`} target="_blank">
              {record?.orderCode}
            </Link>
          )
        }
      },
      {
        title: `${pageData.discountAmount} (${getCurrency()})`,
        dataIndex: 'discountAmount',
        key: 'discountAmount',
        width: '606px'
      },
      {
        title: pageData.orderDate,
        dataIndex: 'orderDate',
        key: 'orderDate',
        width: '217px'
      }
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDataTableAsync(page, pageSize, promotionCampaignId)
    }
  }

  return (
    <Modal
      width={1380}
      className="modal-promotion-campaign-usage-detail"
      open={showModalUsageDetail}
      closeIcon={<CloseModalPurpleIcon />}
      footer={(null, null)}
      onCancel={onCancel}
      forceRender={true}
      centered
    >
      <div className="title-container">
        <h3 className="modal-title mb-0">{pageData.title}</h3>
      </div>

      {/* Table usage detail */}
      <FnbTable
        className="table-usage-detail"
        columns={tableSettings.columns}
        dataSource={dataSource}
        onChangePage={tableSettings.onChangePage}
        pageSize={tableSettings.pageSize}
        currentPageNumber={currentPageNumber}
        total={totalRecords}
        scrollY={96 * 5}
      />
    </Modal>
  )
})
