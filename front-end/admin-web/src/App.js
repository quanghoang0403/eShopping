import { Layout } from 'antd'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'
import { compose } from 'redux'
import { store } from 'store'
import PrivateRoute from './components/private-route'
import routes from './pages/routes'
import { Spin } from 'antd';
import './stylesheets/styles.scss'
import './stylesheets/main.scss'

function App(props) {
  const ref = React.useRef(null)
  useEffect(() => {
    if (props.loading) {
      ref.current.continuousStart()
    } else {
      ref.current.complete()
    }
    console.log(props.loading)
  }, [props.loading])

  return (
    <Router>
      <LoadingBar color="#ff8c21" ref={ref} />
      <div id="loadingIndicator">
        <Spin size="large" />
      </div>
      <Layout className="ant-layout ant-layout-has-sider" style={{ minHeight: '100vh' }}>
        <Switch>
          {routes.map((route) => {
            const { component: Component, key, path, auth, ...rest } = route
            if (auth === true) {
              if (route.child.length > 0) {
                return route.child.map((child) => {
                  const { component: Component, ...rest } = child
                  return (
                    <PrivateRoute
                      key={child.key}
                      route={child}
                      routes={routes}
                      path={child.path}
                      component={Component}
                      parentKey={key}
                      isChild={true}
                      {...rest}
                    />
                  )
                })
              }

              return (
                <PrivateRoute
                  key={key}
                  route={route}
                  routes={routes}
                  path={path}
                  component={Component}
                  {...rest}
                />
              )
            } else {
              return <Route key={key} path={path} component={Component} {...rest} />
            }
          })}
        </Switch>
      </Layout>
    </Router>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state?.processing?.isDataServiceProcessing || false
  }
}

export default connect(mapStateToProps)(App)
