import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeConfigSelector } from "../../../modules/session/session.reducers";
import Index from "../../index";
import "./ReserveTablePage.style.scss";
import ReserveTableWrapper from "./components/ReserveTableWrapper";
export default function ReserveTablePage(props) {
  const isAllowReserveTable = useSelector(storeConfigSelector)?.isAllowReserveTable;
  const history = useHistory();
  const isCustomize = props?.isCustomize;

  useEffect(() => {
    if (!isCustomize && !isAllowReserveTable) {
      history.push("/");
    }
  }, [isAllowReserveTable]);
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return <ReserveTableWrapper {...props} />;
      }}
    />
  );
}
