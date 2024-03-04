import './staff.page.scss'
import { Card, message } from 'antd'
import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import TableStaff from './components/table-staff.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import { useTranslation } from 'react-i18next'

export default function StaffPage (props) {
  const { screenKey } = props
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()

  const openEditStaffPage = (id) => {
    history.push(`/staff/edit/${id}`)
  }

  const pageData = {
    btnAddNew: t('button:addNew')
  }

  useEffect(() => {
    const state = location?.state
    if (state?.savedSuccessfully) {
      message.success(state?.message)
      history.replace()
    }
  }, [])

  return (
    <div>
      <ShopAddNewButton
        className="float-right add-new-staff-button"
        text={pageData.btnAddNew}
        onClick={() => history.push('/staff/create')}
      />
      <div className="clearfix"></div>
      <Card className="fnb-card">
        <TableStaff screenKey={screenKey} onEditStaff={openEditStaffPage} />
      </Card>
    </div>
  )
}
