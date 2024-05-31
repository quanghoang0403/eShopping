import { LoadingOutlined } from '@ant-design/icons'
import { Badge, Button, Col, Input, Pagination, Popover, Row, Table, Modal } from 'antd'
import { FnbDatePicker } from 'components/shop-date-picker/shop-data-picker'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import {
  CalendarNewIcon,
  CloseFill,
  FilterOutlined,
  FolderIcon,
  SearchLightIcon,
  SortUpIcon
} from 'constants/icons.constants'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { hasPermission } from 'utils/helpers'
import './shop-table.scss'
import { useTranslation } from 'react-i18next'

export function ShopTable(props) {
  const {
    columns, // define columns
    dataSource, // define dataSource
    currentPageNumber, // number of current page
    pageSize, // number of record per page
    total, // total number of record
    onChangePage,
    hideTableRowSelection,
    rowSelection,
    className,
    editPermission,
    deletePermission,
    tableId,
    bordered,
    search,
    filter,
    filterComponent,
    sort,
    scrollX,
    scrollY,
    summary,
    footerMessage,
    calendarFilter,
    loading,
    calendarComponent,
    onScroll,
    expandable,
    rowKey,
    emptyText,
    autoFocus,
    cursorGrabbing,
    onRow,
    component
  } = props
  const { t } = useTranslation()
  const defaultScrollX = 900
  const [visible, setVisible] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 576 })

  const pageData = {
    noDataFound: t('table.noDataFound'),
    selectedItems: t('table.selectedItems'),
    filterButton: t('button.filter')
  }

  // register grabbing scroll table
  useEffect(() => {
    const elements = document.querySelectorAll('.ant-table-content')
    if (elements?.length > 0) {
      let pos = { top: 0, left: 0, x: 0, y: 0 }
      elements?.forEach((item) => {
        const mouseMoveHandler = function (e) {
          // How far the mouse has been moved
          const dx = e.clientX - pos.x
          const dy = e.clientY - pos.y

          // Scroll the element
          item.scrollTop = pos.top - dy
          item.scrollLeft = pos.left - dx
        }

        const mouseUpHandler = function (e) {
          item.removeEventListener('mousemove', mouseMoveHandler)
          item.removeEventListener('mouseup', mouseUpHandler)
          item.style.cursor = 'grab'
          item.style.removeProperty('user-select')
        }

        const mouseDownHandler = function (e) {
          pos = {
            // The current scroll
            left: item.scrollLeft,
            top: item.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY
          }

          if (!cursorGrabbing) {
            item.style.cursor = 'grabbing'
          }
          item.style.userSelect = 'none'
          item.addEventListener('mousemove', mouseMoveHandler)
          item.addEventListener('mouseup', mouseUpHandler)
        }
        item.removeEventListener('mousedown', mouseDownHandler)
        item.addEventListener('mousedown', mouseDownHandler)
      })
    }
  }, [dataSource])

  useEffect(() => {
    const elements = document.querySelectorAll('.ant-table-content')

    if (onScroll && elements?.length > 0) {
      elements?.forEach((item) => {
        item.addEventListener('scroll', onScroll)
      })
    }

    return () => {
      if (elements?.length > 0) {
        elements?.forEach((item) => {
          item.removeEventListener('scroll', onScroll)
        })
      }
    }
  }, [onScroll])

  const getTableColumns = () => {
    // If not define permission to edit or delete, return default column
    if (!editPermission || !deletePermission) {
      return columns
    }

    // If user has permission to edit or delete, return default column
    if (hasPermission(editPermission) || hasPermission(deletePermission)) {
      return columns
    } else {
      // If user has no permission to edit or delete, then remove action column
      return columns.filter((c) => c.key !== 'action')
    }
  }

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible)
  }

  const renderPagination = () => {
    const hasPagination = total > pageSize
    const currentView = dataSource?.length

    if (hasPagination) {
      let showingMessage = t('table.showingRecordMessage', {
        showingRecords: currentView,
        totalRecords: total
      })
      if (footerMessage) {
        showingMessage = t(footerMessage, {
          showingRecords: currentView,
          totalRecords: total
        })
      }
      return (
        <div className="shop-tbl-pagination">
          <div className="info-pagination">
            <div className="table-text-footer" dangerouslySetInnerHTML={{ __html: showingMessage }}></div>
          </div>
          <div className="shop-pagination">
            <Pagination current={currentPageNumber ?? 1} total={total} defaultPageSize={pageSize} onChange={onChangePage} />
          </div>
        </div>
      )
    }
  }

  const formatMessage = (selectedRowKeys) => {
    const mess = t(pageData.selectedItems, { selectedRowKeys })
    return mess
  }

  const renderSelectRows = () => {
    if (rowSelection && !hideTableRowSelection) {
      const { selectedRowKeys } = rowSelection
      return (
        <FnbSelectSingle
          className="selected-row-control"
          placeholder={formatMessage(`${selectedRowKeys?.length ?? 0}`)}
          disabled
        />
      )
    }

    return <></>
  }

  const renderSearch = () => {
    if (search) {
      const { placeholder, onChange, maxLength, valueSearch } = search
      return (
        <>
          {valueSearch && <div className="search-bar">
            <Input
              value={valueSearch}
              autoFocus={autoFocus}
              maxLength={maxLength ?? 100}
              onChange={(e) => onChange(encodeURIComponent(e.target.value))}
              className="shop-search-input w-100"
              allowClear
              size="large"
              placeholder={placeholder}
              prefix={<SearchLightIcon />}
            />
          </div>}
          {!valueSearch && <div className="search-bar">
            <Input
              autoFocus={autoFocus}
              maxLength={maxLength ?? 100}
              onChange={(e) => onChange(encodeURIComponent(e.target.value))}
              className="shop-search-input w-100"
              allowClear
              size="large"
              placeholder={placeholder}
              prefix={<SearchLightIcon />}
            /></div>}
        </>
      )
    }

    return <></>
  }

  const renderSortButton = () => {
    if (sort) {
      const { buttonTitle, onClick } = sort
      return (
        <Button className="action-button" type="primary" icon={<SortUpIcon />} onClick={onClick}>
          <span className="button-title">{buttonTitle}</span>
        </Button>
      )
    }

    return <></>
  }

  const renderCalendarButton = () => {
    if (calendarFilter) {
      const { buttonTitle, onClick } = calendarFilter
      return (
        <Button
          className="action-button action-button-calendar"
          type="primary"
          icon={<CalendarNewIcon />}
          onClick={onClick}
        >
          <span className="button-title-calendar">{buttonTitle}</span>
        </Button>
      )
    }

    return <></>
  }

  const renderFilterButton = () => {
    if (filterComponent) {
      return <>{filterComponent}</>
    }
    if (filter) {
      const {
        buttonTitle,
        component,
        allowClear,
        onClearFilter,
        totalFilterSelected,
        onClickFilterButton,
        filterClassName,
        isShowModelOnMoblie,
        showPopover
      } = filter
      const numberTotalFilterSelected = parseInt(totalFilterSelected) || 0
      const btnTitle = buttonTitle || pageData.filterButton
      return (
        <>
          {isMobile && isShowModelOnMoblie
            ? (
              <>
                <Button
                  className="action-button"
                  type="primary"
                  icon={
                    <Badge className="badge-counter" size="small" count={numberTotalFilterSelected} color="#FF8C24">
                      <FilterOutlined className={numberTotalFilterSelected > 0 ? 'filter-count' : 'filter-empty'} />
                    </Badge>
                  }
                  onClick={(e) => onClickFilterButton(e)}
                >
                  <span className="button-title">{btnTitle}</span>

                  {allowClear === false || !totalFilterSelected || numberTotalFilterSelected <= 0 || (
                    <CloseFill
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (onClearFilter) onClearFilter(e)
                      }}
                    />
                  )}
                </Button>
                <Modal
                  className="modal-filter-mobile"
                  open={showPopover}
                  footer={(null, null)}
                  maskClosable={true}
                  closable={false}
                  onCancel={(e) => onClickFilterButton(e)}
                  centered
                >
                  {component}
                </Modal>
              </>
            )
            : (
              <Popover
                placement="bottomRight"
                content={component}
                trigger="click"
                open={visible}
                onOpenChange={handleVisibleChange}
                getPopupContainer={(trigger) => trigger.parentElement}
                overlayClassName={`filter-component ${filterClassName ?? ''}`}
              >
                <Button
                  className="action-button"
                  type="primary"
                  icon={
                    <Badge className="badge-counter" size="small" count={numberTotalFilterSelected} color="#FF8C24">
                      <FilterOutlined className={numberTotalFilterSelected > 0 ? 'filter-count' : 'filter-empty'} />
                    </Badge>
                  }
                  onClick={(e) => onClickFilterButton(e)}
                >
                  <span className="button-title">{btnTitle}</span>

                  {allowClear === false || !totalFilterSelected || numberTotalFilterSelected <= 0 || (
                    <CloseFill
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (onClearFilter) {
                          setVisible(false)
                          onClearFilter(e)
                        }
                      }}
                    />
                  )}
                </Button>
              </Popover>
            )}
        </>
      )
    }
    return <></>
  }

  const renderTableControlAction = () => {
    return (
      <div className="desktop-mode">
        <div className="search-group">
          {rowSelection && <div>{renderSelectRows()}</div>}
          <div className="search-bar">{renderSearch()}</div>
        </div>
        <div className="action-group">
          {renderFilterButton()}
          {renderSortButton()}
          {renderCalendarButton()}
          {renderCalendarFilterButton()}
        </div>
      </div>
    )
  }

  const renderCalendarFilterButton = () => {
    if (calendarComponent) {
      const { selectedDate, orderTypeFilterTime, onSelectedDatePicker, onConditionCompare } = calendarComponent
      return (
        <div className="action-button action-button-calendar-component">
          <FnbDatePicker
            selectedDate={selectedDate}
            orderTypeFilterTime={orderTypeFilterTime}
            setSelectedDate={(date, typeOptionDate) => onSelectedDatePicker(date, typeOptionDate)}
            setConditionCompare={onConditionCompare}
          />
        </div>
      )
    }

    return <></>
  }

  return (
    <>
      <div className="shop-table-wrapper hide-pagination-options">
        {renderTableControlAction()}
        <Row>
          <Col span={24}>
            <Table
              showSorterTooltip={false}
              loading={{
                spinning: loading || loading === true,
                indicator: <LoadingOutlined />
              }}
              locale={{
                emptyText: (
                  <>
                    <p className="text-center" style={{ marginBottom: '12px', marginTop: '105px' }}>
                      <FolderIcon />
                    </p>
                    <p className="text-center body-2" style={{ marginBottom: '181px', color: '#858585' }}>
                      {emptyText ?? pageData.noDataFound}
                    </p>
                  </>
                )
              }}
              scroll={{ x: scrollX ?? defaultScrollX, y: scrollY }}
              className={`shop-table form-table ${className}`}
              columns={getTableColumns()}
              dataSource={dataSource}
              rowSelection={rowSelection}
              pagination={false}
              bordered={bordered}
              id={tableId}
              expandable={expandable}
              rowKey={rowKey ?? 'index'}
              summary={summary}
              onRow={onRow}
              component={component}
            />
            {renderPagination()}
          </Col>
        </Row>
      </div>
    </>
  )
}
