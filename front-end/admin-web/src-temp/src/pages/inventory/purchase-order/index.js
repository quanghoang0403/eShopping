import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import PurchaseOrderPage from "./purchase-order.page";

const mapDispatchToProps = () => {
  return {
    purchaseOrderDataService: purchaseOrderDataService,
  };
};
const mapStateToProps = (state) => {
  return {
    storeId: state.session?.auth?.user?.storeId,
  };
};

export default compose(
  withTranslation("translations"),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(PurchaseOrderPage);
