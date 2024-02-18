import { Row } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { storeConfigSelector } from "../../../modules/session/session.reducers";
import backgroundReserveTable from "../../assets/images/reserve-table-header-theme2.png";
import { theme2ElementCustomize } from "../../constants/store-web-page.constants";
import Index from "../../index";
import ContentReserveTable from "./ContentReserveTable/ContentReserveTable";
import HeaderReserveTable from "./HeaderReserveTable/HeaderReserveTable";
const StyledReserveTable = styled.div`
  .reserve-table-header-customize-theme-2 {
    .reserve-table-section {
      background-image: ${(props) =>
        props?.config?.header?.backgroundType == 1
          ? "none !important"
          : "url(" +
            (props?.config?.header?.backgroundImage != undefined
              ? props?.config?.header?.backgroundImage
              : backgroundReserveTable) +
            ") !important"};
      background-color: ${(props) =>
        props?.config?.header?.backgroundType == 1
          ? props?.config?.header?.backgroundColor + "!important"
          : "none !important"};
    }
  }
  .reserve-table-wrapper .reserve-table-header h1 {
    color: ${(props) => props?.colorGroupHeader?.titleColor};
  }
  .content-reserve-table-container {
    background-image: ${(props) =>
      props?.config?.reservation?.backgroundType == 2
        ? "url(" + props?.config?.reservation?.backgroundImage + ")"
        : "none"};
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: ${(props) =>
      props?.config?.reservation?.backgroundType == 1
        ? props?.config?.reservation?.backgroundColor + "!important"
        : "none !important"};
    .content-reserve-table-container-section .reserve-table-form {
      .reserve-table-form-select-location .reserve-table-form-location .reserve-table-select-table {
        .table-item .choose-table {
          background: ${(props) => props?.colorGroupReservation?.buttonBackgroundColor};
          color: ${(props) => props?.colorGroupReservation?.buttonTextColor};
        }
        .col-area-detail .button-choose-table-detail .choose-table {
          background: ${(props) => props?.colorGroupReservation?.buttonBackgroundColor};
          color: ${(props) => props?.colorGroupReservation?.buttonTextColor};
        }
      }

      .submit-reserve-table .button-submit-reserve-table {
        background: ${(props) => props?.colorGroupReservation?.buttonBackgroundColor};
        color: ${(props) => props?.colorGroupReservation?.buttonTextColor};
      }
    }
  }
`;
export default function ReserveTable({ isCustomize, clickToFocusCustomize, ...props }) {
  const ReserveTablePage = (props) => {
    const colorGroupHeader = props?.general?.color?.colorGroups.find(
      (c) => c.id === props?.config?.header?.colorGroupId,
    );
    const colorGroupReservation = props?.general?.color?.colorGroups.find(
      (c) => c.id === props?.config?.reservation?.colorGroupId,
    );
    const history = useHistory();
    const classNameDisableScrollCustomize = [
      "ant-typography-expand",
      "choose-table",
      "choose-table",
      "detail-back-text",
      "ant-select-selection-item",
      "view-detail",
      "select-option-field",
    ];
    const isAllowReserveTable = useSelector(storeConfigSelector)?.isAllowReserveTable;

    useEffect(() => {
      if (!isCustomize && !isAllowReserveTable) {
        history.push("/");
      }
    }, [isAllowReserveTable]);

    return (
      <div className="reserve-table-theme2">
        <StyledReserveTable
          colorGroupHeader={colorGroupHeader}
          colorGroupReservation={colorGroupReservation}
          config={props?.config}
        >
          <div
            id="themeHeaderReservation"
            onClick={() => {
              if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.HeaderReservation);
            }}
          >
            <Row id="headerReserveTable" style={{ display: "block" }}>
              <HeaderReserveTable isCustomize={isCustomize} clickToFocusCustomize={clickToFocusCustomize} {...props} />
            </Row>
          </div>

          <div
            id="themeReservationReservation"
            onClick={(e) => {
              if (classNameDisableScrollCustomize?.includes(e?.target?.className)) {
                return;
              }
              if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.ReservationReservation);
            }}
          >
            <Row id="contentReserveTable" style={{ display: "block" }}>
              <ContentReserveTable
                {...props}
                isCustomize={isCustomize}
                clickToFocusCustomize={clickToFocusCustomize}
                {...props}
              />
            </Row>
          </div>
        </StyledReserveTable>
      </div>
    );
  };

  return (
    <Index
      {...props}
      contentPage={(props) => {
        return <ReserveTablePage {...props} />;
      }}
    />
  );
}
