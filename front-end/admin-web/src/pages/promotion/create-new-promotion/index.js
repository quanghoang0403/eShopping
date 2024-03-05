import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// import productDataService from 'data-services/product/product-data.service'
// import productCategoryDataService from 'data-services/product-category/product-category-data.service'
// import storeDataService from 'data-services/store/store-data.service'
// import promotionDataService from 'data-services/promotion/promotion-data.service'
import CreateNewPromotionManagement from './create-new-promotion.page'

const mapDispatchToProps = () => {
  return {
    // productDataService,
    // productCategoryDataService,
    // storeDataService,
    // promotionDataService,
  }
}

export default compose(
  connect(null, mapDispatchToProps),
  withRouter
)(CreateNewPromotionManagement)
