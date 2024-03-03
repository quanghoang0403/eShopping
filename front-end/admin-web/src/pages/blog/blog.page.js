import { Col, Row } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { TableBlog } from "../components/table-blog.component";
import "./blog.page.scss";

export default function BlogPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    addNew: t("button:addNew"),
    blogManagement: t("blog:title"),
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col className="pageTitle" span={12} xs={24}>
          <PageTitle content={pageData.blogManagement} />
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
