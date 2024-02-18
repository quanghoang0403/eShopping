import { Button, Col, Form, Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import areaDataService from "../../../../data-services/area-data.service";
import branchDataService from "../../../../data-services/branch-data.services";
import reserveTableService from "../../../../data-services/reserve-table-data.service";
import { store } from "../../../../modules";
import { setToastMessageAddUpdateProductToCart } from "../../../../modules/toast-message/toast-message.actions";
import { getStoreConfig } from "../../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../../utils/localStorage.helpers";
import NotificationDialog from "../../../components/notification-dialog/notification-dialog.component";
import { theme1ElementCustomize } from "../../../constants/store-web-page.constants";
import { DateFormat } from "../../../constants/string.constants";
import { areasDefault } from "../default-data";
import ReserveTableContentLeft from "./ReserveTableContentLeft";
import ReserveTableContentRight from "./ReserveTableContentRight";
import { StyledReserveTable } from "./StyledReserveTable";

function ReserveTableContent(props) {
  const { config, general, isCustomize, clickToFocusCustomize } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const translateData = {
    okay: t("form.okay"),
    notification: t("loginPage.notification"),
    reserveTableSuccessfully: t("reserve.reserveTableSuccessfully"),
    reserveTableFailed: t("reserve.reserveTableFailed"),
    pleaseSelectTable: t("reserve.pleaseSelectTable"),
  };
  const [formRef] = Form.useForm();
  const storeConfig = getStoreConfig();
  const [reserveTime, setReserveTime] = useState();
  const [reserveDate, setReserveDate] = useState(new Date());
  const [reserveTableData, setReserveTableData] = useState(null);
  const [tableSelected, setTableSelected] = useState(null);
  const [areaSelected, setAreaSelected] = useState(null);
  const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
  const [selectTimeByDeliveryDay, setSelectTimeByDeliveryDay] = useState(null);
  const [branchesByCustomerAddress, setBranchesByCustomerAddress] = useState(null);

  const [branchAddressId, setBranchAddressId] = useState(
    useSelector((state) => state?.session?.deliveryAddress?.branchAddress?.id),
  );
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);

  const [isShowDialog, setIsShowDialog] = useState();
  const [contentNotification, setContentNotification] = useState();
  const colorGroupColor = general?.color?.colorGroups?.find((c) => c.id === config?.reservation?.colorGroupId);
  const colorGroup = colorGroupColor
    ? colorGroupColor
    : general?.color?.colorGroups[0]
    ? general?.color?.colorGroups[0]
    : {};
  const gutterRow = isCustomize ? [48, 24] : [24, 24];

  const getNearestStoreBranches = async (deliveryAddress, isNotSelectCustomerAddress) => {
    const lat = deliveryAddress?.receiverAddress?.lat ?? 0;
    const lng = deliveryAddress?.receiverAddress?.lng ?? 0;
    const res = await branchDataService.getBranchesByCustomerAddressAsync(lat, lng, isNotSelectCustomerAddress);
    if (res) {
      const { branchesByCustomerAddress } = res?.data || {};
      setBranchesByCustomerAddress(branchesByCustomerAddress);
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

  const getInitData = async (branchId) => {
    const res = await areaDataService.getDetailAreaAndTableAsync(branchId);
    if (res) {
      setReserveTableData(res?.data?.areas);
    }
  };

  function formatDateTime(reserveDate, reserveTime) {
    const inputString = moment(reserveDate).format(DateFormat.YYYY_MM_DD_2) + " " + reserveTime;
    const inputDate = moment(inputString, DateFormat.YYYY_MM_DD_HH_MM);
    return inputDate.format(DateFormat.YYYY_MM_DDTHH_mm_ss_SSSZ);
  }

  function adjustDateTimeIfNeeded(values) {
    //const formattedDateTime = moment().add(30, "minutes").format(DateFormat.YYYY_MM_DDTHH_mm_ss_SSSZ);
    const formattedDateTime = moment().format(DateFormat.YYYY_MM_DDTHH_mm_ss_SSSZ);
    if (formattedDateTime > values.time) {
      const currentTime = moment();
      // Donot get next time but need save this logic -> comment
      //const currentTime = moment().add(30, "minutes");
      // const targetTime = moment(reserveTime, DateFormat.HH_MM).add(30, "minutes");

      // const nextTime = selectTimeByDeliveryDay.find((item) => {
      //   const itemTime = moment(item.time, DateFormat.HH_MM);
      //   return itemTime.isAfter(currentTime) && itemTime.isSameOrAfter(targetTime);
      // });

      // if (nextTime) {
      //   const inputString2 = moment(reserveDate).format(DateFormat.YYYY_MM_DD_2) + " " + nextTime.time;
      //   const inputDate2 = moment(inputString2, DateFormat.YYYY_MM_DD_HH_MM);
      //   values.time = inputDate2.format(DateFormat.YYYY_MM_DDTHH_mm_ss_SSSZ);
      // }

      const inputString2 = moment(reserveDate).format(DateFormat.YYYY_MM_DD_2) + " " + currentTime.format("HH:mm");
      const inputDate2 = moment(inputString2, DateFormat.YYYY_MM_DD_HH_MM);
      values.time = inputDate2.format(DateFormat.YYYY_MM_DDTHH_mm_ss_SSSZ);
    }
  }

  function onSubmitReserveForm() {
    formRef.validateFields().then((values) => {
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

  const checkIsLoggedIn = () => {
    let isLoggedIn = false;
    if (customerInfo) isLoggedIn = true;
    return isLoggedIn;
  };

  const createReserveTable = async (dataCreate) => {
    const res = await reserveTableService.createReserveTableAsync(dataCreate);
    if (res) {
      if (res.data?.isSuccess === true) {
        setContentNotification(translateData.reserveTableSuccessfully);
        const isLoggedIn = checkIsLoggedIn();

        //Show toast message reserve table success
        store.dispatch(
          setToastMessageAddUpdateProductToCart({
            icon: null,
            message: translateData.reserveTableSuccessfully,
          }),
        );
        setTimeout(() => {
          if (res.data?.id) {
            history.push(`/my-profile/6/${res.data?.id}`);
          } else {
            history.push("/my-profile/6");
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

  const onChangeBranch = (branchId) => {
    getInitData(branchId);
    setBranchAddressId(branchId);
  };

  const handleConfirmNotify = () => {
    setIsShowDialog(false);
  };

  return (
    <div
      id="themeReservationReservation"
      onClick={() => {
        if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.ReservationReservation);
      }}
    >
      <div className="reserve-table-content-wrapper">
        <StyledReserveTable isCustomize={isCustomize} colorGroup={colorGroup} config={config}>
          <Row
            gutter={gutterRow}
            className={`reserve-table-content ${isCustomize ? "reserve-table-content-customize" : ""}`}
          >
            <Col span={24} md={24} lg={16} xl={16} xxl={16}>
              <ReserveTableContentLeft
                colorGroup={colorGroup}
                deliveryAddress={deliveryAddress}
                branchesByCustomerAddress={branchesByCustomerAddress}
                tableSelected={tableSelected}
                setTableSelected={setTableSelected}
                areaSelected={areaSelected}
                setAreaSelected={setAreaSelected}
                reserveTableData={isCustomize ? areasDefault : reserveTableData}
                setReserveTableData={setReserveTableData}
                form={formRef}
                onChangeBranch={onChangeBranch}
              />
            </Col>{" "}
            {!isCustomize && (
              <Col span={0} xs={0} sm={0} md={0} lg={1} xl={1} xxl={1}>
                <div className="reserve-table-middle-content"></div>
              </Col>
            )}
            <Col span={24} md={24} lg={7} xl={7} xxl={7}>
              <ReserveTableContentRight
                form={formRef}
                deliveryAddress={deliveryAddress}
                branchesByCustomerAddress={branchesByCustomerAddress}
                onSubmitReserveForm={onSubmitReserveForm}
                setReserveTime={setReserveTime}
                reserveTime={reserveTime}
                reserveDate={reserveDate}
                setReserveDate={setReserveDate}
                onChangeBranch={onChangeBranch}
                branchAddressId={branchAddressId ?? null}
                colorGroup={colorGroup}
                selectTimeByDeliveryDay={selectTimeByDeliveryDay}
                setSelectTimeByDeliveryDay={setSelectTimeByDeliveryDay}
              />
            </Col>
          </Row>
          <NotificationDialog
            open={isShowDialog}
            title={translateData.notification}
            content={contentNotification}
            className="checkout-theme1-notify-dialog"
            footer={[<Button onClick={handleConfirmNotify}>{translateData.okay}</Button>]}
            closable={true}
          />
        </StyledReserveTable>
      </div>
    </div>
  );
}

export default ReserveTableContent;
