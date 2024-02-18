import styled from "styled-components";
import { backgroundTypeEnum } from "../../../constants/store-web-page.constants";

export const StyledReserveTable = styled.div`
  background-color: ${(props) =>
    props?.config?.reservation?.backgroundType === backgroundTypeEnum.Color
      ? props?.config?.reservation?.backgroundColor
      : "none"};

  .reserve-table-content {
    background-image: ${(props) =>
      props?.config?.reservation?.backgroundType === backgroundTypeEnum.Image
        ? "url(" + props?.config?.reservation?.backgroundImage + ")"
        : "none"};
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;

    .reserve-table-left-content {
      .area-detail-content {
        .content-title {
          color: ${(props) => props?.colorGroup?.titleColor} !important;
        }
        .content-text {
          color: ${(props) => props?.colorGroup?.textColor} !important;
        }
      }

      .area-button-box .swiper-custom .active {
        background-color: ${(props) => props?.colorGroup?.buttonBackgroundColor} !important;
        border: none;
      }

      .btn-read-more {
        background-color: ${(props) => props?.colorGroup?.buttonBackgroundColor};
        span {
          color: ${(props) => props?.colorGroup?.buttonTextColor};
        }
      }

      .branch-mobile {
        .ant-form-item-label {
          label {
            color: ${(props) => props?.colorGroup?.textColor};
          }
        }
      }

      .table-detail-box
      {
        .content-title {
          color: ${(props) => props?.colorGroup?.titleColor} !important;
        }
      }

      .table-detail-box .select-table-row {
        .is-selected {
          .primary-row {
            background: ${(props) => props?.colorGroup?.buttonBackgroundColor} !important;
            .top-right-icon-box {
              svg {
                g g rect {
                  fill: ${(props) => props?.colorGroup?.buttonBackgroundColor} !important;
                }
              }
            }
          }
          .secondary-row .secondary-row-box {
            background: ${(props) => props?.colorGroup?.buttonBackgroundColor} !important;
          }
        }
      }
    }

    .reserve-table-right-content {
      .form-information-reserve {
        .title {
          color: ${(props) => props?.colorGroup?.titleColor} !important;
        }
        .ant-form-item .ant-form-item-row .ant-form-item-label label {
          color: ${(props) => props?.colorGroup?.textColor} !important;
        }
      }

      .form-item-button-reserve .button-reserve {
        background: ${(props) => props?.colorGroup?.buttonBackgroundColor} !important;
        color: ${(props) => props?.colorGroup?.buttonTextColor} !important;
        border: none;
      }
    }
  }
`;
