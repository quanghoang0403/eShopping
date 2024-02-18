import { Card, Col, Row, message } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import customerDataService from "data-services/customer/customer-data.service";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import languageService from "services/language/language.service";
import { handleDownloadFile } from "utils/helpers";
import TableCustomer from "./components/table-customer.component";

/**
 * Page Customer Management
 * description: page manage customer primary template
 */
export default function CustomerManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    customerManagement: t("customer.title"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
    btnExport: t("button.export"),
    import: t("button.import"),
  };
  const createCustomerPage = "/customer/create-new";

  const gotoAddNewCustomerPage = () => {
    history.push(createCustomerPage);
  };

  const handleExportAllCustomer = async () => {
    try {
      const languageCode = languageService.getLang();
      const response = await customerDataService.exportAllCustomersAsync(languageCode);
      handleDownloadFile(response);
    } catch (error) {
      const { statusText } = error;
      message.error(statusText);
    }
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} md={12} lg={12}>
          <PageTitle content={pageData.customerManagement} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} className="button-box product-filter-box customer-action-group-button">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <FnbAddNewButton
                    permission={PermissionKeys.CREATE_CUSTOMER}
                    onClick={() => gotoAddNewCustomerPage(true)}
                    text={pageData.btnAddNew}
                  />
                ),
                permission: PermissionKeys.CREATE_CUSTOMER,
              },
              {
                action: (
                  <div
                    className="second-button btn-print-barcode"
                    onClick={() => {
                      handleExportAllCustomer();
                    }}
                  >
                    {pageData.btnExport}
                  </div>
                ),
                permission: PermissionKeys.VIEW_CUSTOMER,
              },
              {
                action: (
                  <a
                    href="javascript:void(0)"
                    className="second-button"
                    onClick={() => history.push("/customer/import")}
                  >
                    {pageData.import}
                  </a>
                ),
                permission: PermissionKeys.CREATE_CUSTOMER,
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="fnb-card-full">
        <TableCustomer />
      </Card>
    </>
  );
}
