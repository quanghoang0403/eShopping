/**
 * Arrange the order of the button
 */

import { Dropdown, Menu, Space } from 'antd'
import { ArrowDropDownIcon } from 'constants/icons.constants'
import { hasPermission } from 'utils/helpers'
import './action-button-group.scss'
import { useTranslation } from 'react-i18next'

export default function ActionButtonGroup(props) {
  const { arrayButton } = props
  const { t } = useTranslation()
  const countNumberValidButton = (arrayButton) => {
    let totalButton = 0
    arrayButton?.forEach((button) => {
      const permission = button?.permission ? button?.permission : 'public'
      const isAccess = hasPermission(permission)
      if (isAccess === true) {
        totalButton += 1
      }
    })

    return totalButton
  }

  const renderButton = (buttons) => {
    return buttons?.map((button, index) => {
      return hasPermission(button?.permission ? button?.permission : 'public')
        ? (
          <div onClick={button?.onClick} key={index}>
            {button.action}
          </div>
        )
        : (
          <></>
        )
    })
  }

  const renderMenu = (buttons) => {
    return (
      <Menu className="dropdown-action">
        {buttons?.map((button, index) => {
          const permission = button?.permission ? button?.permission : 'public'
          const isAccess = hasPermission(permission)
          if (isAccess === true) {
            return (
              <Menu.Item className="menu-action" key={index} onClick={button?.onClick}>
                {button.action}
              </Menu.Item>
            )
          }
          return <></>
        })}
      </Menu>
    )
  }

  const renderAction = () => {
    const numberValidButton = countNumberValidButton(arrayButton)
    if (numberValidButton <= 3) {
      return (
        <>
          <Space className="float-right revert-order-item">{renderButton(arrayButton)}</Space>
        </>
      )
    } else {
      const firstIndex = 2
      const twoItem = arrayButton.splice(0, firstIndex)
      const remainingButtonItems = arrayButton.splice(-firstIndex)
      const menu = renderMenu(remainingButtonItems)
      return (
        <>
          <Space className="float-right revert-order-item">
            {renderButton(twoItem)}
            {numberValidButton > 2 && (
              <Dropdown
                overlay={menu}
                trigger={['click']}
                placement="bottomLeft"
                arrow={{ pointAtCenter: true }}
                overlayClassName="dropdown-box"
              >
                <a onClick={(e) => e.preventDefault()} className="arrow-dropdown-icon">
                  {t('button.action')}
                  <ArrowDropDownIcon />
                </a>
              </Dropdown>
            )}
          </Space>
        </>
      )
    }
  }

  return <>{renderAction()}</>
}
