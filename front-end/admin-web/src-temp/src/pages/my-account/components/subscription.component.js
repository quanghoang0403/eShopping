import BillingComponent from "pages/billing/components/billing.component";
import React from "react";
import PackageTable from "./package-table.component";
import "./subscription.component.scss";
import { ArrowMenuCustomizeIcon } from "../../../constants/icons.constants";

export const SubscriptionComponent = (props) => {
  const { userInformation, openPackageDetail = false } = props;
  const [showListPackage, setShowListPackage] = React.useState(!openPackageDetail);

  return (
    <>
      {showListPackage ? (
        <PackageTable showBillingComponent={() => setShowListPackage(false)} />
      ) : (
        <div className="account-subscription">
          <div onClick={() => setShowListPackage(true)}>
            <ArrowMenuCustomizeIcon />
          </div>
          <BillingComponent userInfo={userInformation} />
        </div>
      )}
    </>
  );
};
