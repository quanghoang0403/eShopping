import { useEffect, useState } from "react";
import branchDataService from "../../../data-services/branch-data.services";
import { CloseBranchComponent } from "../../components/close-branch/close-branch.component";
import {EnumDayOfWeek, EnumNextTimeOpenType} from "../../constants/enums";

export function CloseBranchContainer(props) {
  const { branchId } = props;

  const [openTime, setOpenTime] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);

  useEffect(() => {
    handleCheckWorkingHour();
  }, [branchId]);

  const handleCheckWorkingHour = async () => {
    const workingHour = await branchDataService.getWorkingHourByBranchIdAsync(branchId ?? null);
    const workingHourResult = workingHour?.data;
    if (workingHour?.data?.isClosed === true) {
      setOpenTime(workingHourResult?.workingHour?.openTime);
      if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[1].key) {
        setDayOfWeek(EnumNextTimeOpenType[workingHourResult?.workingHour?.nextTimeOpen - 1].name);
      } else if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[2].key) {
        setDayOfWeek(EnumDayOfWeek[workingHourResult?.workingHour?.dayOfWeek].name);
      }
    } else {
      setOpenTime(null);
    }
  };

  return openTime !== null && <CloseBranchComponent openTime={openTime} dayOfWeek={dayOfWeek} />;
}
