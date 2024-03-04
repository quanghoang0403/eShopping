import { Col, Row } from 'antd'
import { useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import './overview-widget.style.scss'

export default function OverviewWidget (props) {
  const { backgroundImage, className, widgetIcon, amount, description } = props
  const isMobile = useMediaQuery({ maxWidth: 500 })

  useEffect(() => {}, [])

  return (
    <div
      className={`overview-widget ${className}`}
      style={{
        backgroundImage: "url('" + backgroundImage + "')"
      }}
    >
      {isMobile
        ? (
        <>
          <div className="text-amount">
            <span>{amount}</span>
          </div>
          <Row>
            <Col span={18}>
              <div className="text-description">
                <span>{description}</span>
              </div>
            </Col>
            <Col span={6}>
              <div className="widget-icon-container">{widgetIcon}</div>
            </Col>
          </Row>
        </>
          )
        : (
        <Row>
          <Col span={18}>
            <div className="text-amount">
              <span>{amount}</span>
            </div>
            <div className="text-description">
              <span>{description}</span>
            </div>
          </Col>
          <Col span={6}>
            <div className="widget-icon-container">{widgetIcon}</div>
          </Col>
        </Row>
          )}
    </div>
  )
}
