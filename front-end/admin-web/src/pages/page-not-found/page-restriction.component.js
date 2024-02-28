import React from 'react'
import { useHistory } from 'react-router-dom'

import './style.scss'

export default function PageNotPermitted (props) {
  const history = useHistory()

  return (
    <div className="page-not-permitted">
      <div className="page-background">
        <div className="img-background">
          <div className="box-center">
            <div className="head-text">OPPS</div>
            <div className="exclamation-point">!</div>
            <div className="error-text">Truy cập bị hạn chế</div>
            <div className="message-text">Chúng tôi rất tiếc, nhưng bạn không có quyền truy cập vào trang này</div>
            <button className="button-bg" onClick={() => history.push('/')}>
              <span className="button-text">Quay về trang chủ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
