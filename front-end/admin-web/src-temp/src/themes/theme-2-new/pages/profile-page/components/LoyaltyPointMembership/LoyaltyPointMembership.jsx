import { Col, Row, Typography } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import customerDataService from "../../../../../data-services/customer-data.service";
import { formatDate, formatTextNumber, roundNumber } from "../../../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import {
  ArrowLeftMemberOffer,
  ArrowRightIcon,
  FoodPackageIcon,
  MoneyBagIcon,
  PremiumIcon,
  PremiumQuanlityDefault,
  PremiumQuanlityIcon,
} from "../../../../assets/icons.constants";
import { maximumTotalAmountSpent } from "../../../../constants/string.constant";
import "./LoyaltyPointMembership.scss";
import PointHistory from "./PointHistory/PointHistory";

function LoyaltyPointMembership(props) {
  const { handleOnClickBack, navigateToOrderDetail } = props;
  const [isShowMemberOffers, setIsShowMemberOffers] = useState(true);
  const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
  const [loyaltyPointInfo, setLoyaltyPointInfo] = useState({});
  const [customerMembershipLevel, setCustomerMembershipLevel] = useState([]);
  const [isActiveLoyaltyPoint, setIsActiveLoyaltyPoint] = useState(false);
  const isMobileDevice = useMediaQuery({ maxWidth: 575 });
  const [isShowExpiredDate, setIsShowExpiredDate] = useState(false);

  const [t] = useTranslation();
  const pageData = {
    loyaltyPointDetail: t("loyaltyPoint.loyaltyPointDetail", "Thành viên thân thiết"),
    availablePoints: t("loyaltyPoint.availablePoints", "Điểm khả dụng"),
    totalOrders: t("loyaltyPoint.totalOrders", "Tổng đơn đã mua"),
    memberOffers: t("loyaltyPoint.memberOffers", "Ưu đãi thành viên"),
    totalAmountSpent: t("loyaltyPoint.totalAmountSpent", "Tổng tiền đã chi"),
    pointsWillExpire: t("loyaltyPoint.pointsWillExpire"),
  };
  const header = document.querySelector(".page-container-header-theme2");
  const headerDelivery = document.querySelector(".delivery-address-selector-theme2");
  const headerHeight = header?.offsetHeight + headerDelivery?.offsetHeight;

  useEffect(() => {
    (async () => {
      try {
        if (!customerInfo?.accountId) return;
        const response = await customerDataService.getCustomerLoyaltyPointAsync(
          customerInfo?.accountId,
          customerInfo?.storeId,
        );
        setIsActiveLoyaltyPoint(response?.data?.isActivated);
        if (response?.data?.customerLoyaltyPoint) {
          setLoyaltyPointInfo(response?.data?.customerLoyaltyPoint);
          setIsShowExpiredDate(formatDate(loyaltyPointInfo?.expireDate) >= formatDate(moment()));
        }
      } catch {
        return;
      }
    })();
  }, [customerInfo?.accountId, customerInfo?.storeId]);

  useEffect(() => {
    if (!customerInfo?.storeId) return;
    (async () => {
      try {
        const response = await customerDataService.getCustomerMembershipLevel(customerInfo?.storeId);
        response?.data?.customerMemberShipLevel && setCustomerMembershipLevel(response?.data?.customerMemberShipLevel);
      } catch {
        return;
      }
    })();
  }, [customerInfo?.storeId]);

  return (
    <div className="loyalty-point-member-ship-theme2">
      {isShowMemberOffers ? (
        <>
          <Row className="header" style={{ top: headerHeight }}>
            <Col className="header-left">
              {isMobileDevice && (
                <Link to="/my-profile/1">
                  <ArrowLeftMemberOffer onClick={handleOnClickBack && handleOnClickBack} />
                </Link>
              )}
              <Typography.Text className="member-text">{pageData.loyaltyPointDetail}</Typography.Text>
            </Col>
            <Col className="header-right">
              <div className="premium-icon">
                <PremiumQuanlityIcon />
              </div>
              <div className="member-priority-text">{pageData.memberOffers}</div>
              <div>
                <ArrowRightIcon onClick={() => setIsShowMemberOffers(false)} style={{ cursor: "pointer" }} />
              </div>
            </Col>
          </Row>
          <Row className="container">
            <Col className="avaiable-point">
              <Col>
                <PremiumIcon className="premium-icon" />
              </Col>
              <Col className="avaiable-point-left">
                <Row className="text">{pageData.availablePoints}</Row>
                <Row className="score">{formatTextNumber(loyaltyPointInfo?.availablePoint)}</Row>
              </Col>
            </Col>
            {isActiveLoyaltyPoint && isMobileDevice && isShowExpiredDate ? (
              <>
                <Col className="exprie-date">
                  <span className="score">{formatTextNumber(roundNumber(loyaltyPointInfo?.availablePoint))}</span>
                  {pageData.pointsWillExpire} {formatDate(loyaltyPointInfo?.expireDate)}
                </Col>
              </>
            ) : null}
            <Col className="money">
              <Row className="total-money-text">
                <Col className="icon">
                  <FoodPackageIcon />
                </Col>
                <Col className="purchase-order">{pageData.totalOrders}</Col>
                <Col className="currency">{loyaltyPointInfo?.totalOrder}</Col>
              </Row>
              <Row className="money-number">
                <Col className="icon">
                  <MoneyBagIcon />
                </Col>
                <Col className="total-amount-spent">{pageData.totalAmountSpent}</Col>
                <Col className="currency">
                  {formatTextNumber(
                    roundNumber(
                      loyaltyPointInfo?.totalAmountOrders >= maximumTotalAmountSpent
                        ? maximumTotalAmountSpent
                        : loyaltyPointInfo?.totalAmountOrders,
                    ),
                  )}
                  đ
                </Col>
              </Row>
            </Col>
            {isActiveLoyaltyPoint && !isMobileDevice && isShowExpiredDate ? (
              <>
                <Col className="exprie-date">
                  <span className="score">{formatTextNumber(roundNumber(loyaltyPointInfo?.availablePoint))}</span>
                  {pageData.pointsWillExpire}
                  {formatDate(loyaltyPointInfo?.expireDate)}
                </Col>
              </>
            ) : null}
          </Row>
          <Row className="history-point">
            <PointHistory navigateToOrderDetail={navigateToOrderDetail} />
          </Row>
        </>
      ) : (
        <>
          <Row className="header-menmber-text">
            <Col>
              <ArrowLeftMemberOffer onClick={() => setIsShowMemberOffers(true)} style={{ cursor: "pointer" }} />
            </Col>
            <Col className="header-left">
              <Typography.Text className="member-text">{pageData.memberOffers}</Typography.Text>
            </Col>
          </Row>
          <Row className="member-content">
            {customerMembershipLevel?.map((customer, idx) => (
              <Row className="member-ship-level" key={idx}>
                <Col className="thumbnail">
                  {customer?.thumbnail ? (
                    <div className="thumbnail-rank">
                      <ImageUploading dataURLKey="data_url">
                        {() => {
                          return (
                            <>
                              <img className="thumbnail-url-rank" src={customer?.thumbnail} alt="profile" />
                            </>
                          );
                        }}
                      </ImageUploading>
                    </div>
                  ) : (
                    <PremiumQuanlityDefault />
                  )}
                </Col>
                <Col className="text">
                  <div className="rank">{customer?.name}</div>
                  {customer?.description ? (
                    <div
                      className="description"
                      dangerouslySetInnerHTML={{
                        __html: customer?.description,
                      }}
                    ></div>
                  ) : null}
                </Col>
              </Row>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}

export default memo(LoyaltyPointMembership);
