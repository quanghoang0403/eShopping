import styled from "styled-components";
import { DiscountCodeCard } from "../../../../components/discount-code-card/discount-code-card.component";

function DiscountSlide(props) {
  const { width, dataSource, isShowRedeem = false, onClick, colorConfig } = props;

  const DiscountSide = styled.div`
    .discount-slider {
      display: -webkit-inline-box;
      gap: 20px;
      overflow: scroll;
      width: 100%;
      margin-bottom: 5px;
      .discount-slide-item {
        padding: 5px;
      }
    }
  `;

  return (
    <DiscountSide>
      <div className="discount-slider">
        {dataSource?.map((item, index) => {
          return (
            <div key={index} className="discount-slide-item" style={{ width: `${width}px` }}>
              <DiscountCodeCard
                key={index}
                data={item}
                isShowRedeem={false}
                isHomepage={true}
                onClickRedeem={onClick}
                colorConfig={colorConfig}
              />
            </div>
          );
        })}
      </div>
    </DiscountSide>
  );
}

export default DiscountSlide;
