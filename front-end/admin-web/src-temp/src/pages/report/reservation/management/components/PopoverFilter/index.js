import { Col } from "antd";
import MultipleSelect from "../MultipleSelect";
import { Container, Form, Label, ResetFilter } from "./styled";
import GroupButton from "../GroupButton";
import { useLayoutEffect, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { areaOptionSelector, areasSelector, branchOptionSelector, getAllBranchManagement, getAreasAreaTablesByBranchId } from "store/modules/common/common.reducers";
import { useTranslation } from "react-i18next";
import { ReservationStatus } from "constants/reservation-constant";
import { reserveTableSelector } from "store/modules/reservation/reservation.reducers";
import { tableSettings } from "constants/default.constants";

const DEFAULT_CHECKED_ALL_VALUE = "CHECKED_ALL";

const PopoverFilter = forwardRef((props, ref) => {
  const { totalFilterSelected, onChange } = props;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const branchOption = useSelector(branchOptionSelector);
  const areaOption = useSelector(areaOptionSelector);
  const areas = useSelector(areasSelector);
  const { reserveTableParams } = useSelector(reserveTableSelector);
  const [areaTableOptions, setAreaTableOptions] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedAreaTable, setSelectedAreaTable] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([DEFAULT_CHECKED_ALL_VALUE]);
  
  const pageData = {
    branch: t("reservation.branch"),
    allBranches: t("reservation.allBranches"),
    area: t("reservation.area"),
    allAreas: t("reservation.allAreas"),
    table: t("reservation.table"),
    allTables: t("reservation.allTables"),
    status: t("reservation.status"),
    resetAllFilters: t("reservation.resetAllFilters"),
    waitToConfirm: t("reservation.waitToConfirm"),
    confirmed: t("reservation.confirmed"),
    serving: t("reservation.serving"),
    cancelled: t("reservation.cancelled"),
    completed: t("reservation.completed"),
  };

  const statusOptions = [
    {
      label: t(pageData.waitToConfirm),
      value: ReservationStatus.WaitToConfirm
    },
    {
      label: t(pageData.confirmed),
      value: ReservationStatus.Confirmed
    },
    {
      label: t(pageData.serving),
      value: ReservationStatus.Serving
    },
    {
      label: t(pageData.cancelled),
      value: ReservationStatus.Cancelled
    },
    {
      label: t(pageData.completed),
      value: ReservationStatus.Completed
    }
  ]

  useLayoutEffect(() => {
    dispatch(getAllBranchManagement());
    dispatch(getAreasAreaTablesByBranchId());
  }, []);

  useEffect(() => {
    if (areas) {
      handleCreateAreaTableOptions(reserveTableParams?.areaIds, areas);
    }
  }, [reserveTableParams?.areaIds, areas]);

  useImperativeHandle(ref, () => ({
    resetFilter() {
      handleResetFilter();
    }
  }));

  const handleChangeBranches = (branchIds) => {
    const {areaIds, areaTableIds, ...rest } = reserveTableParams;
    setSelectedBrand(branchIds);
    setSelectedArea([]);
    setSelectedAreaTable([]);
    onChange && onChange({
      ...rest,
      pageNumber: tableSettings.page,
      branchIds
    });
    dispatch(getAreasAreaTablesByBranchId({ branchIds }));
  }

  const handleChangeAreas = (areaIds) => {
    const { areaTableIds, ...rest } = reserveTableParams;
    setSelectedArea(areaIds);
    setSelectedAreaTable([]);
    onChange && onChange({
      ...rest,
      pageNumber: tableSettings.page,
      areaIds
    });
  }

  const handleChangeAreaTables = (areaTableIds) => {
    setSelectedAreaTable(areaTableIds);
    onChange && onChange({
      ...reserveTableParams,
      pageNumber: tableSettings.page,
      areaTableIds
    });
  }

  const handleChangeStatus = (statusIds) => {
    setSelectedStatus(statusIds);
    onChange && onChange({
      ...reserveTableParams,
      pageNumber: tableSettings.page,
      statusIds: statusIds?.filter((option) => option !== DEFAULT_CHECKED_ALL_VALUE),
    });
  }

  const handleResetFilter = () => {
    const { branchIds, areaIds, areaTableIds, statusIds, ...rest } = reserveTableParams;
    setSelectedBrand([]);
    setSelectedArea([]);
    setSelectedAreaTable([]);
    setSelectedStatus([DEFAULT_CHECKED_ALL_VALUE]);
    onChange && onChange({ ...rest, pageNumber: tableSettings.page });
  }

  const handleCreateAreaTableOptions = (areaIds, areaList) => {
    const areaTableOptions = [];
    if (areaIds && areaIds?.length > 0) {
      areaList
        ?.filter((area) => areaIds?.includes(area?.id) && area?.areaTables?.length > 0)
        ?.forEach((area) =>
          area?.areaTables?.forEach((areaTable) =>
            areaTableOptions?.push({ label: `${areaTable?.name} - ${area?.name}`, value: areaTable?.id }),
          ),
        );
    } else {
      areaList
        ?.filter((area) => area?.areaTables?.length > 0)
        ?.forEach((area) =>
          area?.areaTables?.forEach((areaTable) =>
            areaTableOptions?.push({ label: `${areaTable?.name} - ${area?.name}`, value: areaTable?.id }),
          ),
        );
    }
    setAreaTableOptions(areaTableOptions);
  }

  return (
    <Container>
      <Form gutter={[10, 32]}>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.branch}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <MultipleSelect
            options={branchOption}
            placeholder={pageData.allBranches}
            onChange={handleChangeBranches}
            value={selectedBrand}
          />
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.area}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <MultipleSelect
            options={areaOption}
            placeholder={pageData.allAreas}
            onChange={handleChangeAreas}
            value={selectedArea}
          />
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.table}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <MultipleSelect
            options={areaTableOptions}
            placeholder={pageData.allTables}
            onChange={handleChangeAreaTables}
            value={selectedAreaTable}
          />
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Label>{pageData.status}</Label>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <GroupButton
            options={statusOptions}
            onChange={handleChangeStatus}
            defaultCheckedAll={DEFAULT_CHECKED_ALL_VALUE}
            value={selectedStatus}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <ResetFilter disable={totalFilterSelected < 1}>
            <span onClick={handleResetFilter}>{pageData.resetAllFilters}</span>
          </ResetFilter>
        </Col>
      </Form>
    </Container>
  );
});

export default PopoverFilter;
