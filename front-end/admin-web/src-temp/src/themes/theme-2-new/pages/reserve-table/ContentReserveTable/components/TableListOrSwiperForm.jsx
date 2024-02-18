// Trong file TableList.js
import { Col, Row } from "antd";
import React, { memo } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import TableCheckBoxIconCustomize from "../../../../assets/icons/TableCheckBox";
import TableDefaultTheme2 from "../../../../assets/images/table-default-reserve-theme2.png";
import areaTableDataService from "./../../../../../data-services/area-table-data.service";

const TableListOrSwiperFormComponent = ({
  areaSelected,
  tableSelected,
  handleSelectTable,
  translateData,
  setAreaTableDetail,
  setIsVisibleAreaTable,
}) => {

  const handleClickViewDetail = async (item) => {
    await areaTableDataService.getDescriptionById(item?.id).then(response => {
      const description = response?.data?.description;
      setAreaTableDetail(
      {
        ...item,
        description: description
      });
      setIsVisibleAreaTable(true);
    })
  }

  return (
    <>
      <Col span={0} xs={0} sm={0} md={24} lg={24} xl={24} xxl={24}>
        {areaSelected?.tables?.length > 0 && (
          <Row gutter={[18, 18]}>
            {areaSelected?.tables?.map((item, index) => {
              return (
                <Col key={index} className="gutter-row" span={12}>
                  <div className={`table-item ${tableSelected?.includes(item) ? "is-selected" : ""}`}>
                    <div className="table-linear-gradient"></div>
                    {item?.imageUrl && <img className="image-item-table" src={item?.imageUrl} alt="" />}
                    {!item?.imageUrl && <img className="image-default" src={TableDefaultTheme2} alt="" />}

                    <h1 className="table-title">{item?.name}</h1>
                    <h1 className="table-title-no-hover">
                      {item?.name}
                      </h1>
                    <div className="table-checkbox-icon">
                      <TableCheckBoxIconCustomize isSelected={tableSelected?.includes(item) ? true : false} />
                    </div>
                    <div className="table-content">
                      {(item?.shortDescription || item?.description) && <span>{item?.shortDescription || "-"}</span>}
                    </div>
                    <ul className="table-detail">
                      <li>
                        {translateData.seats}: {item?.numberOfSeat}
                      </li>
                    </ul>
                    <input
                      class="choose-table"
                      onClick={() => {
                        handleSelectTable(item);
                      }}
                      type="button"
                      value={!tableSelected?.includes(item) ? translateData.selectTable : translateData.unSelectTable}
                    />
                    {item?.shortDescription && (
                      <input
                        class="view-detail"
                        type="button"
                        onClick={() => handleClickViewDetail(item)}
                        value={translateData.viewDetail}
                      />
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </Col>
      <Col span={24} xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
        <Swiper
          loop={false}
          spaceBetween={16}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="swiper-area-table"
          slidesPerView={"auto"}
        >
          {areaSelected?.tables?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div>
                  <div className={`table-item ${tableSelected?.includes(item) ? "is-selected" : ""}`}>
                    <div className="table-linear-gradient"></div>
                    {item?.imageUrl && <img className="image-item-table" src={item?.imageUrl} alt="" />}
                    {!item?.imageUrl && <img className="image-default" src={TableDefaultTheme2} alt="" />}

                    <h1 className="table-title">{item?.name}</h1>
                    <h1 className="table-title-no-hover">{item?.name}</h1>
                    <div className="table-checkbox-icon">
                      <TableCheckBoxIconCustomize isSelected={tableSelected?.includes(item) ? true : false} />
                    </div>
                    <ul className="table-detail">
                      <li>
                        {translateData.seats}: {item?.numberOfSeat}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="swiper-button">
                  <input
                    class="choose-table"
                    onClick={() => {
                      handleSelectTable(item);
                    }}
                    type="button"
                    value={!tableSelected?.includes(item) ? translateData.selectTable : translateData.unSelectTable}
                  />
                  {item?.shortDescription && (
                    <input
                      class="view-detail"
                      type="button"
                      onClick={() => handleClickViewDetail(item)}
                      value={translateData.viewDetail}
                    />
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Col>
    </>
  );
};

export default memo(TableListOrSwiperFormComponent);
