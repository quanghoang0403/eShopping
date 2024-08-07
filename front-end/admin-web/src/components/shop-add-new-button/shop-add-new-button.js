import { Button } from 'antd'
import { capitalizeFirstLetterEachWord, hasPermission } from 'utils/helpers'
import { IconBtnAdd } from 'constants/icons.constants'

import './shop-add-new-button.scss'

export function ShopAddNewButton({
  className,
  onClick,
  text,
  htmlType,
  permission,
  disabled,
  hideIcon,
  idControl = 'btn-add-new'
}) {
  const renderButton = () => {
    const titleFormatted = capitalizeFirstLetterEachWord(text)
    if (hasPermission(permission)) {
      return (
        <Button
          icon={hideIcon ? <></> : <IconBtnAdd />}
          className={`shop-add-new-button ${className ?? ''}`}
          type="primary"
          onClick={onClick}
          htmlType={htmlType}
          disabled={disabled}
          id={idControl}
        >
          <span>{titleFormatted}</span>
        </Button>
      )
    }

    if (!permission) {
      return (
        <Button
          icon={hideIcon ? <></> : <IconBtnAdd />}
          className={`shop-add-new-button ${className ?? ''}`}
          type="primary"
          onClick={onClick}
          htmlType={htmlType}
          disabled={disabled}
          id={idControl}
        >
          <span>{titleFormatted}</span>
        </Button>
      )
    }
  }
  return <>{renderButton()}</>
}
