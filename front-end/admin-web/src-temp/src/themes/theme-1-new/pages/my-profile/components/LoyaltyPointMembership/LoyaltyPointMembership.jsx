import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { ArrowLeftIcon } from "../../../../assets/icons.constants";
import "./LoyaltyPointMembership.scss";
import Overview from "./Overview/Overview";
import MemberOffers from "./MemberOffers/MemberOffers";
import PointHistory from "./PointHistory/PointHistory";
import customerDataService from "../../../../../data-services/customer-data.service";
import {
  getStorage,
  localStorageKeys,
} from "../../../../../utils/localStorage.helpers";
import { memo } from "react";

function LoyaltyPointMembership(props) {
  const isMobile = useMediaQuery({ maxWidth: 740 });
  const [t] = useTranslation();
  const { handleClickTitle, isActiveLoyaltyPoint, loyaltyPoint} = props;
  const translateData = {
    loyaltyPointDetail: t("loyaltyPoint.loyaltyPointDetail"),
    notFindLoyaltyPoint: t("loyaltyPoint.notFindLoyaltyPoint"),
  };
  const [customerMembershipLevel, setCustomerMembershipLevel] = useState([]);
  const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));

  useEffect(() => {
    if (!customerInfo?.storeId) return;
    (async () => {
      const response = await customerDataService.getCustomerMembershipLevel(
        customerInfo?.storeId
      );
      response?.data?.customerMemberShipLevel &&
        setCustomerMembershipLevel(response?.data?.customerMemberShipLevel);
    })();
  }, [customerInfo?.storeId]);

  return (
    <div className="loyalty-point-theme1">
      <div className="loyalty-point-header">
        {isMobile ? (
          <a onClick={() => handleClickTitle()} className="arrow-left-title">
            <ArrowLeftIcon /> {translateData.loyaltyPointDetail}
          </a>
        ) : (
          <h3 className="loyalty-point-title">
            {translateData.loyaltyPointDetail}
          </h3>
        )}
      </div>
      {!isActiveLoyaltyPoint || !customerInfo?.accountId ? (
        <div className="loyalty-point-not-found">
          {translateData.notFindLoyaltyPoint}
        </div>
      ) : (
        <div className="container" style={{ paddingLeft: 80 }}>
          <div className="loyalty-point-overview">
            <Overview loyaltyPoint={loyaltyPoint} />
          </div>
          <div className="loyalty-point-member-offers">
            <MemberOffers
              customerMembershipLevel={customerMembershipLevel}
              customerRankId={customerInfo?.customerRankId}
            />
          </div>
          <div className="loyalty-point-point-history">
            <PointHistory />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(LoyaltyPointMembership);
