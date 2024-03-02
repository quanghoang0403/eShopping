import { Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import './fnb-widget.component.scss'
import { TriangleIncreaseIcon, TriangleReduceIcon } from 'constants/icons.constants'
import { formatTextNumber, getSuffixShortValue, getShortValue, getCurrency } from 'utils/helpers'
import FnbWidgetStyle from './fnb-widget.component.style'
function FnbWidget (props) {
  const [t] = useTranslation()
  const { summaryItem, titleTotal, icon, suffixData, isShowAverage = true, styles } = props
  const pageData = {
    order: t('dashboard.order', 'Order'),
    average: t('dashboard.average', 'Average')
  }
  return (
    <FnbWidgetStyle styles={styles}>
      <div className="summary-card-average">
        <div className="section-total">
          <Row>
            <Col>
              <div className="sumnary-icon">{icon}</div>
            </Col>
            <Col>
              <div className="summary-title">
                <p className="title">{titleTotal}</p>
              </div>
            </Col>
            <Col>
              <div className={`acceleration-card ${summaryItem?.percent > 0 ? 'increase' : 'decrease'}`}>
                <Row>
                  {summaryItem?.percent > 0
                    ? (
                    <TriangleIncreaseIcon className="icon-increase-triangle" />
                      )
                    : (
                    <TriangleReduceIcon className="icon-increase-triangle" />
                      )}
                  <p className="percent">{Math.abs(summaryItem?.percent)}%</p>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col>
              <div className="summary-short-value">
                <p>{getShortValue(summaryItem?.total)}</p>
                <p className="suffix">{t(`report.${getSuffixShortValue(summaryItem?.total)}`, '')}</p>
              </div>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col>
              <div className="summary-suffix">
                <p className="data">{formatTextNumber(summaryItem?.total)}</p>
                <p className="suffix-text">{suffixData}</p>
              </div>
            </Col>
            <Col></Col>
          </Row>
        </div>
        {isShowAverage && (
          <div className="section-average">
            <Row>
              <Col>
                <div className="sumnary-icon">{icon}</div>
              </Col>
              <Col>
                <div className="summary-title">
                  <p className="title">{pageData.average}</p>
                </div>
              </Col>
              <Col>
                <div className={`acceleration-card ${summaryItem?.percentAverage > 0 ? 'increase' : 'decrease'}`}>
                  <Row>
                    {summaryItem?.percentAverage > 0
                      ? (
                      <TriangleIncreaseIcon className="icon-increase-triangle" />
                        )
                      : (
                      <TriangleReduceIcon className="icon-increase-triangle" />
                        )}
                    <p className="percent">{Math.abs(summaryItem?.percentAverage)}%</p>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row>
              <Col></Col>
              <Col>
                <div className="summary-short-value">
                  <p>{getShortValue(summaryItem?.average)}</p>
                  <p className="suffix">{t(`report.${getSuffixShortValue(summaryItem?.average)}`, '')}</p>
                </div>
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <Col></Col>
              <Col>
                <div className="summary-suffix">
                  <p className="data">{formatTextNumber(summaryItem?.average)}</p>
                  <p className="suffix-text">{`${getCurrency()} / ${pageData.order}`}</p>
                </div>
              </Col>
              <Col></Col>
            </Row>
          </div>
        )}
      </div>
    </FnbWidgetStyle>
  )
}

export default FnbWidget
