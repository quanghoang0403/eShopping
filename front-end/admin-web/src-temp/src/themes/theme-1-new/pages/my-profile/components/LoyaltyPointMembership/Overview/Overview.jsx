import moment from "moment";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import {
  formatDate,
  formatTextNumber,
  roundNumber,
} from "../../../../../../utils/helpers";
import { OverviewRankIcon } from "../../../../../assets/icons.constants";
import { maximumTotalAmountSpent } from "../../../../../constants/string.constants";
import "./Overview.scss";


function Overview(props) {
  const { loyaltyPoint = {} } = props;
  const [t] = useTranslation();
  const nextExpireDate = ((loyaltyPoint?.expireDate) && moment(loyaltyPoint?.expireDate) <= moment())
                          ? moment(loyaltyPoint?.expireDate).add(1,'y')
                          : loyaltyPoint?.expireDate;
  const translateData = {
    points: t("loyaltyPoint.points"),
    earn: t("loyaltyPoint.earn"),
    toGetRank: t("loyaltyPoint.toGetRank", {
      nextRank: loyaltyPoint?.rankNext,
    }),
    overview: t("loyaltyPoint.overview"),
    availablePoints: t("loyaltyPoint.availablePoints"),
    totalOrders: t("loyaltyPoint.totalOrders"),
    totalAmountSpent: t("loyaltyPoint.totalAmountSpent"),
    pointsWillExpire: t("loyaltyPoint.pointsWillExpire"),
  };
  useEffect(() => {
    const slider = document.querySelector(".fnb-gdas-range");
    if (!slider) return;
    const min = slider.min;
    const max = slider.max;
    const value = slider.value;
    slider.style.background = `linear-gradient(to right, #539149 0%, #8fc288 ${
      ((value - min) / (max - min)) * 100
    }%, #ccc ${((value - min) / (max - min)) * 100}%, #ccc 100%)`;
  }, [loyaltyPoint]);

  const statisticsPoint = [
    {
      name: translateData.availablePoints,
      value: formatTextNumber(roundNumber(loyaltyPoint?.availablePoint)),
    },
    {
      name: translateData.totalOrders,
      value: formatTextNumber(roundNumber(loyaltyPoint?.totalOrder)),
    },
    {
      name: translateData.totalAmountSpent,
      value: formatTextNumber(
        roundNumber(
          loyaltyPoint?.totalAmountOrders >= maximumTotalAmountSpent
            ? maximumTotalAmountSpent
            : loyaltyPoint?.totalAmountOrders
        )
      ),
    },
  ];

  return (
    <div className="overview-theme1">
      <div className="overview-header-text">{translateData.overview}</div>
      <div className="overview-point">
        <div className="earn-point">
          <div className="rank">
            <div className="icon">
              {loyaltyPoint?.thumbnail ? (
                <ImageUploading dataURLKey="data_url">
                  {() => {
                    return (
                      <>
                        <img
                          className="thumbnail-url-rank"
                          src={loyaltyPoint?.thumbnail}
                          alt="rank"
                        />
                      </>
                    );
                  }}
                </ImageUploading>
              ) : (
                <OverviewRankIcon />
              )}
            </div>
            <div className="range-slider">
              <div className="rank-text">{loyaltyPoint?.name}</div>
              <div className="slider">
                <input
                  type="range"
                  name="fnb-gdas-range"
                  class="fnb-gdas-range"
                  min={0}
                  max={loyaltyPoint?.accumulatedPointNext}
                  value={loyaltyPoint?.customerAccumulatedPoint}
                />
              </div>
            </div>
          </div>
          <div className="point">
            {translateData.earn}
            <span className="score">
              {formatTextNumber(
                loyaltyPoint?.accumulatedPointNext >
                  loyaltyPoint?.customerAccumulatedPoint
                  ? loyaltyPoint?.accumulatedPointNext -
                      loyaltyPoint?.customerAccumulatedPoint
                  : 0
              )}
              {` ${translateData.points}`}
            </span>
            {translateData.toGetRank}
          </div>
        </div>
        <div className="statistics-point-theme1">
          <div className="statistics-point">
            {statisticsPoint.map((item, idx) => (
              <div key={idx} className="statistics">
                <div className="statistics-name"> {item?.name} </div>
                <div className="point"> {item?.value} </div>
              </div>
            ))}
          </div>
          {loyaltyPoint?.expireDate ? (
            <div className="expired-points">
              <span className="score">
                {formatTextNumber(roundNumber(loyaltyPoint?.availablePoint))}
              </span>
              {translateData.pointsWillExpire}
              {formatDate(nextExpireDate)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Overview;
