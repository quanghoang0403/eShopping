import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import customerDataService from "../../../../../../data-services/customer-data.service";
import { DateFormat } from "../../../../../constants/string.constants";
import { useDebounce } from "../../../../../hooks";
import "./PointHistory.scss";
import PointHistoryFilter from "./PointHistoryFilter/PointHistoryFilter";
import PointHistoryList from "./PointHistoryList/PointHistoryList";

function PointHistory() {
  const [t] = useTranslation();
  const translateData = {
    pointHistory: t("loyaltyPoint.pointHistory"),
  };
  const [pointHistoryList, setPointHistoryList] = useState([]);
  const [keySearchOrderId, setKeySearchOrderId] = useState("");
  const [keySearchDebounce, setKeySearchDebounce] = useState("");
  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
    enumPointHistoryFilterSortType: 1,
    enumPointHistoryFilterType: 1,
    pageNumber: 1,
    pageSize: 20,
  });
  const [countFilter, setCountFilter] = useState(0);

  const getDataPointHistoryServices = async (params) => {
    if (!params) return;
    try {
      const response = await customerDataService.getPointHistoryByFilter(params);
      setPointHistoryList(response?.data?.pointHistoryByCustomer ?? response?.pointHistoryByCustomer);
    } catch (error) {}
  };

  useDebounce(
    () => {
      setKeySearchDebounce(keySearchOrderId);
    },
    [keySearchOrderId],
    500,
  );

  useEffect(() => {
    getDataPointHistoryServices({
      ...searchParams,
      keySearch: keySearchDebounce,
    });
  }, [keySearchDebounce]);

  const handleOnSubmitFilter = async (params, form) => {
    if (!params) return;
    let formValue = form?.getFieldsValue();
    const newParams = {
      ...searchParams,
      ...params,
      startDate: params?.startDate
        ? moment(params?.startDate?.$d).startOf("day").format(DateFormat.YYYY_MM_DD_HH_MM_SS)
        : "",
      endDate: params?.endDate ? moment(params?.endDate?.$d).endOf("day").format(DateFormat.YYYY_MM_DD_HH_MM_SS) : "",
      keySearch: keySearchDebounce,
    };
    delete newParams?.fromTo;
    getDataPointHistoryServices(newParams);
    setCountFilter(countFilterControl(formValue));
    setSearchParams(newParams);
  };

  const handleChangeKeySearch = (keySearch) => {
    setKeySearchOrderId(keySearch);
  };

  const countFilterControl = (formValue) => {
    let countFilterType =
      formValue?.enumPointHistoryFilterType === 1 || formValue?.enumPointHistoryFilterType === undefined ? 0 : 1;
    let countSortType =
      formValue?.enumPointHistoryFilterSortType === 1 || formValue?.enumPointHistoryFilterSortType === undefined
        ? 0
        : 1;

    let countDateType = formValue?.fromTo === 1 || formValue?.fromTo === undefined ? 0 : 1;

    return countFilterType + countSortType + countDateType;
  };

  return (
    <div className="point-history-theme1">
      <div className="point-history-title">{translateData.pointHistory}</div>
      <div className="point-history-filter">
        <PointHistoryFilter
          handleOnSubmitFilter={handleOnSubmitFilter}
          handleChangeKeySearch={handleChangeKeySearch}
          countFilter={countFilter}
        />
      </div>
      <div className="point-history-list">
        <PointHistoryList pointHistoryList={pointHistoryList} />
      </div>
    </div>
  );
}

export default PointHistory;
