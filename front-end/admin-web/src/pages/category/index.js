import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CategoryPage from './category.page'
// import productCategoryDataService from 'data-services/product-category/product-category-data.service'
// import productDataService from 'data-services/product/product-data.service'

const mapDispatchToProps = () => {
  return {
    // productDataService,
    // productCategoryDataService
  }
}

export default compose(
  connect(mapDispatchToProps),
  withRouter
)(CategoryPage)
