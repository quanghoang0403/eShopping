import styled from "styled-components";

export const StyledDateTimePicker = styled.div`
  .group-button-date-time-picker {
    .ant-btn-primary {
      background: ${(props) => props?.colorGroup?.buttonBackgroundColor} !important;
      color: ${(props) => props?.colorGroup?.buttonTextColor} !important;
    }
  }

  .ant-btn-default {
    color: #989898;
    background: none;
  }
  .time-picker-col .select {
    background: ${(props) => props?.colorGroup?.buttonBackgroundColor} !important;
    .hours {
      color: ${(props) => props?.colorGroup?.buttonTextColor} !important;
    }
  }
  .calendar-theme1 .react-calendar__viewContainer .react-calendar__month-view .react-calendar__month-view__days {
    .react-calendar__tile--now {
      border: 1px solid ${(props) => props?.colorGroup?.buttonBorderColor} !important;
    }
    .react-calendar__tile--active {
      background: ${(props) => props?.colorGroup?.buttonBackgroundColor} !important;
    }
  }
`;
