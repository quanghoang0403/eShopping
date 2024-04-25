import { Layout } from 'antd'
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
