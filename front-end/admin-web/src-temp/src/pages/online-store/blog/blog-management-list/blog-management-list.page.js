import { Col, Row } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { TableBlog } from "../components/table-blog.component";
import "./blog-management-list.page.scss";

export function BlogPageManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    addNew: t("button.addNew"),
    blog_management: t("blog.blog_management"),
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col className="pageTitle" span={12} xs={24}>
          <PageTitle content={pageData.blog_management} />
        </Col>
        <Col span={12} xs={24}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <FnbAddNewButton
                    permission={PermissionKeys.CREATE_BLOG}
                    onClick={() => history.push("/online-store/blog-management/create-blog")}
                    text={pageData.addNew}
                  />
                ),
                permission: PermissionKeys.CREATE_BLOG,
              },
            ]}
          />
        </Col>
      </Row>
      <TableBlog />
    </>
  );
}
