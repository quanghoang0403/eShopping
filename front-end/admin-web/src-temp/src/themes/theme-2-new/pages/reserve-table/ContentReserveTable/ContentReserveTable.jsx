import { Button, Form } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import branchDataService from "../../../../data-services/branch-data.services";
import { getStoreConfig } from "../../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../../utils/localStorage.helpers";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useAppCtx } from "../../../../providers/app.provider";
import NotificationDialog from "../../../components/notification-dialog/notification-dialog.component";
import { DateFormat } from "../../../constants/string.constant";
import { areasDefault, branchDefault } from "../default-data";
import areaDataService from "./../../../../data-services/area-data.service";
import reserveTableService from "./../../../../data-services/reserve-table-data.service";
import "./ContentReserveTable.scss";
import ReserveAreaModal from "./components/ReserveAreaModal/ReserveAreaModal";
import ReserveAreaTableModal from "./components/ReserveAreaTableModal/ReserveAreaTableModal";
import TableReserveFormComponent from "./components/TableReserveFormContent";

const ContentReserveTable = (props) => {
  const { config, isCustomize } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [value, setValue] = useState("");
  const [reserveTime, setReserveTime] = useState();
  const [reserveDate, setReserveDate] = useState(new Date());
  const [reserveTableData, setReserveTableData] = useState(null);
  const [note, setNote] = useState("");
  const [contentNotification, setContentNotification] = useState();
  const [isShowDialog, setIsShowDialog] = useState();
  const [branchesByCustomerAddress, setBranchesByCustomerAddress] = useState(null);
  const [areaSelected, setAreaSelected] = useState(null);
  const [tableSelected, setTableSelected] = useState(null);
  const [areaTableDetail, setAreaTableDetail] = useState(null);
  const [isVisibleArea, setIsVisibleArea] = useState(false);
  const [isVisibleAreaTable, setIsVisibleAreaTable] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const [branchAddressId, setBranchAddressId] = useState(
    useSelector((state) => state?.session?.deliveryAddress?.branchAddress?.id),
  );
  const branchAddressIdDefault = useSelector((state) => state?.session?.deliveryAddress?.branchAddress?.id);
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const storeConfig = getStoreConfig();
  const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
  const { Toast } = useAppCtx();

  const translateData = {
    okay: t("form.okay"),
    reserveTableSuccessfully: t("reserveTable.reserveTableSuccessfully"),
    pleaseSelectTable: t("reserveTable.pleaseSelectTable"),
    infoCustomer: t("reserveTable.infoCustomer", "Thông tin khách hàng"),
    branch: t("reserveTable.branch", "Chi nhánh"),
    time: t("reserveTable.time", "Thời gian đến"),
    name: t("reserveTable.name", "Họ tên"),
    phone: t("reserveTable.phone", "Số điện thoại"),
    email: t("reserveTable.email", "Email"),
    note: t("reserveTable.note", "Ghi chú"),
    numberOfGuest: t("reserveTable.numberOfGuest", "Số lượng khách"),
    enterGuest: t("reserveTable.enterGuest", "Vui lòng nhập số lượng khách"),
    enterTime: t("reserveTable.enterTime", "Vui lòng nhập thời gian đến"),
    enterBranch: t("reserveTable.enterBranch", "Vui lòng chọn chi nhánh"),
    enterPhone: t("reserveTable.enterPhone", "Vui lòng nhập số điện thoại đặt chỗ"),
    enterName: t("reserveTable.enterName", "Vui lòng nhập tên người đặt chỗ"),
    enterEmail: t("reserveTable.enterEmail", "Vui lòng nhập email người đặt chỗ"),
    returnToDeskMnagement: t("reserveTable.returnToDeskMnagement", "Quay lại quản lý bàn"),
    seats: t("reserveTable.seats", "Số chỗ"),
    notePlaceHolder: t(
      "reserveTable.notePlaceHolder",
      "Tôi cần ghế cho trẻ em. Nhà hàng cho chỗ đỗ xe không? Tôi có thể xem trước thực đơn không?",
    ),
    selectLocation: t("reserveTable.selectLocation", "Chọn vị trí"),
    seeMore: t("reserveTable.seeMore", "Xem thêm"),
    collapse: t("reserveTable.collapse", "Thu gọn"),
    locationSelected: t("reserveTable.locationSelected", "Vị trí bạn chọn"),
    selectTable: t("reserveTable.selectTable", "Chọn bàn"),
    unSelectTable: t("reserveTable.unSelectTable", "Bỏ chọn"),
    viewDetail: t("reserveTable.viewDetail", "Xem chi tiết"),
    noAreaContent: t("reserveTable.noAreaContent", "Oh uh! Không có tầng nào cả!!! Chúng tôi sẽ cập nhật sớm nhất!"),
    noTableContent: t(
      "reserveTable.noTableContent",
      "Oh uh! Không có bàn nào cả. Bạn vui lòng khám phá tầng khác nhé!",
    ),
    reserve: t("reserveTable.reserve", "Đặt bàn"),
    validatePhone: t("reserveTable.validatePhone", "Số điện thoại không hợp lệ"),
    iNeedTheChairForMyChildren: t("reserveTable.iNeedTheChairForMyChildren", "Tôi cần ghế cho trẻ em"),
    doesTheRestaurantHaveAParkingLot: t(
      "reserveTable.doesTheRestaurantHaveAParkingLot",
      "Nhà hàng cho chỗ đỗ xe không?",
    ),
    canISeeTheMenuInAdvance: t("reserveTable.canISeeTheMenuInAdvance", "Tôi có thể xem trước thực đơn không?"),
  };

  const getNearestStoreBranches = async (deliveryAddress, isNotSelectCustomerAddress) => {
    if (isCustomize) {
      setBranchesByCustomerAddress(branchDefault?.branchesByCustomerAddress);
      form.setFieldsValue({ branch: branchDefault?.branchesByCustomerAddress[0]?.branchId });
    } else {
      const lat = deliveryAddress?.receiverAddress?.lat ?? 0;
      const lng = deliveryAddress?.receiverAddress?.lng ?? 0;
      const res = await branchDataService.getBranchesByCustomerAddressAsync(lat, lng, isNotSelectCustomerAddress);
      if (res) {
        const { branchesByCustomerAddress } = res?.data || {};
        setBranchesByCustomerAddress(branchesByCustomerAddress);
        // Case not select branch or address
        if (isNotSelectCustomerAddress === true && branchesByCustomerAddress?.length > 0) {
          const { branchId } = branchesByCustomerAddress[0];
          form.setFieldsValue({ branch: branchId });
        }
      }
    }
  };

  useEffect(() => {
    let timeoutId;
    const callGetNearestStoreBranches = () => {
      if (deliveryAddress?.receiverAddress) {
        getNearestStoreBranches(deliveryAddress, false);
      } else {
        getNearestStoreBranches(deliveryAddress, true);
      }
    };
    timeoutId = setTimeout(() => {
      callGetNearestStoreBranches();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [deliveryAddress]);

  useEffect(() => {
    if (note) {
      form.setFieldsValue({ note: note });
    }
  }, [note]);

  useEffect(() => {
    if (isCustomize) {
      form.setFieldsValue({
        branch: branchDefault?.branchesByCustomerAddress[0]?.branchId,
      });
      getInitData(branchDefault?.branchesByCustomerAddress[0]?.branchId);
    } else if (deliveryAddress) {
      form.setFieldsValue({
        branch: deliveryAddress?.branchAddress?.id,
      });
      getInitData(deliveryAddress?.branchAddress?.id);
    }
  }, [branchesByCustomerAddress]);

  useEffect(() => {
    getInitReserveTableData();
  }, [reserveTableData]);

  const getInitReserveTableData = async () => {
    if (reserveTableData && reserveTableData.length > 0) {
      if (isCustomize) {
        setAreaSelected(areasDefault[0]);
      } else {
        setAreaSelected(reserveTableData[0]);
      }
    }
  };

  const onChangeBranch = (branchId) => {
    getInitData(branchId);
    setBranchAddressId(branchId);
    setAreaTableDetail(null);
    setTableSelected(null);
  };

  const getInitData = async (branchId) => {
    if (isCustomize) {
      setReserveTableData(areasDefault);
    } else {
      const res = await areaDataService.getDetailAreaAndTableAsync(branchId);
      if (res) {
        setReserveTableData(res?.data?.areas);
      }
    }
  };

  const handleSelectTable = (table) => {
    if (!tableSelected?.includes(table)) {
      if (tableSelected) {
        setTableSelected([...tableSelected, table]);
      } else {
        setTableSelected([table]);
      }
    } else if (tableSelected) {
      const filteredArray = tableSelected?.filter((item) => {
        return !(item.areaId === table.areaId && item.name === table.name);
      });
      setTableSelected(filteredArray);
    }
  };

  const handleSetDescriptionArea = (area, description) =>
    setAreaSelected({
      ...area,
      description: description,
    });

  const handleChangeArea = (area) => {
    setTableSelected(null);
    setAreaTableDetail(null);
    setAreaSelected(area);
  };

  function formatDateTime(reserveDate, reserveTime) {
    const inputString = moment(reserveDate).format(DateFormat.YYYY_MM_DD_2) + " " + reserveTime;
    const inputDate = moment(inputString, DateFormat.YYYY_MM_DD_HH_MM);
    return inputDate.format(DateFormat.YYYY_MM_DDTHH_mm_ss_SSSZ);
  }

  function adjustDateTimeIfNeeded(values) {
    const formattedDateTime = moment().format(DateFormat.YYYY_MM_DDTHH_mm_ss_SSSZ);
    if (formattedDateTime > values.time) {
      values.time = formattedDateTime;
    }
  }

  function onFinish() {
    if (!isCustomize) {
      form.validateFields().then((values) => {
        //Format and Set New Time If Needed - Reserve Table Time
        const formattedDateTime = formatDateTime(reserveDate, reserveTime);
        values.time = formattedDateTime;
        adjustDateTimeIfNeeded(values);

        const noteString = values?.note;
        const tableIds = tableSelected?.map((item) => item.id);

        if (tableIds?.length === 0 || !tableIds) {
          setContentNotification(translateData.pleaseSelectTable);
          setIsShowDialog(true);
        } else {
          const dataCreate = {
            storeId: storeConfig?.storeId,
            storeBranchId: values?.branch,
            customerName: values?.name,
            customerPhone: values?.phone,
            customerEmail: values?.email,
            numberOfSeats: values?.quantity,
            arrivalTime: values?.time,
            customerId: customerInfo?.customerId,
            note: noteString,
            listAreaTableId: tableIds,
          };
          createReserveTable(dataCreate);
        }
      });
    }
  }

  const createReserveTable = async (dataCreate) => {
    const res = await reserveTableService.createReserveTableAsync(dataCreate);
    if (res) {
      if (res.data?.isSuccess === true) {
        setContentNotification(translateData.reserveTableSuccessfully);
        const isLoggedIn = checkIsLoggedIn();

        //Show toast message reserve table success
        Toast.success({
          message: translateData.reserveTableSuccessfully,
          placement: "top",
        });
        setTimeout(() => {
          if (res.data?.id) {
            history.push({
              pathname: "/my-profile/5",
              state: {
                reservationId: res.data?.id,
              },
            });
          } else {
            history.push("/my-profile/5");
          }
        }, 1000);

        // Save code to local storage if not login
        if (res.data?.code && !isLoggedIn) {
          const code = res.data.code;
          const lstJsonReserveTableCodes = JSON.parse(getStorage(localStorageKeys.RESERVE));
          if (lstJsonReserveTableCodes?.listReserveTableCodes) {
            lstJsonReserveTableCodes.listReserveTableCodes.unshift(code);
            localStorage.setItem(localStorageKeys.RESERVE, JSON.stringify(lstJsonReserveTableCodes));
          } else {
            const obj = { listReserveTableCodes: [code] };
            localStorage.setItem(localStorageKeys.RESERVE, JSON.stringify(obj));
          }
        }
      } else {
        setContentNotification(translateData.reserveTableFailed);
        setIsShowDialog(true);
      }
    }
  };

  const checkIsLoggedIn = () => {
    let isLoggedIn = false;
    if (customerInfo) isLoggedIn = true;
    return isLoggedIn;
  };

  const handleConfirmNotify = () => {
    setIsShowDialog(false);
  };
  const colorGroupReservation = props?.general?.color?.colorGroups.find(
    (c) => c.id === props?.config?.reservation?.colorGroupId,
  );

  return (
    <div>
      <div className="content-reserve-table-container">
        <div className="content-reserve-table-container-section">
          <TableReserveFormComponent
            {...props}
            form={form}
            onFinish={onFinish}
            value={value}
            setValue={setValue}
            reserveTime={reserveTime}
            setReserveTime={setReserveTime}
            reserveDate={reserveDate}
            setReserveDate={setReserveDate}
            note={note}
            setNote={setNote}
            inputValue={inputValue}
            setInputValue={setInputValue}
            branchAddressId={branchAddressId ?? branchAddressIdDefault}
            branchesByCustomerAddress={branchesByCustomerAddress}
            onChangeBranch={onChangeBranch}
            colorGroupReservation={colorGroupReservation}
            reserveTableData={reserveTableData}
            areaSelected={areaSelected}
            handleChangeArea={handleChangeArea}
            tableSelected={tableSelected}
            setAreaTableDetail={setAreaTableDetail}
            setIsVisibleArea={setIsVisibleArea}
            setIsVisibleAreaTable={setIsVisibleAreaTable}
            setTableSelected={setTableSelected}
            translateData={translateData}
            areaTableDetail={areaTableDetail}
            handleSetDescriptionArea={handleSetDescriptionArea}
          />
        </div>
      </div>
      <ReserveAreaModal open={isVisibleArea} onCancel={() => setIsVisibleArea(false)} data={areaSelected} />
      <ReserveAreaTableModal
        open={isVisibleAreaTable}
        onCancel={() => setIsVisibleAreaTable(false)}
        data={areaTableDetail}
      />
      <NotificationDialog
        open={isShowDialog}
        title={translateData.notification}
        content={contentNotification}
        className="checkout-theme2-notify-dialog"
        footer={[<Button onClick={handleConfirmNotify}>{translateData.okay}</Button>]}
        closable={true}
      />
    </div>
  );
};

export default memo(ContentReserveTable);
