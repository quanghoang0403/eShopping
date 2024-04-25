import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { resetSession } from '../../store/modules/session/session.actions'
import TopBar from './top-bar.component'

const mapStateToProps = (state) => {
  return {
    signedInUser: state.session?.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(resetSession())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(TopBar)
