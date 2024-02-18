import styled from "styled-components";

export const MyReservationStyled = styled.div`
  .my-reservation-theme2 {
    .my-reservation-status-list {
      .ant-radio-button-wrapper-checked {
        .ant-radio-button-checked {
          border-radius: 30px;
          background-color: ${(props) => (props?.colorGroup?.buttonBackgroundColor ?? '#DB4D29')};
        }
        span {
          color: ${props => props?.colorGroup?.buttonTextColor};
        }
      }
    }
  }
`;
