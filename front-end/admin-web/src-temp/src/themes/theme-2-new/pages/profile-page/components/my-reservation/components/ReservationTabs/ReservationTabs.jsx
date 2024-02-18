import { Radio } from "antd";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "./ReservationTabs.scss";

const ReservationTabs = (props) => {
  const { reservationTabsStatus, currentTab, onChangeTab } = props;
  const isMinWidth1200 = useMediaQuery({ minWidth: 1200 });
  let settings = {
    slidesPerView: "auto",
    spaceBetween: 12,
  };

  return (
    <Radio.Group
      className={`my-reservation-status-list-rd ${isMinWidth1200 ? "my-reservation-status-desktop-theme2" : ""}`}
      value={currentTab}
      onChange={(e) => onChangeTab && onChangeTab(e)}
    >
      {isMinWidth1200 ? (
        <>
          {reservationTabsStatus?.map((item, index) => {
            return (
              <Radio.Button key={index} value={item?.key} className="my-reservation-status-rd">
                {item?.name}
              </Radio.Button>
            );
          })}
        </>
      ) : (
        <Swiper
          {...settings}
          modules={[Navigation]}
          lazy={true}
          scrollbar={{
            el: ".swiper-scrollbar",
            draggable: true,
          }}
          pagination={{
            clickable: true,
          }}
          className="my-reservation-status-theme2"
        >
          {reservationTabsStatus?.map((item, index) => {
            return (
              <SwiperSlide className="swiper-slide-status">
                <Radio.Button key={index} value={item?.key} className="my-reservation-status-rd">
                  {item?.name}
                </Radio.Button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </Radio.Group>
  );
};

export default ReservationTabs;
