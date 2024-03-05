import { LogoutIcon, MenuIcon, SettingFill, ShopIcon, StaffUserFill } from 'constants/icons.constants'
import { Avatar, Drawer, Image, Layout, Menu, Popover } from 'antd'
import { DefaultConstants } from 'constants/string.constants'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { store } from 'store'
import { hasPermission } from 'utils/helpers'
import logo from 'assets/images/logo.png'
import './index.scss'
import { useTranslation } from 'react-i18next'

const { Header } = Layout
const { SubMenu } = Menu

function TopBar (props) {
  const { signedInUser, signOut, history, menuItems, route, isChild, parentKey } = props
  const [visible, setVisible] = useState(false)
  const [selectedKey, setSelectedKey] = useState('')
  const [currentSubMenuKeys, setCurrentSubMenuKeys] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    if (route.focus) {
      setSelectedKey(route.focus)
    } else {
      setSelectedKey(route.key)
    }

    if (isChild) {
      setCurrentSubMenuKeys([parentKey])
    }
  }, [route])

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const renderMenuMobile = () => {
    showDrawer(true)
  }

  const getShortName = (name) => {
    const names = name?.split(' ') ?? ''
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0]
    }
    if (names.length === 1) {
      return names[0][0]
    }
    return names
  }

  const logOut = () => {
    const request = { UserId: signedInUser?.userId }
    signOut(request).then(() => {
      window.location.replace('/login')
    })
  }

  /* Side Menu */
  const onOpenChange = (items) => {
    const latestOpenKey = items.find((key) => currentSubMenuKeys.indexOf(key) === -1)
    setCurrentSubMenuKeys(latestOpenKey ? [latestOpenKey] : [])
  }

  const renderMenusItems = () => {
    const { session } = store.getState()
    const { user } = session?.auth

    const html = menuItems.map((item) => {
      if (item.child && item.child.length > 0) {
        const childs = item.child
        let isAccess = false
        childs.forEach((child) => {
          if (hasPermission(child.permission) === true) {
            isAccess = true
          }
        })
        if (isAccess === true) {
          return (
            <SubMenu key={item.key} icon={item.icon} title={item.name}>
              {childs.map((child) => {
                const isShow = child?.permission && hasPermission(child.permission)
                if (child.isMenu === true && isShow === true) {
                  return (
                    <Menu.Item style={{ paddingLeft: '0px !important' }} key={child.key}>
                      <Link to={child.path} />
                      {child.name}
                    </Menu.Item>
                  )
                }
              })}
            </SubMenu>
          )
        }
      } else {
        const isShow = item?.permission && hasPermission(item.permission)
        /// If item is menu, then check if it has permission
        if (item.isMenu === true && isShow === true) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path} />
              {item.name}
            </Menu.Item>
          )
        } else if (!item?.permission && user?.accountType === DefaultConstants.ADMIN_ACCOUNT) {
          /// If item is menu, then check if it has not permission
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path} />
              {item.name}
            </Menu.Item>
          )
        }
      }
    })
    return html
  }

  return (
    <>
      <Header className="expand-header">
        <div className="header-content">
          <div className="header-mobile">
            <div className="menu-icon" onClick={renderMenuMobile}>
              <MenuIcon />
            </div>
            <div className="logo-box">
              <div className="header-information">
                  <div className="header-name">{signedInUser?.fullName}</div>
                  <div className="header-email">{signedInUser?.email}</div>
              </div>
              <div className="header-avatar">
                <Avatar src={signedInUser?.thumbnail ?? null} className="avatar-popover">
                  {getShortName(signedInUser?.fullName)}
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </Header>
      <Drawer width={'70%'} placement={'left'} closable={false} onClose={onClose} visible={visible}>
        <div className="menu menu-mobile">
          <Menu
            selectedKeys={[selectedKey]}
            openKeys={currentSubMenuKeys}
            mode="inline"
            onOpenChange={(e) => onOpenChange(e)}
          >
            {renderMenusItems()}
          </Menu>
        </div>
        <div className="trigger-footer-mobile">
          <div onClick={() => logOut()} className="logout-mobile">
            <span className="icon-logout">
              <LogoutIcon width={28} height={28} />
            </span>
            <span className="title-logout">{t('login.logout')}</span>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default TopBar
