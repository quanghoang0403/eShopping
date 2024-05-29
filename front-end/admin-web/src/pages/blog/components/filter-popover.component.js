import { Card, Col, Row } from 'antd'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './filter-popover.scss'

export const FilterBlogPopover = (props) => {
  const [t] = useTranslation()
  const { dataFilter, onChangeFilter } = props
  const { blogCategories, blogAuthors } = dataFilter

  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedAuthorId, setSelectedAuthorId] = useState('')
  const [filterData, setFilterData] = useState({})
  const defaultValue = ''

  // #region PageData
  const pageData = {
    filter: {
      buttonResetFilter: t('table.resetAllFilters'),
      all: t('table.allFilterTitle'),
      category: t('table.categoryFilterTitle'),
      creator: t('table.creatorFilterTitle')
    }
  }
  // #endregion

  const clearFilter = () => {
    setSelectedCategoryId(defaultValue)
    handleChangeFilterData({})
    setSelectedCategoryId('')
    setSelectedAuthorId('')
  }

  const handleChangeFilterData = (data) => {
    setFilterData(data)
    onChangeFilter && onChangeFilter(data)
  }

  return (
    <Card className="form-filter-popover blog-filter-card">
      {/* CATEGORY */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}><span>{ pageData.filter.category }</span></Col>
        <Col span={18}>
          <FnbSelectSingle className="form-select "
            showSearch
            onChange={(value) => {
              setSelectedCategoryId(value)
              handleChangeFilterData({ ...filterData, categoryId: value })
            }}
            value={selectedCategoryId}
            defaultValue={defaultValue}
            option={[{ id: '', name: pageData.filter.all }, ...blogCategories]}
          />
        </Col>
      </Row>

      {/* Author */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}><span>{ pageData.filter.creator }</span></Col>
        <Col span={18}>
          <FnbSelectSingle className="form-select "
            showSearch
            onChange={(value) => {
              setSelectedAuthorId(value)
              handleChangeFilterData({ ...filterData, creatorId: value })
            }}
            value={selectedAuthorId}
            defaultValue={defaultValue}
            option={[{ id: '', name: pageData.filter.all }, ...blogAuthors]}
          />
        </Col>
      </Row>

      {/* RESET BUTTON */}
      <Row className="row-reset-filter">
        <a onClick={() => clearFilter()} className="reset-filter" aria-current={Object.values(filterData).filter((e) => e !== '').length === 0 && 'inventory-history-filter'}>
          {pageData.filter.buttonResetFilter}
        </a>
      </Row>

    </Card>
  )
}
