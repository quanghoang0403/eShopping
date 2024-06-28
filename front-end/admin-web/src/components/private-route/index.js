import { Layout, message } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Route } from 'react-router-dom'
import { store } from 'store'
import { resetSession } from 'store/modules/session/session.actions'
import { hasPermission, tokenExpired } from 'utils/helpers'
import { getStorage, localStorageKeys } from 'utils/localStorage.helpers'
import SideMenu from '../side-menu'
import TopBar from '../top-bar/index'
import signalRService from 'services/signalR.service'
import { OrderHubConstants } from 'constants/hub.constants'

const { Content } = Layout
export default function PrivateRoute(props) {
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    exact,
    route,
    routes,
    computedMatch,
    component: Component,
    key,
    path,
    auth,
    isChild,
    parentKey,
    ...rest
  } = props
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const { permission } = route
    const token = getStorage(localStorageKeys.TOKEN)
    if (token) {
      if (permission && !hasPermission(permission)) {
        history.push('/page-not-permitted')
      }
    } else {
      console.log('resetSession')
      dispatch(resetSession())
      history.push('/login')
    }

    // filter menus from routes where isMenu === true
    const menuItems = routes.filter((route) => route.isMenu === true)
    setMenuItems(menuItems)
  }, [route, routes, history, dispatch])

  useEffect(() => {
    signalRService.start()

    signalRService.on(OrderHubConstants.CREATE_ORDER_BY_CUSTOMER, () => {
      message.success('New order created!')
    })

    signalRService.on(OrderHubConstants.UPDATE_STATUS_BY_CUSTOMER, (orderCode, status) => {
      message.success(`Order ${orderCode} status updated to ${status}!`)
      console.log('Order Status Updated: ', orderCode, status)
    })

    signalRService.on(OrderHubConstants.UPDATE_ORDER_BY_CUSTOMER, (orderCode) => {
      message.success(`Order ${orderCode} updated!`)
    })

    return () => {
      signalRService.off(OrderHubConstants.CREATE_ORDER_BY_CUSTOMER)
      signalRService.off(OrderHubConstants.UPDATE_STATUS_BY_CUSTOMER)
      signalRService.off(OrderHubConstants.UPDATE_ORDER_BY_CUSTOMER)
      signalRService.stop()
    }
  }, [])

  return (
    <>
      <SideMenu menuItems={menuItems} route={route} routes={routes} isChild={isChild} parentKey={parentKey} />
      <Layout className="shop-site-layout">
        <TopBar menuItems={menuItems} route={route} routes={routes} isChild={isChild} parentKey={parentKey} />
        <Content className="main-content-bg main-body">
          <Route key={key} path={path} component={Component} {...rest} />
        </Content>
      </Layout>
    </>
  )
}
