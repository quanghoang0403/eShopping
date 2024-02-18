import styled from "styled-components";
function TopBox({ height = "133px", width = "100%", ...props }) {
  const BoxStyled = styled.div`
    height: ${height};
    width: ${width};
    .rectangle {
      background: linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(251 251 255) 100%);
      height: ${height};
      width: ${width};
    }
  `;
  return (
    <BoxStyled>
      <div className="rectangle" />
    </BoxStyled>
  );
}

export default TopBox;
