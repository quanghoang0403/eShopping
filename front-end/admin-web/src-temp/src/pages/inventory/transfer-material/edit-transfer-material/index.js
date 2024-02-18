import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import EditTransferMaterial from "./edit-transfer-material.page";
import materialDataService from "data-services/material/material-data.service";
import unitConversionDataService from "data-services/unit-conversion/unit-conversion-data.service";
import transferMaterialDataService from "data-services/transfer-material/transfer-material-data.service";

const mapDispatchToProps = () => {
  return {
    materialDataService: materialDataService,
    unitConversionDataService: unitConversionDataService,
    transferMaterialDataService : transferMaterialDataService
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(EditTransferMaterial);
