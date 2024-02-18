import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { TransferMaterialManagement } from "./transfer-material-management.page";

const mapStateToProps = (state) => {
  return {
    storeId: state.session?.auth?.user?.storeId,
  };
};

export default compose(withTranslation("translations"), connect(mapStateToProps, null), withRouter)(TransferMaterialManagement);
