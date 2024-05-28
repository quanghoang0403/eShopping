import { Button, Popover, Radio, Row, Tooltip } from 'antd'
import { CalendarIcon, DownIcon } from 'constants/icons.constants'
import { OptionDateTime } from 'constants/option-date.constants'
import { DateFormat } from 'constants/string.constants'
import moment from 'moment'
import { useEffect, useState } from 'react'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { DateRange } from '../shop-date-range-picker'
import { useTranslation } from 'react-i18next'
import './shop-data-picker.scss'

export function FnbDatePicker (props) {
  const { t } = useTranslation()
  const pageData = {
    optionDateTime: {
      today: t('report.today'),
      yesterday: t('report.yesterday'),
      thisWeek: t('report.thisWeek'),
      lastWeek: t('report.lastWeek'),
      thisMonth: t('report.thisMonth'),
      lastMonth: t('report.lastMonth'),
      thisYear: t('report.thisYear'),
      lastYear: t('report.lastYear'),
      customize: t('report.customize'),
      allTime: t('report.allTime'),
      to: t('report.to')
    },
    cancel: t('button.cancel'),
    apply: t('button.apply')
  }
  const {
    selectedDate,
    setSelectedDate,
    setConditionCompare,
    orderTypeFilterTime,
    blurEffect = false,
    containAllTime = false,
    className,
    popoverPlacement,
    isShowTime = true,
    customeStyle = {}
  } = props
  const [visible, setVisible] = useState(false)
  const [isOpenTooltip, setIsOpenTooltip] = useState(false)
  const [activeOptionDate, setActiveOptionDate] = useState(orderTypeFilterTime ?? 0)
  const [allTime, setAllTime] = useState(false)
  const [selectedDateText, setSelectedDateText] = useState([])
  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  useEffect(() => {
    setSelectedDateText(selectedDate)
    if (orderTypeFilterTime !== OptionDateTime.allTime) {
      const selectedDateInit = {
        startDate: new Date(selectedDate?.startDate),
        endDate: new Date(selectedDate?.endDate),
        key: 'selection'
      }
      setSelectionRange([selectedDateInit])
      return
    }
    const selectedDateInit = {
      startDate: '',
      endDate: '',
      key: 'selection'
    }
    setAllTime(true)
    setActiveOptionDate(OptionDateTime.allTime)
    setSelectionRange([selectedDateInit])
    onSetDatetime([selectedDateInit], OptionDateTime.allTime)
  }, [orderTypeFilterTime, selectedDate])

  const radioOptionDate = () => {
    const startToday = moment().startOf('date').toDate()
    const endToday = moment().endOf('date').toDate()

    const startYesterday = moment().startOf('date').toDate()
    startYesterday.setDate(startYesterday.getDate() - 1)
    const endYesterday = moment().endOf('date').toDate()
    endYesterday.setDate(endYesterday.getDate() - 1)

    const startThisWeek = moment().locale('vi').startOf('week').toDate()
    startThisWeek.setDate(startThisWeek.getDate())
    const endThisWeek = moment().locale('vi').endOf('week').toDate()
    endThisWeek.setDate(endThisWeek.getDate())

    const startLastWeek = moment().locale('vi').startOf('week').toDate()
    startLastWeek.setDate(startLastWeek.getDate() - 7)
    const endLastWeek = moment().locale('vi').endOf('week').toDate()
    endLastWeek.setDate(endLastWeek.getDate() - 7)

    const startThisMonth = moment().startOf('month').toDate()
    const endThisMonth = moment().endOf('month').toDate()

    const startLastMonth = moment().startOf('month').subtract(1, 'month').toDate()
    const endLastMonth = moment().subtract(1, 'month').endOf('month').toDate()

    const startThisYear = moment().startOf('year').toDate()
    const endThisYear = moment().endOf('year').toDate()

    const listOptionDateTime = [
      {
        key: 0,
        name: pageData.optionDateTime.today,
        disabled: false,
        startDate: startToday,
        endDate: endToday
      },
      {
        key: 1,
        name: pageData.optionDateTime.yesterday,
        disabled: false,
        startDate: startYesterday,
        endDate: endYesterday
      },
      {
        key: 2,
        name: pageData.optionDateTime.thisWeek,
        disabled: false,
        startDate: startThisWeek,
        endDate: endThisWeek
      },
      {
        key: 3,
        name: pageData.optionDateTime.lastWeek,
        disabled: false,
        startDate: startLastWeek,
        endDate: endLastWeek
      },
      {
        key: 4,
        name: pageData.optionDateTime.thisMonth,
        disabled: false,
        startDate: startThisMonth,
        endDate: endThisMonth
      },
      {
        key: 5,
        name: pageData.optionDateTime.lastMonth,
        disabled: false,
        startDate: startLastMonth,
        endDate: endLastMonth
      },
      {
        key: 6,
        name: pageData.optionDateTime.thisYear,
        disabled: false,
        startDate: startThisYear,
        endDate: endThisYear
      },
      {
        key: 7,
        name: pageData.optionDateTime.customize,
        disabled: true,
        startDate: startToday,
        endDate: endToday
      }
    ]

    const allTime = {
      key: 8,
      name: pageData.optionDateTime.allTime,
      startDate: '',
      endDate: ''
    }

    if (containAllTime) {
      listOptionDateTime.push(allTime)
    }

    return listOptionDateTime
  }

  const onClickToday = (e) => {
    const optionChecked = e.target.value
    const optionDate = radioOptionDate()
    const selectedOption = optionDate.find((item) => item.key === optionChecked)

    const selectedDate = {
      startDate: selectedOption.startDate,
      endDate: selectedOption.endDate,
      key: 'selection'
    }

    const typeOptionDate = selectedOption.key
    typeOptionDate === OptionDateTime.allTime ? setAllTime(true) : setAllTime(false)
    setActiveOptionDate(typeOptionDate)
    setSelectionRange([selectedDate])
    onSetDatetime([selectedDate], typeOptionDate)
  }

  const onChangeDateRange = (item) => {
    setSelectionRange([item.selection])

    const selectedDate = {
      startDate: item.selection.startDate,
      endDate: item.selection.endDate
    }

    setSelectedDateText(selectedDate)
    const optionDate = radioOptionDate()
    const selectedOption = optionDate.find(
      (item) =>
        item?.key !== OptionDateTime.allTime &&
        item?.startDate === selectedDate?.startDate &&
        item?.endDate === selectedDate?.endDate
    )

    let optionKey = OptionDateTime.customize

    if (selectedOption) {
      optionKey = selectedOption.key
    }

    switch (optionKey) {
      case OptionDateTime.today:
        setActiveOptionDate(OptionDateTime.today)
        break
      case OptionDateTime.yesterday:
        setActiveOptionDate(OptionDateTime.yesterday)
        break
      case OptionDateTime.thisWeek:
        setActiveOptionDate(OptionDateTime.thisWeek)
        break
      case OptionDateTime.lastWeek:
        setActiveOptionDate(OptionDateTime.lastWeek)
        break
      case OptionDateTime.thisMonth:
        setActiveOptionDate(OptionDateTime.thisMonth)
        break
      case OptionDateTime.lastMonth:
        setActiveOptionDate(OptionDateTime.lastMonth)
        break
      case OptionDateTime.thisYear:
        setActiveOptionDate(OptionDateTime.thisYear)
        break
      case OptionDateTime.allTime:
        setActiveOptionDate(OptionDateTime.allTime)
        break
      default:
        setActiveOptionDate(OptionDateTime.customize)
        setAllTime(false)
        break
    }
  }

  const onSetDatetime = (startEndDate, typeOptionDate) => {
    const date = {
      startDate: startEndDate[0]?.startDate,
      endDate: startEndDate[0]?.endDate
    }
    setSelectedDate(date, typeOptionDate)
    if (setConditionCompare !== undefined) {
      setConditionCompare(typeOptionDate)
    }
    setVisible(false)
  }

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible)
  }

  const getDatetime = () => {
    switch (activeOptionDate) {
      case OptionDateTime.today:
        return pageData.optionDateTime.today
      case OptionDateTime.yesterday:
        return pageData.optionDateTime.yesterday
      case OptionDateTime.thisWeek:
        return pageData.optionDateTime.thisWeek
      case OptionDateTime.lastWeek:
        return pageData.optionDateTime.lastWeek
      case OptionDateTime.thisMonth:
        return pageData.optionDateTime.thisMonth
      case OptionDateTime.lastMonth:
        return pageData.optionDateTime.lastMonth
      case OptionDateTime.thisYear:
        return pageData.optionDateTime.thisYear
      case OptionDateTime.allTime:
        return pageData.optionDateTime.allTime
      default:
        var formatDate = isShowTime ? DateFormat.DD_MM_YYYY_HH_MM_SS_ : DateFormat.DD_MM_YYYY
        var startDateFormat = moment(selectedDateText?.startDate)?.format(formatDate)
        var endDateFormat = moment(selectedDateText?.endDate)?.add(1, 'd')?.seconds(-1)?.format(formatDate)
        return `${startDateFormat} - ${endDateFormat}`
    }
  }

  const displayTooltipTitle = () => {
    const { startDate, endDate } = selectionRange?.[0]
    if (startDate && endDate) {
      const fromDate = moment(startDate).format('DD/MM/YYYY')
      const toDate = moment(endDate).format('DD/MM/YYYY')
      return (
        <>
          {fromDate} ~ {toDate}
        </>
      )
    }
    return <></>
  }

  const content = () => {
    return (
      <div>
        <div className="shop-form-picker">
          <Row className="shop-form-option-date">
            <Radio.Group value={activeOptionDate} onChange={onClickToday}>
              {radioOptionDate().map((item) => {
                return (
                  <Radio.Button
                    key={item.key}
                    disabled={item?.disabled}
                    value={item.key}
                    className={`shop-btn-date ${item?.disabled && 'shop-btn-date-disable'}`}
                  >
                    {item.name}
                  </Radio.Button>
                )
              })}
            </Radio.Group>
          </Row>
          <Row className="shop-form-picker">
            <Row>
              <DateRange
                moveRangeOnFirstSelection={false}
                ranges={selectionRange}
                onChange={(item) => onChangeDateRange(item)}
                months={2}
                direction="horizontal"
                showMonthAndYearPickers={true}
                visible={visible}
              />
            </Row>
          </Row>
        </div>
        <Row className="shop-footer">
          <div className="shop-footer-div">
            {!allTime && (
              <>
                {selectionRange[0]?.startDate === selectionRange[0]?.endDate
                  ? (
                    <p className="shop-text-date">{moment(selectionRange[0]?.startDate)?.format(DateFormat.DD_MM_YYYY)}</p>
                  )
                  : (
                    <Row className="shop-date-to-date-wrapper">
                      <span className="shop-text-start-date">
                        {moment(selectionRange[0]?.startDate)?.format(DateFormat.DD_MM_YYYY)}
                      </span>
                      <span className="shop-text-to-date">{pageData.optionDateTime.to}</span>
                      <span className="shop-text-end-date">
                        {moment(selectionRange[0]?.endDate)?.format(DateFormat.DD_MM_YYYY)}
                      </span>
                    </Row>
                  )}
              </>
            )}
          </div>
          <div className="shop-form-btn">
            <Button className="shop-btn-cancel" onClick={() => onClickCancel()}>
              {pageData.cancel}
            </Button>
            <Button className="shop-btn-apply" onClick={() => onSetDatetime(selectionRange, activeOptionDate)}>
              {pageData.apply}
            </Button>
          </div>
        </Row>
      </div>
    )
  }

  const onClickCancel = () => {
    switch (activeOptionDate) {
      case OptionDateTime.customize:
        const optionDate = radioOptionDate()
        const selectedOption = optionDate.find((item) => item.key === OptionDateTime.today)
        const selectedDate = {
          startDate: selectedOption.startDate,
          endDate: selectedOption.endDate,
          key: 'selection'
        }
        const typeOptionDate = selectedOption.key
        setActiveOptionDate(typeOptionDate)
        if (setConditionCompare !== undefined) {
          setConditionCompare(OptionDateTime.today)
        }
        setSelectionRange([selectedDate])
        onSetDatetime([selectedDate], typeOptionDate)
        break
      default:
        break
    }
    setVisible(false)
  }

  const onMouseEnter = () => {
    if (getDatetime() === pageData.optionDateTime.allTime) {
      setIsOpenTooltip(false)
    } else {
      setIsOpenTooltip(true)
    }
  }

  return (
    <Popover
      placement={popoverPlacement ?? 'bottom'}
      open={visible}
      overlayClassName="shop-popver-picker"
      onOpenChange={handleVisibleChange}
      content={content}
      trigger="click"
    >
      <Tooltip open={!visible && isOpenTooltip} placement="bottomRight" title={displayTooltipTitle}>
        <Button
          className={`btn-date-picker ${className} ${blurEffect && 'input-blur-effect'}`}
          onMouseEnter={onMouseEnter}
          style={customeStyle}
          onMouseLeave={() => setIsOpenTooltip(false)}
        >
          <div className="shop-btn-div-icon-calendar">
            <CalendarIcon />
          </div>
          <div className="shop-div-text-date-time">
            <p className="shop-text-date-time">{getDatetime()}</p>
          </div>
          <div className="shop-div-down">
            <DownIcon className="shop-icon-down" />
          </div>
        </Button>
      </Tooltip>
    </Popover>
  )
}
