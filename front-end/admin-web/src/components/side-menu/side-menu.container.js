import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { resetSession } from '../../store/modules/session/session.actions'
import SideMenu from './side-menu.component'

const mapStateToProps = (state) => {
  return {
    signedInUser: state.session?.currentUser
  }
}

const mapDispatchToProps = () => {
}

export default compose(
  connect(mapStateToProps),
  withRouter
)(SideMenu)
