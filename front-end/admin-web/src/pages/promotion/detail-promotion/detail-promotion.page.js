import { Button, Card, Checkbox, Col, message, Row, Tooltip, Typography } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbGuideline } from 'components/fnb-guideline/fnb-guideline.component'
import PageTitle from 'components/page-title'
import { InfoCircleIcon, SummaryWidgetOrangeIcon, SummaryWidgetPurpleIcon } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { ListPromotionType, PromotionStatus, PromotionType } from 'constants/promotion.constants'
import { Percent } from 'constants/string.constants'
import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { formatCurrency, formatDate, formatTextNumber, getCurrency } from 'utils/helpers'
import OverviewWidget from 'components/overview-widget/overview-widget.component'
import widgetOrange from 'assets/images/widget-orange.png'
import widgetPurple from 'assets/images/widget-purple.png'

import './index.scss'
import { PromotionCampaignUsageDetailComponent } from './promotion-campaign-usage-detail.component'
const { Text } = Typography

export default function DetailPromotionManagement (props) {
  const { t, promotionDataService, match, history } = props
  const promotionDetailLink = '/store/promotion/discount'
  const isMaxWidth500 = useMediaQuery({ maxWidth: 500 })
  const promotionCampaignUsageDetailRef = useRef()

  const pageData = {
    btnIgnore: t('button:ignore'),
    btnLeave: t('button:leave'),
    btnStop: t('button:stop'),
    btnDelete: t('button:delete'),
    btnCancel: t('button:cancel'),
    edit: t('button:edit'),
    title: t('promotion:title'),
    percent: Percent,
    confirmDelete: t('dialog:confirmDelete'),
    confirmStop: t('dialog:confirmStop'),
    confirmDeleteMessage: t('promotion:confirmDeletePromotionMessage'),
    confirmStopPromotion: t('promotion:confirmStopPromotion'),
    deletePromotionSuccess: t('promotion:deletePromotionSuccess'),
    stopPromotionSuccess: t('promotion:stopPromotionSuccess'),
    promotionDeleteFail: t('promotion:promotionDeleteFail'),
    promotionStopFail: t('promotion:promotionStopFail'),
    guideline: {
      title: t('promotion:titleGuideline'),
      content: t('promotion:contentGuideline')
    },
    summary: {
      title: t('promotion:titleSummary'),
      viewDetail: t('promotion:viewDetail'),
      totalDiscountOrder: t('promotion:totalDiscountOrder'),
      totalDiscountAmount: t('promotion:totalDiscountAmount')
    },
    promotionType: t('promotion:promotionType'),
    general: t('promotion:general'),
    product: t('promotion:product'),
    productCategory: t('promotion:productCategory'),
    discountValue: t('promotion:discountValue'),
    maxDiscount: t('promotion:maxDiscount'),
    startDate: t('promotion:startDate'),
    endDate: t('promotion:endDate'),
    termsAndConditions: t('promotion:termsAndConditions'),
    couponConditions: t('promotion:titleCondition'),
    checkboxPurchaseAmount: t('promotion:checkboxPurchaseAmount'),
    allProduct: t('common:allProducts'),
    allCategories: t('common:allCategories')
  }

  const [initData, setInitData] = useState([])
  const [isPercentDiscount, setIsPercentDiscount] = useState(false)
  const [isMinimumPurchaseAmount, setIsMinimumPurchaseAmount] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false)
  const [totalDiscountOrder, setTotalDiscountOrder] = useState(0)
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0)
  const [showModalUsageDetail, setShowModalUsageDetail] = useState(false)

  useEffect(() => {
    async function fetchData () {
      await getInitDataAsync(match?.params?.id)
    }
    fetchData()
  }, [])

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const onDiscardDeleteModal = () => {
    setIsModalDeleteVisible(false)
  }

  const getInitDataAsync = async (id) => {
    const res = await promotionDataService.getPromotionByIdAsync(id)
    if (res) {
      setInitData(res?.promotion)
      setIsPercentDiscount(res?.promotion?.isPercentDiscount)
      setIsMinimumPurchaseAmount(res?.promotion?.isMinimumPurchaseAmount)
      setIsSpecificBranch(res?.promotion?.isSpecificBranch)
      setIsIncludedTopping(res?.promotion?.isIncludedTopping)
      setTotalDiscountAmount(res?.totalDiscountAmount)
      setTotalDiscountOrder(res?.totalDiscountOrder)
    } else {
      history.push(`${promotionDetailLink}`)
    }
  }

  const onStopPromotion = async (id) => {
    const res = await promotionDataService.stopPromotionByIdAsync(id)
    if (res) {
      await getInitDataAsync(match?.params?.id)
      message.success(pageData.stopPromotionSuccess)
      setShowConfirm(false)
    } else {
      message.error(pageData.promotionStopFail)
    }
  }

  const onDeletePromotion = async (id) => {
    const res = await promotionDataService.deletePromotionByIdAsync(id)
    if (res) {
      message.success(pageData.deletePromotionSuccess)
      history.push('/store/promotion/discount')
    } else {
      message.error(pageData.promotionDeleteFail)
    }
  }

  const onClickViewUsageDetail = () => {
    setShowModalUsageDetail(true)
    promotionCampaignUsageDetailRef?.current?.fetchData(match?.params?.id)
  }

  const onCancelViewUsageDetail = () => {
    setShowModalUsageDetail(false)
  }

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle className="promotion-guideline-page-title" content={initData?.name} />
          <FnbGuideline placement="leftTop" title={pageData.guideline.title} content={pageData.guideline.content} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action:
                  initData?.statusId === PromotionStatus.Schedule
                    ? (
                    <Button type="primary" onClick={() => history.push(`/store/discount/edit/${initData.id}`)}>
                      {pageData.edit}
                    </Button>
                      )
                    : initData?.statusId === PromotionStatus.Active
                      ? (
                    <Button
                      type="primary"
                      onClick={() => {
                        setShowConfirm(true)
                      }}
                    >
                      {pageData.btnStop}
                    </Button>
                        )
                      : null,
                permission:
                  initData?.statusId === PromotionStatus.Schedule
                    ? PermissionKeys.EDIT_PROMOTION
                    : initData?.statusId === PromotionStatus.Active
                      ? PermissionKeys.STOP_PROMOTION
                      : null
              },
              {
                action: (
                  <a onClick={() => history.push('/store/promotion/discount')} className="action-cancel">
                    {pageData.btnLeave}
                  </a>
                ),
                permission: null
              },
              {
                action:
                  initData?.statusId === PromotionStatus.Schedule
                    ? (
                    <a
                      className="action-delete"
                      onClick={() => {
                        setIsModalDeleteVisible(true)
                      }}
                    >
                      {pageData.btnDelete}
                    </a>
                      )
                    : null,
                permission: PermissionKeys.DELETE_PROMOTION
              }
            ]}
          />
        </Col>
      </Row>

      {/* Overview widget */}
      <div className="card-discount-code-detail">
        <div className="d-flex justify-space-between w-100">
          <div className="title-session">
            <span>{pageData.summary.title}</span>
          </div>
          <div className="view-detail-text ml-auto cursor-pointer" onClick={onClickViewUsageDetail}>
            <span>{pageData.summary.viewDetail}</span>
          </div>
        </div>
        {isMaxWidth500
          ? (
          <div>
            <OverviewWidget
              backgroundImage={widgetPurple}
              widgetIcon={<SummaryWidgetPurpleIcon />}
              amount={formatTextNumber(totalDiscountOrder)}
              description={pageData.summary.totalDiscountOrder}
            />
            <OverviewWidget
              backgroundImage={widgetOrange}
              widgetIcon={<SummaryWidgetOrangeIcon />}
              className="mt-24"
              amount={formatTextNumber(totalDiscountAmount)}
              description={`${pageData.summary.totalDiscountAmount} (${getCurrency()})`}
            />
          </div>
            )
          : (
          <Row gutter={[36, 36]}>
            <Col sm={24} lg={12}>
              <OverviewWidget
                backgroundImage={widgetPurple}
                widgetIcon={<SummaryWidgetPurpleIcon />}
                className="float-right"
                amount={formatTextNumber(totalDiscountOrder)}
                description={pageData.summary.totalDiscountOrder}
              />
            </Col>
            <Col sm={24} lg={12}>
              <OverviewWidget
                backgroundImage={widgetOrange}
                widgetIcon={<SummaryWidgetOrangeIcon />}
                amount={formatTextNumber(totalDiscountAmount)}
                description={`${pageData.summary.totalDiscountAmount} (${getCurrency()})`}
              />
            </Col>
          </Row>
            )}
      </div>

      <Card className={`fnb-card card-promotion-detail ${isMaxWidth500 ? 'mt-36' : 'mt-48'}`}>
        <div className="title-session">
          <span>{pageData.general}</span>
        </div>
        {initData?.promotionTypeId === PromotionType.DiscountProduct && (
          <Row>
            <Col span={24}>
              <div className="text-container">
                <p className="text-label">{pageData.product}</p>
                <p className="text-detail">{initData?.isApplyAllProducts
                  ? pageData.allProduct
                  : initData?.productPrices?.map((item) => item?.productName + (item?.name ? `(${item?.name})` : ''))?.join(' - ')}</p>
              </div>
            </Col>
          </Row>
        )}
        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.promotionType}</p>
              <p className="text-detail">
                {ListPromotionType?.map((item) => {
                  if (item.key === initData?.promotionTypeId) {
                    return t(item.name)
                  }
                })}
              </p>
            </div>
          </Col>
        </Row>
        {initData?.promotionTypeId === PromotionType.DiscountProductCategory && (
          <Row>
            <Col span={24}>
              <div className="text-container">
                <p className="text-label">{pageData.productCategory}</p>
                <p className="text-detail">{initData?.isApplyAllCategories ? pageData.allCategories : initData?.productCategories?.map((item) => item?.name)?.join(' - ')}</p>
              </div>
            </Col>
          </Row>
        )}
        <Row>
          {isPercentDiscount
            ? (
            <Col xs={24} lg={12}>
              <div className="text-container">
                <p className="text-label">{pageData.discountValue}</p>
                <p className="text-detail">
                  {initData?.percentNumber}
                  <span>{pageData.percent}</span>
                </p>
              </div>
            </Col>
              )
            : (
            <Col xs={24} lg={12}>
              <div className="text-container">
                <p className="text-label">{pageData.maxDiscount}</p>
                <p className="text-detail">{formatCurrency(initData?.maximumDiscountAmount)}</p>
              </div>
            </Col>
              )}
          {isPercentDiscount && (
            <Col xs={24} lg={12}>
              {initData?.maximumDiscountAmount > 0 && (
                <>
                  <div className="text-container">
                    <p className="text-label">{pageData.maxDiscount}</p>
                    <p className="text-detail">{formatCurrency(initData?.maximumDiscountAmount)}</p>
                  </div>
                </>
              )}
            </Col>
          )}
        </Row>
        <Row>
          <Col xs={24} lg={12}>
            <div className="text-container">
              <p className="text-label">{pageData.startDate}</p>
              <p className="text-detail"> {formatDate(initData?.startDate)}</p>
            </div>
          </Col>
          {initData?.endDate && (
            <Col xs={24} lg={12}>
              <div className="text-container">
                <p className="text-label">{pageData.endDate}</p>
                <p className="text-detail">{formatDate(initData?.endDate)}</p>
              </div>
            </Col>
          )}
        </Row>
        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.termsAndConditions}</p>
              <p className="text-detail">{initData?.termsAndCondition}</p>
            </div>
          </Col>
        </Row>
      </Card>
      <Card className="card-promotion-detail mt-3">
        <div className="title-session">
          <span>{pageData.couponConditions}</span>
        </div>
        <Row>
          <div className="text-container">
            <p className="text-label">
              <Checkbox checked={isMinimumPurchaseAmount} disabled>
                <Text>{pageData.checkboxPurchaseAmount}</Text>
              </Checkbox>
            </p>
            <p className="text-detail-disable">{formatCurrency(initData?.minimumPurchaseAmount)}</p>
          </div>
        </Row>
      </Card>
      <DeleteConfirmComponent
        title={pageData.confirmStop}
        content={t(pageData.confirmStopPromotion, { name: initData?.name })}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnIgnore}
        okText={pageData.btnStop}
        onCancel={onDiscard}
        onOk={() => onStopPromotion(initData?.id)}
      />
      <DeleteConfirmComponent
        title={pageData.confirmDelete}
        content={t(pageData.confirmDeleteMessage, { name: initData?.name })}
        visible={isModalDeleteVisible}
        skipPermission={true}
        cancelText={pageData.btnIgnore}
        okText={pageData.btnDelete}
        onCancel={onDiscardDeleteModal}
        onOk={() => onDeletePromotion(initData?.id)}
      />

      {/* Usage detail */}
      <PromotionCampaignUsageDetailComponent
        t={t}
        ref={promotionCampaignUsageDetailRef}
        showModalUsageDetail={showModalUsageDetail}
        onCancel={onCancelViewUsageDetail}
        promotionDataService={promotionDataService}
      />
    </>
  )
}
