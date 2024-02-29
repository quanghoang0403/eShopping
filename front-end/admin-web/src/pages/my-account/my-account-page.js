import React from 'react'
import { Card, Col, Row } from 'antd'
import PageTitle from 'components/page-title'
import UserInformationComponent from './components/user-information.component'
import './my-account.scss'
import { useTranslation } from 'react-i18next'

export default function MyAccountPage (props) {
  const { t } = useTranslation()
  const pageData = {
    userInfo: t('home:userInfo'),
    tabNameAccount: t('account:tabNameAccount')
  }

  return (
    <>
      <Row className="mt-4" align="middle" gutter={[0, 0]}>
        <Col span={12} xs={24} sm={24} md={24} lg={12} className="link">
          <PageTitle className="title-page-my-account" content={pageData.userInfo} />
        </Col>
      </Row>
      <div className="col-input-full-width">
        <Row className="w-100">
          <Col span={24}>
              <Card className="my-account-card">
                <UserInformationComponent />
              </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}
