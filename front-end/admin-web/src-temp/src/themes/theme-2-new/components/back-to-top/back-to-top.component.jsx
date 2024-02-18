import { useEffect } from "react";
import styled from "styled-components";
import backToTopImage from "../../assets/images/back-to-top.png";

function BackToTopComponent(props) {
  const BackToTopStyled = styled.div`
    position: fixed;
    bottom: 32px;
    right: 32px;
  `;

  return (
    <BackToTopStyled className="pointer d-none" id="back2Top">
      <img
        alt="#themeHeader"
        src={backToTopImage}
        onClick={(e) => {
          const element = document.getElementById("themeHeader");
          element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }}
      />
    </BackToTopStyled>
  );
}

export default BackToTopComponent;
