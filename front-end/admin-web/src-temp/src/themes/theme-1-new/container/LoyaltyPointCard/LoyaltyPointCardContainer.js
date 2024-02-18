import { useState, useEffect } from "react";
import LoyaltyPointCardComponent from "../../pages/my-profile/components/LoyaltyPointCard/LoyaltyPointCard";
import { LoyaltyPointCardDefaultData } from "../../pages/my-profile/components/LoyaltyPointCard/DefaultData";

export default function LoyaltyPointCardContainer(props) {
  const { customerInfo, isCustomize, loyaltyPoint, isActivated } = props;
  const [customerBarcode, setCustomerBarcode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    initData();
  }, [isActivated]);

  const initData = async () => {
    if (isCustomize) {
      setCustomerBarcode(LoyaltyPointCardDefaultData?.customerCode);
      setFirstName(LoyaltyPointCardDefaultData?.firstName);
      setLastName(LoyaltyPointCardDefaultData?.lastName);
    } else {
      if (isActivated) {
        setFirstName(customerInfo?.firstName);
        setLastName(customerInfo?.lastName);
        setCustomerBarcode(customerInfo?.customerBarcode);
      }
    }
  };

  return (
    (isActivated || isCustomize) && (
      <LoyaltyPointCardComponent
        customerBarcode={customerBarcode}
        loyaltyPoint={isCustomize ? LoyaltyPointCardDefaultData?.loyaltyPoint : loyaltyPoint}
        firstName={firstName}
        lastName={lastName}
        isCustomize={isCustomize}
      />
    )
  );
}
