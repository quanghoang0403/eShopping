import styled from "styled-components";

function OrderAreaInfo(props) {
  const { areaName } = props;
  const OrderAreaInfoStyled = styled.div`
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
  `;
  return (
    <OrderAreaInfoStyled>
      <b>{areaName ?? ""}</b>
    </OrderAreaInfoStyled>
  );
}

export default OrderAreaInfo;
