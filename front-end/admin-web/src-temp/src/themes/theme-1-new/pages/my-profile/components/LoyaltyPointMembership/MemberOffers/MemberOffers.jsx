import React from "react";
import TabsCustomize from "../../../../../components/TabsCustomize/TabsCustomize";
import "./MemberOffers.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function MemberOffers(props) {
  const { customerMembershipLevel = [], customerRankId } = props;
  const [activeKey, setActiveKey] = useState(() => customerRankId);
  const [t] = useTranslation();
  const translateData = {
    memberOffers: t("loyaltyPoint.memberOffers"),
  };
  const renderTextDescription = (description) => {
    return (
      <div
        className="membership-description"
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>
    );
  };

  return (
    <div className="member-offers-theme1">
      <div className="member-offers-text">{translateData.memberOffers}</div>
      <TabsCustomize
        defaultActiveKey={activeKey}
        activeKey={activeKey}
        items={customerMembershipLevel?.map((membership) => ({
          key: membership?.id,
          label: membership?.name,
          children: membership?.description ? (
            renderTextDescription(membership?.description)
          ) : (
            <></>
          ),
        }))}
        onChange={(activeKey) => setActiveKey(activeKey)}
      />
    </div>
  );
}

export default MemberOffers;
