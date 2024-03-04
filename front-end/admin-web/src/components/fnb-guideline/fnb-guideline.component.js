import { Button, Tooltip } from 'antd'
import { BookGuidelineIcon, PromotionGuidelineIcon } from 'constants/icons.constants'
import { useMediaQuery } from 'react-responsive'
import './shop-guideline.component.scss'

export function FnbGuideline ({ placement, title, content, nameTooltip, styles, largeButton }) {
  const isMobile = useMediaQuery({ maxWidth: 576 })
  const titleTooltip = (title, content) => {
    return (
      <div className="guideline-wrapper">
        <div className="guideline-header">
          <span className="icon">
            <BookGuidelineIcon />
          </span>
          {title}
        </div>
        <p className="guideline-content" dangerouslySetInnerHTML={{ __html: content }}></p>
      </div>
    )
  }

  return (
    <Tooltip
      overlayClassName={`${nameTooltip !== undefined ? `shop-guideline-${nameTooltip}` : 'shop-guideline'}`}
      overlayStyle={styles}
      placement={placement}
      title={titleTooltip(title, content)}
      trigger={isMobile ? 'click' : 'hover'}
    >
      {largeButton
        ? (
        <Button className="custom-tooltip-button">
          <PromotionGuidelineIcon />
        </Button>
          )
        : (
        <PromotionGuidelineIcon />
          )}
    </Tooltip>
  )
}
