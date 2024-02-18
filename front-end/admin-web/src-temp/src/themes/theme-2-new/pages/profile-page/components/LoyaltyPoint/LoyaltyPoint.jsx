import { useEffect } from "react";
import Barcode from "react-barcode";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import { PremiumIcon } from "../../../../assets/icons.constants";
import uploadProfileImg from "../../../../assets/images/upload-profile-img-loyalty.png";
import { TyporaphyEllipsis } from "../../../../components/TyporaphyEllipsis";
import { ImageSizeDefault } from "../../../../constants/string.constant";
import "./LoyaltyPoint.scss";
import { Button } from "antd";

function LoyaltyPoint(props) {
  const {
    uploadFile,
    customerInfo: {
      firstName = "",
      lastName = "",
      customerCode,
      rank = "Classic Member",
      customerBarcode = "123456789",
    },
    loyaltyPointInfo: {
      availablePoint = 0,
      rankNext = "Gold",
      customerAccumulatedPoint = 1,
      thumbnail = "",
      accumulatedPointNext = 10,
    },
    isCustomize,
  } = props;

  const [t] = useTranslation();
  const formatNumberWithCommas = (number) => {
    if (isNaN(number) || number === null) {
      return "0";
    }
    return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "";
  };
  const translateData = {
    points: t("loyaltyPoint.points", {
      points: formatNumberWithCommas(availablePoint),
    }),
    youNeedMore: t("loyaltyPoint.youNeedMore"),
    toGetRank: t("loyaltyPoint.toGetRank", { nextRank: rankNext }),
  };

  const isPointAndMembership = !!customerAccumulatedPoint && !!rank;
  const isNotPointAndMembership = !customerAccumulatedPoint && !!rank;
  const isPointAndNotMembership = !!customerAccumulatedPoint && !rank;
  const isMaximumAccumulatedPoint = customerAccumulatedPoint / accumulatedPointNext >= 0.8;
  const isMinimumAccumulatedPoint = customerAccumulatedPoint / accumulatedPointNext <= 0.3;

  useEffect(() => {
    const slider = document.querySelector(".fnb-range-slider");
    if (!slider) return;
    const min = slider.min;
    const max = slider.max ? slider.max : 1;
    const value = slider.value;
    slider.style.background = `linear-gradient(to right, #d6b570 0%, #d6b570 ${
      ((value - min) / (max - min)) * 100
    }%, #ccc ${((value - min) / (max - min)) * 100}%, #ccc 100%)`;
  }, []);

  return (
    <div className="loyalty">
      <div className={`${isPointAndMembership || isPointAndNotMembership ? "loyalty-point" : "loyalty-not-point"}`}>
        <div className="member-info">
          <div className="upload">
            <div className="profile-image">
              <ImageUploading
                onChange={uploadFile.onUploadImage}
                dataURLKey="data_url"
                onError={uploadFile.uploadImageError}
                maxFileSize={ImageSizeDefault}
              >
                {({ onImageUpload }) => {
                  return (
                    <>
                      <img onClick={onImageUpload} className="upload-profile-img" src={uploadProfileImg} alt="avatar" />
                      <img
                        className="profile-img"
                        src={uploadFile.profileImageURL ?? uploadFile.profileImage}
                        alt="profile"
                      />
                    </>
                  );
                }}
              </ImageUploading>
            </div>
          </div>
          <div className="name-point">
            <div className="name">
              <TyporaphyEllipsis title={isCustomize ? "Huynh Nha Tran" : `${firstName} ${lastName}`} fontSize={20} />
            </div>
            <div className="point">
              {(isPointAndMembership || isPointAndNotMembership) && (
                <>
                  <div className="rank-icon">
                    {thumbnail ? (
                      <>
                        <ImageUploading dataURLKey="data_url">
                          {() => {
                            return (
                              <>
                                <img className="thumbnail-url-rank" src={thumbnail} alt="profile" />
                              </>
                            );
                          }}
                        </ImageUploading>
                      </>
                    ) : (
                      <PremiumIcon />
                    )}
                  </div>
                  <div className="rank-points">
                    <TyporaphyEllipsis title={translateData.points} />
                  </div>
                </>
              )}
              {(isNotPointAndMembership || isPointAndMembership) && (
                <div className="rank">
                  <Button>
                    <TyporaphyEllipsis title={rank} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bar-code">
          <Barcode value={customerBarcode} height={30} width={1.5} displayValue={false} format="CODE128" />
          <div className="value-code">{customerBarcode}</div>
        </div>
        {(isPointAndMembership || isPointAndNotMembership) && (
          <>
            <div className="range-slider">
              <input
                type="range"
                className={`${
                  isMaximumAccumulatedPoint
                    ? "fnb-range-slider-max"
                    : isMinimumAccumulatedPoint
                    ? "fnb-range-slider-min"
                    : ""
                } fnb-range-slider`}
                min={0}
                max={100}
                value={(customerAccumulatedPoint * 100) / accumulatedPointNext}
              />
            </div>
            <div className="need-point-text">
              {translateData.youNeedMore}
              <span className="score">
                {formatNumberWithCommas(
                  accumulatedPointNext > customerAccumulatedPoint ? accumulatedPointNext - customerAccumulatedPoint : 0,
                )}
              </span>
              {translateData.toGetRank}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoyaltyPoint;
