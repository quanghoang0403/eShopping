import { LoadingOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Input, Pagination, Popover, Row, Table } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import {
  CalendarNewIcon,
  CloseFill,
  ExportIcon,
  FilterAltFillIcon,
  FilterOutlined,
  FolderIcon,
  SearchLightIcon,
  SortUpIcon,
} from "constants/icons.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { hasPermission } from "utils/helpers";
import "./fnb-table.scss";

export function FnbTable(props) {
  const [t] = useTranslation();
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
    exportExcel,
  } = props;

  const defaultScrollX = 900;
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const [visible, setVisible] = useState(false);

  const pageData = {
    noDataFound: t("table.noDataFound"),
    filterButtonTitle: t("button.filter"),
    selectedItems: t("messages.selectedItems"),
  };

  // register grabbing scroll table
  useEffect(() => {
    const tbody = document.querySelector(".ant-table-content");
    if (tbody) {
      let pos = { top: 0, left: 0, x: 0, y: 0 };
      const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        tbody.scrollTop = pos.top - dy;
        tbody.scrollLeft = pos.left - dx;
      };

      const mouseUpHandler = function () {
        tbody.removeEventListener("mousemove", mouseMoveHandler);
        tbody.removeEventListener("mouseup", mouseUpHandler);
        tbody.style.cursor = "grab";
        tbody.style.removeProperty("user-select");
      };

      const mouseDownHandler = function (e) {
        pos = {
          // The current scroll
          left: tbody.scrollLeft,
          top: tbody.scrollTop,
          // Get the current mouse position
          x: e.clientX,
          y: e.clientY,
        };

        if (!cursorGrabbing) {
          tbody.style.cursor = "grabbing";
        }
        tbody.style.userSelect = "none";
        tbody.addEventListener("mousemove", mouseMoveHandler);
        tbody.addEventListener("mouseup", mouseUpHandler);
      };

      tbody.addEventListener("mousedown", mouseDownHandler);
    }
  }, [dataSource]);

  useEffect(() => {
    const tbody = document.querySelector(".ant-table-body");
    if (onScroll && tbody) {
      tbody.addEventListener("scroll", onScroll);
    }

    return () => {
      if (tbody) {
        tbody.removeEventListener("scroll", onScroll);
      }
    };
  }, [onScroll]);

  const getTableColumns = () => {
    // If not define permission to edit or delete, return default column
    if (!editPermission || !deletePermission) {
      return columns;
    }

    // If user has permission to edit or delete, return default column
    if (hasPermission(editPermission) || hasPermission(deletePermission)) {
      return columns;
    } else {
      // If user has no permission to edit or delete, then remove action column
      return columns.filter((c) => c.key !== "action");
    }
  };

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const renderPagination = () => {
    const hasPagination = total > pageSize;
    const currentView = dataSource?.length;

    if (hasPagination) {
      let showingMessage = t("table.showingRecordMessage", {
        showingRecords: currentView,
        totalRecords: total,
      });
      if (footerMessage) {
        showingMessage = t(footerMessage, {
          showingRecords: currentView,
          totalRecords: total,
        });
      }
      return (
        <div className="fnb-tbl-pagination">
          <div className="info-pagination">
            <div className="table-text-footer" dangerouslySetInnerHTML={{ __html: showingMessage }}></div>
          </div>
          <div className="fnb-pagination">
            <Pagination current={currentPageNumber} total={total} defaultPageSize={pageSize} onChange={onChangePage} />
          </div>
        </div>
      );
    }
  };

  const formatMessage = (selectedRowKeys) => {
    let mess = t(pageData.selectedItems, { selectedRowKeys: selectedRowKeys });
    return mess;
  };

  const renderSelectRows = () => {
    if (rowSelection && !hideTableRowSelection) {
      const { selectedRowKeys } = rowSelection;
      return (
        <FnbSelectSingle
          className="selected-row-control"
          placeholder={formatMessage(`${selectedRowKeys?.length ?? 0}`)}
          disabled
        />
      );
    }

    return <></>;
  };

  const renderSearch = () => {
    if (search) {
      const { placeholder, onChange, maxLength } = search;
      return (
        <>
          <div className="search-bar">
            <Input
              autoFocus={autoFocus}
              maxLength={maxLength ?? 100}
              onChange={(e) => onChange(encodeURIComponent(e.target.value))}
              className="fnb-search-input w-100"
              allowClear
              size="large"
              placeholder={placeholder}
              prefix={<SearchLightIcon />}
            />
          </div>
        </>
      );
    }

    return <></>;
  };

  const renderSortButton = () => {
    if (sort) {
      const { buttonTitle, onClick } = sort;
      return (
        <Button className="action-button" type="primary" icon={<SortUpIcon />} onClick={onClick}>
          <span className="button-title">{buttonTitle}</span>
        </Button>
      );
    }

    return <></>;
  };

  const renderCalendarButton = () => {
    if (calendarFilter) {
      const { buttonTitle, onClick } = calendarFilter;
      return (
        <Button
          className="action-button action-button-calendar"
          type="primary"
          icon={<CalendarNewIcon />}
          onClick={onClick}
        >
          <span className="button-title-calendar">{buttonTitle}</span>
        </Button>
      );
    }

    return <></>;
  };

  const renderFilterButton = () => {
    if (filterComponent) {
      return <>{filterComponent}</>;
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
        showPopover,
      } = filter;
      const numberTotalFilterSelected = parseInt(totalFilterSelected) || 0;
      const btnTitle = buttonTitle ? buttonTitle : pageData.filterButtonTitle;
      return (
        <>
          <Popover
            placement="bottomRight"
            content={component}
            trigger="click"
            open={showPopover || visible}
            onOpenChange={handleVisibleChange}
            getPopupContainer={(trigger) => trigger.parentElement}
            overlayClassName={`filter-component ${filterClassName ?? ""}`}
          >
            <Button
              className="action-button"
              type="primary"
              icon={
                <Badge className="badge-counter" size="small" count={numberTotalFilterSelected} color="#FF8C24">
                  <FilterOutlined className={numberTotalFilterSelected > 0 ? "filter-count" : "filter-empty"} />
                </Badge>
              }
              onClick={(e) => onClickFilterButton(e)}
            >
              <span className="button-title">{btnTitle}</span>

              {allowClear === false || !totalFilterSelected || numberTotalFilterSelected <= 0 || (
                <CloseFill
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onClearFilter) onClearFilter(e);
                  }}
                />
              )}
            </Button>
          </Popover>
        </>
      );
    }
    return <></>;
  };

  const renderTableControlAction = () => {
    return (
      <div className="desktop-mode">
        <div className="search-group">
          {rowSelection && <div>{renderSelectRows()}</div>}
          <div className="search-bar">{renderSearch()}</div>
        </div>
        <div className="action-group">
          {renderExportExcel()}
          {renderFilterButton()}
          {renderSortButton()}
          {renderCalendarButton()}
          {renderCalendarFilterButton()}
        </div>
      </div>
    );
  };

  const renderCalendarFilterButton = () => {
    if (calendarComponent) {
      const { selectedDate, onSelectedDatePicker, onConditionCompare } = calendarComponent;
      return (
        <div className="action-button action-button-calendar-component">
          <FnbDatePicker
            selectedDate={selectedDate}
            setSelectedDate={(date, typeOptionDate) => onSelectedDatePicker(date, typeOptionDate)}
            setConditionCompare={onConditionCompare}
          />
        </div>
      );
    }

    return <></>;
  };

  const renderExportExcel = () => {
    if (exportExcel) {
      const { buttonTitle, onClick } = exportExcel;
      return (
        <Button className="action-button action-button-export" type="primary" icon={<ExportIcon />} onClick={onClick}>
          <span className="button-title">{buttonTitle}</span>
        </Button>
      );
    }

    return <></>;
  };

  return (
    <>
      <div className="fnb-table-wrapper hide-pagination-options">
        {renderTableControlAction()}
        <Row>
          <Col span={24}>
            <Table
              showSorterTooltip={false}
              loading={{
                spinning: loading || loading === true,
                indicator: <LoadingOutlined />,
              }}
              locale={{
                emptyText: (
                  <>
                    <p className="text-center" style={{ marginBottom: "12px", marginTop: "105px" }}>
                      <FolderIcon />
                    </p>
                    <p className="text-center body-2" style={{ marginBottom: "181px", color: "#858585" }}>
                      {emptyText ?? pageData.noDataFound}
                    </p>
                  </>
                ),
              }}
              scroll={{ x: scrollX ?? defaultScrollX, y: scrollY }}
              className={`fnb-table form-table ${className}`}
              columns={getTableColumns()}
              dataSource={dataSource}
              rowSelection={rowSelection}
              pagination={false}
              bordered={bordered}
              id={tableId}
              expandable={expandable}
              rowKey={rowKey ?? "index"}
              summary={summary}
            />
            {renderPagination()}
          </Col>
        </Row>
      </div>
    </>
  );
}
