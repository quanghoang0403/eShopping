import { Avatar, Image, Layout, Menu } from 'antd'
import { CollapseIcon, ExpandIcon, LogoutIcon } from 'constants/icons.constants'
import { DefaultConstants } from 'constants/string.constants'
import { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { compose } from 'redux'
import { store } from 'store'
import { hasPermission, sortChildRoute } from 'utils/helpers'
import { useTranslation } from 'react-i18next'
import './index.scss'
const { Sider } = Layout
const { SubMenu } = Menu

function SideMenu (props) {
  const { signedInUser, signOut, menuItems, route, isChild, parentKey } = props
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState('')
  const [currentSubMenuKeys, setCurrentSubMenuKeys] = useState([])
  const history = useHistory()
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
  }, [])

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed)
  }

  const onOpenChange = (items) => {
    const latestOpenKey = items.find((key) => currentSubMenuKeys.indexOf(key) === -1)
    setCurrentSubMenuKeys(latestOpenKey ? [latestOpenKey] : [])
  }

  const onFocusFirstItem = (childs) => {
    if (childs?.length > 0) {
      childs = sortChildRoute(childs).sort((a, b) => {
        return a.position - b.position
      })
      for (const child of childs) {
        if (hasPermission(child.permission) === true) {
          history.push(child.path)
          break
        }
      }
    }
  }

  const logOut = () => {
    // const request = { UserId: signedInUser?.userId }
    // signOut(request).then(() => {
    //   window.location.replace('/login')
    // })
  }

  const renderMenusItems = () => {
    const { session } = store.getState()
    const { user } = session?.auth

    const currentMenuItems = menuItems

    const html = currentMenuItems?.map((item) => {
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
            <>
              <SubMenu
                onTitleClick={() => onFocusFirstItem(childs)}
                key={item.key}
                icon={item.icon}
                title={item.name}
              >
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
            </>
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

  const handleClickSettingNavigate = () => {
    const header = document.getElementById('header')
    if (header.classList.contains('expand-header')) {
      header.classList.remove('expand-header')
      header.classList.add('collapse-header')
    } else {
      header.classList.add('expand-header')
      header.classList.remove('collapse-header')
    }
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

  const CustomTrigger = () => (
    <div className="trigger-footer">
      <div onClick={() => logOut()} className="logout">
        <span className="icon-logout">
          <LogoutIcon width={28} height={28} />
        </span>
        <span className="title-logout">{t('login.logout')}</span>
      </div>
      <div onClick={handleClickSettingNavigate} className="icon-navigate">
        <span className="icon-expand">
          <ExpandIcon />
        </span>
        <span className="icon-collapse">
          <CollapseIcon />
        </span>
      </div>
    </div>
  )

  return (
    <Sider
      className="sider-wrapper"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={<CustomTrigger />}
    >
      <div className="bg-logo">
        <div className="logo-box">
          <div className="header-avatar">
            <Avatar src={signedInUser?.thumbnail ?? null} className="avatar-popover">
              {getShortName(signedInUser?.fullName)}
            </Avatar>
          </div>
          <div className="header-information">
              <div className="header-name">{signedInUser?.fullName}</div>
              <div className="header-email">{signedInUser?.email}</div>
          </div>
        </div>
      </div>
      <div className="menu">
        <Menu
          selectedKeys={[selectedKey]}
          openKeys={currentSubMenuKeys}
          mode="inline"
          onOpenChange={(e) => onOpenChange(e)}
        >
          {renderMenusItems()}
        </Menu>
      </div>
    </Sider>
  )
}

export default SideMenu
