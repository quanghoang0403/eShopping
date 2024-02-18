import styled from "styled-components";

export const ReserveTableDetailStyled = styled.div`
  .reserve-table-detail-container {
    .reserve-table-detail-main {
      .reserve-table-detail-info .reserve-table-detail-info-left .btn-cancel-reserve-table {
        background-color: ${(props) => props?.colorGroup?.buttonBackgroundColor};
        color: ${(props) => props?.colorGroup?.buttonTextColor};
        border: 1px solid ${(props) => props?.colorGroup?.buttonBorderColor};
      }
    }
  }
`;
