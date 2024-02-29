import React from 'react'
import './index.scss'
import { useTranslation } from 'react-i18next'
/**
 * Badge Status
 * @param {bool} status - Status of the badge
 * @returns Active or Inactive label
 */
export function BadgeStatus (props) {
  const { isActive } = props
  const { t } = useTranslation()
  const pageData = {
    active: t('common:active'),
    inactive: t('common:inactive')
  }

  const renderStatus = () => {
    if (isActive) {
      return (
        <span className="badge-status active">
          <span> {pageData.active}</span>
        </span>
      )
    }

    return (
      <span className="badge-status default">
        <span> {pageData.inactive}</span>
      </span>
    )
  }

  return <>{renderStatus()}</>
}
