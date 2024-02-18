import { CheckOutlined } from "@ant-design/icons";
import { Button, Col, Form, Image, Row, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import {
  BranchStoreIcon,
  CloseCircleBlackIcon,
  LeftReverseIcon,
  RightReverseIcon,
} from "../../../assets/icons.constants";
import { ReservationReadMoreIcon } from "../../../assets/icons/ReservationReadMoreIcon";
import areaDetailDefault from "../../../assets/images/area_detail_default.jpg";
import noneReserveATable from "../../../assets/images/none-reserve-a-table.png";
import reserveTableDetailDefault from "../../../assets/images/reserve-table-detail-default.png";
import reserveTableErrorImage from "../../../assets/images/reserve-table-error-image.png";
import { MAX_SHORT_DESCRIPTION } from "../../../constants/reserve.constants";
import DialogReadMoreReservation from "./DialogReadMoreReservation/DialogReadMoreReservation";
import DrawerReadMoreReservation from "./DialogReadMoreReservation/DrawerReadMoreReservation";
import areaDataService from "../../../../data-services/area-data.service";
import areaTableDataService from "../../../../data-services/area-table-data.service";
import { defaultImageReservation } from "../default-data";

const { Option } = Select;

export default function ReserveTableContentLeft(props) {
  const {
    tableSelected,
    setTableSelected,
    areaSelected,
    setAreaSelected,
    reserveTableData,
    deliveryAddress,
    form,
    onChangeBranch,
    colorGroup,
    branchesByCustomerAddress,
  } = props;
  const [t] = useTranslation();
  const swiperRef = useRef(null);
  const translateData = {
    people: t("reserve.people"),
    pleaseExploreAnotherFloor: t("reserve.pleaseExploreAnotherFloor"),
    pickDate: t("reserve.pickDate"),
    reserveInformation: t("reserve.reserveInformation"),
    branch: t("reserve.branch"),
    branchPlaceHolder: t("reserve.branchPlaceHolder"),
    pleaseSelectTheBranch: t("reserve.pleaseSelectTheBranch"),
    yourFullName: t("reserve.yourFullName"),
    name: t("reserve.name"),
    pleaseEnterTheReservationName: t("reserve.pleaseEnterTheReservationName"),
    phoneNumber: t("reserve.phoneNumber"),
    pleaseEnterTheReservationPhone: t("reserve.pleaseEnterTheReservationPhone"),
    email: t("reserve.email"),
    numberOfGuests: t("reserve.numberOfGuests"),
    pleaseEnterTheNumberOfGuests: t("reserve.pleaseEnterTheNumberOfGuests"),
    yourArrivaltime: t("reserve.yourArrivaltime"),
    enterYourArrivalTime: t("reserve.enterYourArrivalTime"),
    pleaseEnterYourArrivalTime: t("reserve.pleaseEnterYourArrivalTime"),
    notes: t("reserve.notes"),
    exNotes: t("reserve.exNotes"),
    iNeedTheChairForMyChildren: t("reserve.iNeedTheChairForMyChildren"),
    doesTheRestaurantHaveAParkingLot: t("reserve.doesTheRestaurantHaveAParkingLot"),
    canISeeTheMenuInAdvance: t("reserve.canISeeTheMenuInAdvance"),
    pleaseSelectABranchToStartYourReservation: t("reserve.pleaseSelectABranchToStartYourReservation"),
    weWillUpdateSoon: t("reserve.weWillUpdateSoon"),
    selectTable: t("reserve.selectTable"),
    viewDetail: t("reserve.viewDetail", "View Detail"),
  };
  const [isShowDescriptionId, setIsShowDescriptionId] = useState(null);
  const [isHiddenButtonSwiper, setIsHiddenButtonSwiper] = useState(false);
  const [swiperBeginning, setSwiperBeginning] = useState(true);
  const [isShowDialogSeeMore, setIsShowDialogSeeMore] = useState(false);
  const [swiperEnd, setSwiperEnd] = useState(false);
  const [dataDialogReadMore, setDataDialogReadMore] = useState({});
  const themeConfig = useSelector((state) => state.session?.themeConfig);
  const [isShowBoxDrawerReadMore, setIsShowBoxDrawerReadMore] = useState(false);
  const isMobileAndTablet = useMediaQuery({ maxWidth: 1199 });
  useEffect(() => {
    if (reserveTableData && reserveTableData.length > 0) {
      setAreaSelected(reserveTableData[0]);
    }
  }, [reserveTableData]);

  useEffect(() => {
    if (branchesByCustomerAddress) {
      if (deliveryAddress && branchesByCustomerAddress) {
        form.setFieldsValue({
          branch: deliveryAddress?.branchAddress?.id,
        });
        onChangeBranch(deliveryAddress?.branchAddress?.id);
      } else {
        // Case not select branch or address
        const { branchId } = branchesByCustomerAddress[0];
        form.setFieldsValue({ branch: branchId });
        onChangeBranch(branchId);
      }
    }
  }, [branchesByCustomerAddress]);

  const handleScrollLeft = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleScrollRight = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleChangeArea = (area) => {
    setTableSelected(null);
    setAreaSelected(area);
  };

  const handleSelectTable = (table) => {
    if (!tableSelected?.includes(table)) {
      if (tableSelected) {
        setTableSelected([...tableSelected, table]);
      } else {
        setTableSelected([table]);
      }
    } else if (tableSelected) {
      const filteredArray = tableSelected?.filter((item) => {
        return !(item.areaId === table.areaId && item.name === table.name);
      });
      setTableSelected(filteredArray);
    }
  };
  const swiperContainer = document.querySelector(".swiper-custom");
  const swiperSlides = document.querySelectorAll(".swiper-slide");
  useEffect(() => {
    if (swiperSlides) {
      let totalWidth = 0;
      let widthSwiper = swiperContainer?.getBoundingClientRect()?.width;

      swiperSlides.forEach((slide) => {
        const slideWidth = slide?.getBoundingClientRect()?.width;
        totalWidth += slideWidth;
      });
      if (totalWidth > widthSwiper) {
        setIsHiddenButtonSwiper(false);
      } else {
        setIsHiddenButtonSwiper(true);
      }
    }
  }, [swiperSlides]);

  const handleShowDialogReadMore = () => setIsShowDialogSeeMore(true);
  const handleHideDialogReadMore = () => setIsShowDialogSeeMore(false);
  const handleHideBoxDrawerReadMore = () => setIsShowBoxDrawerReadMore(false);
  const handleShowBoxDrawerReadMore = () => setIsShowBoxDrawerReadMore(true);

  const handleOnClickIconTableReadMore = async (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    await areaTableDataService.getDescriptionById(item?.id).then((response) => {
      const description = response?.data?.description;
      setDataDialogReadMore({
        name: item?.name,
        imageUrl: item?.imageUrl ? item?.imageUrl : defaultImageReservation?.icon?.areaTable,
        description: description,
        numberOfSeat: item?.numberOfSeat,
      });
      isMobileAndTablet ? handleShowBoxDrawerReadMore() : handleShowDialogReadMore();
    });
  };

  const onCheckIfDescriptionEmpty = (description) => {
    if (!description) {
      return true;
    }
    const decodedString = description.replace(/&nbsp;/g, " ");
    const result = decodedString.trim() === "";
    return result;
  };

  const handleOpenDialogSeeMore = async () => {
    await areaDataService.getDescriptionById(areaSelected?.id).then((response) => {
      const description = response?.data?.description;
      setDataDialogReadMore({
        name: areaSelected?.name,
        imageUrl: areaSelected?.imageUrl ? areaSelected?.imageUrl : defaultImageReservation?.icon?.area,
        description: description,
      });
      isMobileAndTablet ? handleShowBoxDrawerReadMore() : handleShowDialogReadMore();
    });
  };

  return (
    <div className="reserve-table-left-content">
      <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
        <Form.Item
          className="w-100 branch-mobile"
          name="branch"
          label={
            <span>
              {translateData.branch}
              <span>*</span>
            </span>
          }
          rules={[
            {
              required: true,
              message: translateData.pleaseSelectTheBranch,
            },
          ]}
        >
          <Select
            placeholder={translateData.branchPlaceHolder}
            optionLabelProp="label"
            style={{ width: "100%" }}
            className="select-components"
            popupClassName="popup-reserve-table-branch-select-custom popup-reserve-table-branch-select-custom-left-content"
            onChange={onChangeBranch}
          >
            {branchesByCustomerAddress?.map((branch) => (
              <Option key={branch.branchId} value={branch.branchId} label={branch.branchName}>
                <div className="branch-options-custom">
                  <CheckOutlined className="check-icon" />
                  <div className="icon">
                    <BranchStoreIcon />
                  </div>
                  <div className="information">
                    <span className="branch-name">
                      {branch.branchName}&nbsp;
                      {branch.distance > 0 && (
                        <span className="distance">({(branch.distance / 1000).toFixed(1)}km)</span>
                      )}
                    </span>
                    <span className="branch-address">{branch.branchAddress}</span>
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      {reserveTableData === null || reserveTableData?.length === 0 ? (
        <>
          <div className="reserve-table-error">
            <div className="image-format">
              <Image preview={false} className="image" src={reserveTableErrorImage} />
            </div>

            <div
              className="content-text"
              dangerouslySetInnerHTML={{
                __html: translateData.weWillUpdateSoon,
              }}
            ></div>
          </div>
        </>
      ) : (
        <>
          {/* Area button box */}
          <div className="area-button-box">
            <div className="swiper-custom">
              <Swiper
                slidesPerView={"auto"}
                ref={swiperRef}
                onSlideChangeTransitionStart={(e) => {
                  setSwiperEnd(e?.isEnd);
                  setSwiperBeginning(e?.isBeginning);
                }}
                onSlideChangeTransitionEnd={(e) => {
                  setSwiperEnd(e?.isEnd);
                  setSwiperBeginning(e?.isBeginning);
                }}
                onSlideResetTransitionStart={(e) => {
                  setSwiperEnd(e?.isEnd);
                  setSwiperBeginning(e?.isBeginning);
                }}
                onSlideResetTransitionEnd={(e) => {
                  setSwiperEnd(e?.isEnd);
                  setSwiperBeginning(e?.isBeginning);
                }}
              >
                {reserveTableData?.map((area, index) => (
                  <SwiperSlide key={area.id}>
                    <div
                      onClick={() => {
                        handleChangeArea(area);
                      }}
                      className={`area-button ${area.id === areaSelected?.id ? "active" : ""} ${
                        index > 0 && "area-button-spacing"
                      }`}
                    >
                      <span className="area-name">{area?.name}</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {isHiddenButtonSwiper ? (
              ""
            ) : (
              <div className="button-swiper">
                <div className={`icon-custom ${swiperBeginning ? "disable" : "active"}`} onClick={handleScrollLeft}>
                  <LeftReverseIcon className="" />
                </div>
                <div className={`icon-custom ${swiperEnd ? "disable" : "active"}`} onClick={handleScrollRight}>
                  <RightReverseIcon />
                </div>
              </div>
            )}
          </div>
          {/* Area detail */}
          <div
            className="area-detail-box"
            style={{
              backgroundImage: `url(${areaSelected?.imageUrl ? areaSelected?.imageUrl : areaDetailDefault})`,
            }}
          >
            <div className="area-detail-content">
              <div className="overlay"></div>
              <div className="content-title">{areaSelected?.name}</div>
              {/* Handle logic CTA See more and render short description */}
              {!onCheckIfDescriptionEmpty(areaSelected?.shortDescription) ? (
                <div
                  className="content-text"
                  dangerouslySetInnerHTML={{
                    __html:
                      areaSelected?.shortDescription?.length > MAX_SHORT_DESCRIPTION
                        ? areaSelected?.shortDescription + "..."
                        : areaSelected?.shortDescription,
                  }}
                ></div>
              ) : (
                <div className="content-text" dangerouslySetInnerHTML={{ __html: "-" }}></div>
              )}
              {!onCheckIfDescriptionEmpty(areaSelected?.shortDescription) && (
                <Button className="btn-read-more" onClick={handleOpenDialogSeeMore}>
                  <span>{translateData.viewDetail}</span>
                </Button>
              )}
            </div>
          </div>
          <DrawerReadMoreReservation
            title={dataDialogReadMore?.name}
            avatar={dataDialogReadMore?.imageUrl}
            description={dataDialogReadMore?.description}
            numberOfSeat={dataDialogReadMore?.numberOfSeat}
            onClose={handleHideBoxDrawerReadMore}
            visible={isShowBoxDrawerReadMore}
          />
          <DialogReadMoreReservation
            title={dataDialogReadMore?.name}
            avatar={dataDialogReadMore?.imageUrl}
            description={dataDialogReadMore?.description}
            numberOfSeat={dataDialogReadMore?.numberOfSeat}
            onCancel={handleHideDialogReadMore}
            visible={isShowDialogSeeMore}
          />

          {/* Table detail */}
          <div className="table-detail-box">
            <div className="content-title">{translateData.selectTable}</div>
            <Row className={`select-table-row ${areaSelected?.tables.length <= 0 && "none-data"}`}>
              {areaSelected?.tables.length <= 0 && (
                <div className="none-data-table">
                  <div
                    style={{
                      backgroundImage: `url(${noneReserveATable})`,
                    }}
                    className="image"
                  ></div>
                  <div
                    className="text"
                    dangerouslySetInnerHTML={{ __html: translateData.pleaseExploreAnotherFloor }}
                  ></div>
                </div>
              )}
              {areaSelected?.tables?.map((item, index) => {
                return (
                  <>
                    {isShowDescriptionId === item.id ? (
                      <Col
                        span={12}
                        xs={12}
                        sm={8}
                        md={8}
                        lg={8}
                        xl={8}
                        xxl={8}
                        onClick={() => {
                          handleSelectTable(item);
                        }}
                        className={`table-default-box-description ${
                          tableSelected?.includes(item) ? "is-selected" : ""
                        }`}
                      >
                        <div className="description-content">
                          <CloseCircleBlackIcon
                            className="icon-close"
                            onClick={() => {
                              setIsShowDescriptionId(null);
                            }}
                          />
                          <Image
                            className="image"
                            width={"100%"}
                            preview={false}
                            src={item?.imageUrl ? item?.imageUrl : reserveTableDetailDefault}
                          />
                          <div className="name-and-number">
                            <span className="name">{item?.name}</span>
                            <span className="number-of-seat">
                              {item?.numberOfSeat} {translateData.people}
                            </span>
                          </div>
                          <div
                            className="description"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          ></div>
                        </div>
                      </Col>
                    ) : (
                      <Col
                        span={12}
                        xs={12}
                        sm={8}
                        md={8}
                        lg={8}
                        xl={8}
                        xxl={8}
                        onClick={() => {
                          handleSelectTable(item);
                        }}
                        className={`table-default-box ${tableSelected?.includes(item) ? "is-selected" : ""}`}
                      >
                        <div className="secondary-row">
                          <div className="secondary-row-box"></div>
                          <div className="secondary-row-box ml-16"></div>
                        </div>
                        <div className="primary-row mt-8">
                          <div className="top-right-icon-box" onClick={(e) => handleOnClickIconTableReadMore(item, e)}>
                            {!onCheckIfDescriptionEmpty(item?.shortDescription) ||
                            item?.description?.includes("<img") ? (
                              <ReservationReadMoreIcon fill={colorGroup?.buttonBackgroundColor} />
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="primary-text-box">
                            <p className="table-name">
                              <b>{item?.name}</b>
                            </p>
                            <p>{`(${item?.numberOfSeat ?? 0} người)`}</p>
                          </div>
                        </div>
                        <div className="secondary-row mt-8">
                          <div className="secondary-row-box"></div>
                          <div className="secondary-row-box ml-16"></div>
                        </div>
                      </Col>
                    )}
                  </>
                );
              })}
            </Row>
          </div>
        </>
      )}
    </div>
  );
}
