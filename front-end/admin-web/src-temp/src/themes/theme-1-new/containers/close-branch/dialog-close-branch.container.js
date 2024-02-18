import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { qrCodeBranchIdSelector } from "../../../modules/order/order.reducers";
import { workingHourSelector } from "../../../modules/session/session.reducers";
import workingHourService from "../../../services/working-hour-by-branch.services";
import ConfirmationDialog from "../../components/confirmation-dialog/confirmation-dialog.component";
import { EnumDayOfWeek, EnumNextTimeOpenType } from "../../constants/enums";

export default function DialogCloseBranchContainer(props) {
  const [t] = useTranslation();
  const { callback, onClose } = props;
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [timeWorkingHour, setTimeWorkingHour] = useState(null);
  const [isVisibleDialog, setIsVisibleDialog] = useState(false);

  const branchId = useSelector(qrCodeBranchIdSelector);
  const reduxWorkingHour = useSelector(workingHourSelector);

  const translateData = {
    youDontHaveAnyItemsInYourCart: t(
      "shoppingCart.youDontHaveAnyItemsInYourCart",
      "You don't have any items in your cart",
    ),
    updateCartItemToastMessage: t("updateCartItemToastMessage", "Món ăn đã được cập nhật thành công"),
    notification: t("storeWebPage.generalUse.notification"),
    soSorryNotificationWorkingHour: t(
      "storeBranch.soSorryNotificationWorkingHour",
      "Rất xin lỗi! Hiện tại không phải thời gian làm việc của cửa hàng. Vui lòng quay lại vào lúc <strong>{{timeWorkingHour}} {{dayOfWeek}}</strong>",
    ),
    iGotIt: t("loginPage.iGotIt", "I got it"),
  };

  useEffect(() => {
    if (branchId) {
      // TODO: fetch data by branchId
      workingHourService.fetchStoreBranchWorkingHoursAsync(branchId);
    }
  }, [branchId]);

  useEffect(() => {
    if (reduxWorkingHour) {
      handleCheckWorkingHour(reduxWorkingHour);
    }
  }, [reduxWorkingHour]);

  function handleOnClickIGotIt() {
    setIsVisibleDialog(false);
    onClose(false);
  }

  const handleCheckWorkingHour = (reduxWorkingHour) => {
    if (reduxWorkingHour?.isClosed === true) {
      setTimeWorkingHour(reduxWorkingHour?.workingHour?.openTime);
      const nextTimeOpen = reduxWorkingHour?.workingHour?.nextTimeOpen;
      if (nextTimeOpen === EnumNextTimeOpenType[1].key) {
        setDayOfWeek(EnumNextTimeOpenType[nextTimeOpen - 1].name);
      } else if (nextTimeOpen === EnumNextTimeOpenType[2].key) {
        setDayOfWeek(EnumDayOfWeek[reduxWorkingHour?.workingHour?.dayOfWeek].name);
      }
      setIsVisibleDialog(true);
    } else {
      if (branchId === reduxWorkingHour?.branchId) {
        callback && callback();
      }
      setIsVisibleDialog(false);
    }
  };

  return (
    <>
      <ConfirmationDialog
        open={isVisibleDialog}
        title={translateData.notification}
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: t(translateData.soSorryNotificationWorkingHour, {
                timeWorkingHour: timeWorkingHour,
                dayOfWeek: t(dayOfWeek),
              }),
            }}
          ></span>
        }
        footer={[
          <Button className="btn-got-it" onClick={handleOnClickIGotIt}>
            {translateData.iGotIt}
          </Button>,
        ]}
        className="notification-time-out-working-hours"
        closable={false}
        maskClosable={true}
      />
    </>
  );
}
