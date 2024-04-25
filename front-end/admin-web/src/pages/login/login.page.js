import { Button, Form, Image, Input, message, Row, Select } from 'antd'
import 'antd/dist/antd.css'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  EyeIcon,
  EyeOpenIcon,
  LockIcon,
  UserNameIcon
} from 'constants/icons.constants'
import {
  setCurrentUser,
  setPermissions,
} from 'store/modules/session/session.actions'
import { getParamsFromUrl, tokenExpired } from 'utils/helpers'
import { getStorage, localStorageKeys, setStorage } from 'utils/localStorage.helpers'
import { claimTypesConstants } from '../../constants/claim-types.constants'
import loginDataService from '../../data-services/login/login-data.service'
import permissionDataService from 'data-services/permission/permission-data.service'
import '../../stylesheets/authenticator.scss'
import logo from 'assets/images/logo.png'
import { useTranslation } from 'react-i18next'

const LoginPage = (props) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [isLogin, setIsLogin] = useState(true)
  const { t } = useTranslation()
  const pageData = {
    title: t('login.title'),
    email: t('login.email'),
    password: t('login.password'),
    loginHere: t('login.loginHere'),
    pleaseInputYourEmail: t('login.pleaseInputYourEmail'),
    pleaseInputYourPassword: t('login.pleaseInputYourPassword'),
    loginSuccess: t('login.loginSuccess'),
    loginFail: t('login.loginFail'),
    placeholderEmail: t('login.placeholderEmail'),
    placeholderPassword: t('login.placeholderPassword'),
    permissionDenied: t('login.permissionDenied'),
    logout: t('login.logout')
  }
  useEffect(() => {
    const { search } = props.location
    const params = getParamsFromUrl(search)
    const { username } = params
    if (username) {
      form.setFieldsValue({
        userName: username
      })
    }
  }, [])

  const onFinish = (values) => {
    loginDataService
      .authenticate(values)
      .then((res) => {
        const { token, refreshToken } = res
        setupWorkspace(token)
        setStorage(localStorageKeys.TOKEN, token)
        setStorage(localStorageKeys.REFRESH_TOKEN, refreshToken)
      })
      .catch(() => { })
  }

  const setupWorkspace = (token) => {
    permissionDataService.getPermissionsAsync(token).then((res) => {
      const { permissions } = res
      if (permissions.length > 0) {
        message.success(pageData.loginSuccess)
        const currentUser = getUserInfo(token)
        dispatch(setPermissions(permissions))
        dispatch(setCurrentUser(currentUser))
        props.history.push('/')
      } else {
        message.error(pageData.permissionDenied)
      }
    })
  }

  const getUserInfo = (token) => {
    const claims = jwtDecode(token)
    const user = {
      userId: claims[claimTypesConstants.id],
      accountId: claims[claimTypesConstants.accountId],
      fullName: claims[claimTypesConstants.fullName],
      email: claims[claimTypesConstants.email],
      accountType: claims[claimTypesConstants.accountType],
      thumbnail: claims[claimTypesConstants.thumbnail]
    }
    return user
  }


  return (
    <div className="c-authenticator">
      <div className="form-logo">
        <div>
          <Image preview={false} src={logo} width={300} />
        </div>
      </div>
      <div className="div-form login-contain login-contain__right">
        <Form
          className="login-form login-inner login-inner__spacing"
          name="basic"
          autoComplete="off"
          onFinish={onFinish}
          form={form}
        >
          <div className="frm-content">

            {!isLogin && (
              <div className="error-field">
                <p>{pageData.loginFail}</p>
              </div>
            )}

            <h1 className="label-login">{pageData.title}</h1>
            <h4 className="label-input">{pageData.email}</h4>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: pageData.pleaseInputYourEmail
                },
                {
                  type: 'email',
                  message: pageData.pleaseInputYourEmail
                }
              ]}
            >
              <Input prefix={<UserNameIcon />} placeholder={pageData.placeholderEmail} />
            </Form.Item>

            <h4 className="label-input">{pageData.password}</h4>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: pageData.pleaseInputYourPassword
                }
              ]}
            >
              <Input.Password
                prefix={<LockIcon />}
                iconRender={(visible) => (visible ? <EyeOpenIcon /> : <EyeIcon />)}
                placeholder={pageData.placeholderPassword}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                {pageData.loginHere}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
