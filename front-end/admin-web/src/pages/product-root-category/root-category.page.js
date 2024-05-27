import { Card, Col, Row, Space } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import PageTitle from "components/page-title";
import { ShopAddNewButton } from "components/shop-add-new-button/shop-add-new-button";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TableRootCategory from "./components/table-root-category.component";

export default function RootCategory(props) {
    const history = useHistory()
    const [t] = useTranslation()
    const pageData = {
        title: t('root-category.title')
    }
    return (
        <>
            <Row>
                <Col xs={24} sm={24} xl={12}>
                    <Space className="page-title">
                        <PageTitle content={pageData.title} />
                    </Space>
                </Col>
                <Col xs={24} sm={24} xl={12} className="button-box product-filter-box page-action-group">
                    <ActionButtonGroup
                        arrayButton={[
                            {
                                action: (
                                    <ShopAddNewButton
                                        permission={PermissionKeys.CREATE_PRODUCT_CATEGORY}
                                        onClick={() => history.push('/product-root-category/create')}
                                        text={t('button.add')}
                                    />
                                ),
                                permission: PermissionKeys.CREATE_PRODUCT
                            }
                        ]}
                    />
                </Col>
            </Row>
            <Card className="shop-card mt-4">
                <TableRootCategory />
            </Card>
        </>
    );
}
