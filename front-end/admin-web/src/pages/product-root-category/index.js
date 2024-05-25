import RootCategoryDataService from "data-services/product-root-category/product-root-category-data.service";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { compose } from "redux";
import RootCategory from "./root-category.page";
const mapDispatchToProps = () => {
    return {
        RootCategoryDataService
    }
}
export default compose(connect(mapDispatchToProps), withRouter)(RootCategory)