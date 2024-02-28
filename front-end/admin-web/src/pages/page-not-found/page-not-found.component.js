import React from 'react'
import { useHistory } from 'react-router-dom'

import './style.scss'

export default function PageNotFound (props) {
  const history = useHistory()

  return (
    <div className="page-not-found">
      <div className="page-background">
        <div className="img-background">
          <div className="box-center">
            <div className="head-text">OPPS</div>
            <div className="exclamation-point">!</div>
            <div className="error-text">Không tìm thấy trang</div>
            <div className="message-text">Chúng tôi rất tiếc, nhưng chúng tôi không thể tìm thấy trang bạn yêu cầu</div>
            <button className="button-bg" onClick={() => history.push('/')}>
              <span className="button-text">Quay về trang chủ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
