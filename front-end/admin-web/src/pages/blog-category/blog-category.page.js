import { Col, Row } from 'antd';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import PageTitle from 'components/page-title';
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import { PermissionKeys } from 'constants/permission-key.constants';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import TableBlogCategory from './components/table-blog-category.component';
export default function BlogCategory() {
  const [t] = useTranslation()
  const history = useHistory()
  const pageData = {
    addNew: t('button.addNew'),
    title: t('blogCategory.title')
  }
  return (
    <>
      <Row>
        <Col span={12}>
          <PageTitle content={pageData.title}></PageTitle>
        </Col>
        <Col span={12}>
          <ActionButtonGroup
            arrayButton={[{
              action: (
                <ShopAddNewButton
                  permission={PermissionKeys.ADMIN}
                  onClick={() => history.push('blog-category/create-blog-category')}
                  text={pageData.addNew}
                />
              ),
              permission: PermissionKeys.ADMIN
            }]}
          />
        </Col>

        <Col span={24}>
          <TableBlogCategory />
        </Col>
      </Row>
    </>
  );
}
