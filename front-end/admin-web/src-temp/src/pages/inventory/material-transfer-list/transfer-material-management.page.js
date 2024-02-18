import { Col, Row } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { hasPermission } from "utils/helpers";
import CheckPermissionAddMaterial from "./components/check-permission-add-transfer";
import { TableTransferMaterial } from "./components/table-transfer-material.component";

export function TransferMaterialManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [isNotPermission, setIsNotPermission] = useState(false)
  const pageData = {
    transferMaterialManagement: t("transferMaterial.title"),
    addNew: t("transferMaterial.addNew", "New Transfer"),
    notPermissionAdd: t("transferMaterial.notPermissionAdd"),
  };
  const handleAddNewTransfer = () => {
    if(hasPermission(PermissionKeys.CREATE_NEW_TRANSFER_MATERIAL)){
      history.push("/inventory/transfer-material/create-new");
    }else{
      setIsNotPermission(true);
    }
  }
  return (
    <>
      <>
        <Row className="fnb-row-page-header">
          <Col className="colPageTitle" span={12} xs={24} lg={12}>
            <PageTitle content={pageData.transferMaterialManagement} />
          </Col>
          <Col span={12} xs={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <FnbAddNewButton
                      onClick={() => {handleAddNewTransfer()}}
                      text={pageData.addNew}
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <CheckPermissionAddMaterial isModalVisible={isNotPermission} handleCancel={() => setIsNotPermission(false)}/>
        <TableTransferMaterial />
      </>
    </>
  );
}
