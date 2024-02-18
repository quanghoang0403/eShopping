import { Grid } from "antd";
import { useMemo } from "react";
import styled from "styled-components";
import { isMobileBreakPoint } from "../../../../../utils/antdBreakPoint.helpers";
import OrderFoodIcon from "../OrderFoodIcon";
import Boxes from "./Boxes";
const { useBreakpoint } = Grid;

function TopBackground(props) {
  const { className } = props;
  const screens = useBreakpoint();
  const isMobile = isMobileBreakPoint(screens);
  const numberBox = useMemo(() => {
    return isMobile ? 3 : 5;
  }, [isMobile]);
  const BackgroundStyled = styled.div`
    background: linear-gradient(180deg, rgb(242, 245, 252) 0%, rgb(218.96, 222.78, 248.54) 100%);
    padding-bottom: 50px;
  `;
  const TopEellipseBox = styled.div`
    width: 100%;
    margin: auto;
    margin-top: -70px;
    position: relative;
    height: 70px;
  `;

  const BoxTopBorder = () => {
    if (isMobile) {
      return (
        <div className="bg-border">
          <svg width="430" height="465" viewBox="0 0 430 465" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="215.243" cy="322.75" rx="490.243" ry="322.75" fill="#F2F5FC" />
          </svg>
        </div>
      );
    }
    return (
      <div className="bg-border">
        <svg width="834" height="712" viewBox="0 0 834 712" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="416.492" cy="487.5" rx="740.492" ry="487.5" fill="#F2F5FC" />
        </svg>
      </div>
    );
  };

  return (
    <div className={className}>
      <BackgroundStyled>
        <Boxes total={numberBox} />
      </BackgroundStyled>
      <TopEellipseBox>
        <OrderFoodIcon className="content-center order-food-icon" />
      </TopEellipseBox>
      <BoxTopBorder />
    </div>
  );
}

export default TopBackground;
