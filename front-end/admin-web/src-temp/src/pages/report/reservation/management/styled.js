import styled, { css } from "styled-components";
import { ReservationStatus } from "constants/reservation-constant";
import { variants } from "./variants";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
export const Title = styled.div`
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  color: ${(props) => props.theme.colors.text.violentViolet};
`

export const WrapperTable = styled.div`
  .fnb-table-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
    border-radius: 16px;
    padding: 24px;
    background-color: ${(props) => props.theme.colors.mainMenu.background};
  }
`

export const Text = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.theme.colors.text.main};
`

export const Id = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.theme.colors.text.blueOrchid};
  text-decoration-line: underline;
  cursor: pointer;
`

export const Branch = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.theme.colors.text.main};
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
`

export const ArrivalTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  div {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.colors.text.blueberry};
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: 0.3px;
    color: ${(props) => props.theme.colors.text.blueberry};
  }
`

export const Status = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  border-radius: 16px;
  width: 100%;
  max-width: 160px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  white-space: nowrap;

  ${(props) => {
    switch (props.statusId) {
      case ReservationStatus.WaitToConfirm:
        return css`
          color: ${(props) => props.theme.colors.text.curiousBlue};
          background-color: ${(props) => props.theme.colors.background.iceBerg};
        `;
      case ReservationStatus.Serving:
        return css`
          color: ${(props) => props.theme.colors.text.carrotOrange};
          background-color: ${(props) => props.theme.colors.background.sandyBeach};
        `;
      case ReservationStatus.Completed:
        return css`
          color: ${(props) => props.theme.colors.text.limeGreen};
          background-color: ${(props) => props.theme.colors.background.offGreen};
        `;
      case ReservationStatus.Cancelled:
        return css`
          color: ${(props) => props.theme.colors.text.ferrariRed};
          background-color: ${(props) => props.theme.colors.background.vistaWhite};
        `;
      case ReservationStatus.Confirmed:
        return css`
          color: ${(props) => props.theme.colors.text.violentViolet};
          background-color: ${(props) => props.theme.colors.background.fog};
        `;
      default: return css``;
    }
  }}
`