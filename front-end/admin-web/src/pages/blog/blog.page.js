import { Col, Row } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import PageTitle from 'components/page-title'
import { PermissionKeys } from 'constants/permission-key.constants'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { TableBlog } from './components/table-blog.component'
import './blog.page.scss'

export default function BlogPage (props) {
  const [t] = useTranslation()
  const history = useHistory()
  const pageData = {
    addNew: t('button:addNew'),
    blogManagement: t('blog:title')
  }

  return (
    <>
      <Row className="shop-row-page-header">
        <Col className="pageTitle" span={12} xs={24}>
          <PageTitle content={pageData.blogManagement} />
        </Col>
        <Col span={12} xs={24}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <ShopAddNewButton
                    permission={PermissionKeys.CREATE_BLOG}
                    onClick={() => history.push('/blog/create')}
                    text={pageData.addNew}
                  />
                ),
                permission: PermissionKeys.CREATE_BLOG
              }
            ]}
          />
        </Col>
      </Row>
      <TableBlog />
    </>
  )
}
