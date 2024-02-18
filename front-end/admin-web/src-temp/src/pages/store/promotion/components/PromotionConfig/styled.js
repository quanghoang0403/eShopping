import styled from "styled-components";
import { variants } from "../variants";
import { Checkbox } from "antd";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;

  @media screen and (max-width: ${variants.screen.sm}) {
    overflow: hidden auto;
    height: calc(90dvh - 50px);
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;

export const WrapperConfig = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    height: calc(
        100vh - (2 * ${variants.position.top.xxl} + 2 * ${variants.header.padding.xxl} + 2 * ${variants.body.padding.xxl} + ${variants.header.gap.xxl})
    );
    overflow: auto;
    scroll-behavior: smooth;

    &::-webkit-scrollbar-track {
        margin-top: 16px;
        margin-bottom: 16px;
    }

    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    } 

    @media screen and (max-width: ${variants.screen.xl}) {
        height: calc(
        100vh - (2 * ${variants.position.top.xl} + 2 * ${variants.header.padding.xl} + 2 * ${variants.body.padding.xl} + ${variants.header.gap.xl})
        );
    }

    @media screen and (max-width: ${variants.screen.sm}) {
        height: 100%;
        margin-bottom: 24px;
    }
`

export const TitleSetting = styled.div`
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    color: ${(props) => props.theme.colors.text.violentViolet};

    @media screen and (max-width: ${variants.screen.sm}) {
        font-size: 18px;
        font-weight: 700;
    }
`;

export const PromotionOption = styled(Checkbox)`
  .ant-checkbox + span {
    padding-left: 16px;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: ${(props) => props.theme.colors.text.main};
  }

  @media screen and (max-width: ${variants.screen.sm}) {
    .ant-checkbox + span {
      font-size: 16px;
      font-weight: 400;
    }
  }
`;

export const PromotionSwitch = styled.div`
  span {
    padding-left: 16px;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: ${(props) => props.theme.colors.text.main};
  }

  .ant-switch:hover:not(.ant-switch-disabled) {
    background: ${(props) => props.theme.colors.common.lavender};
  }

  .ant-switch-checked {
    background-color: ${(props) => props.theme.colors.button.main} !important;

    .ant-switch-inner {
      width: unset;
      background: ${(props) => props.theme.colors.button.main} !important;
    }

    .ant-switch-handle {
      inset-inline-start: calc(100% - 22px) !important;

      &::before {
        background-color: ${(props) => props.theme.colors.textField.background};
      }
    }
  }

  @media screen and (max-width: ${variants.screen.sm}) {
    span {
      font-size: 16px;
      font-weight: 400;
    }
  }
`;

export const PromotionCheck = styled.div`
    display: flex;
    flex-direction: column;
`;

export const PromotionDescription = styled.span`
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    color: ${(props) => props.theme.colors.text.carrotOrange};
    padding-left: 40px;
`;

export const WrapperExample = styled.div`
  width: 100%;
  height: calc(
    100vh - (2 * ${variants.position.top.xxl} + 2 * ${variants.header.padding.xxl} + 2 * ${variants.body.padding.xxl} + ${variants.header.gap.xxl})
  );
  background-color: ${(props) => props.theme.colors.primary.light};
  border-radius: 16px;
  padding: 16px;
  overflow: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar-track {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  @media screen and (max-width: ${variants.screen.xl}) {
    height: calc(
      100vh - (2 * ${variants.position.top.xl} + 2 * ${variants.header.padding.xl} + 2 * ${variants.body.padding.xl} + ${variants.header.gap.xl})
    );
  }

  @media screen and (max-width: ${variants.screen.sm}) {
    height: 100%;
  }
`;

export const InnerHtml = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text.main};

  ol,
  ul {
    margin-left: 24px;
    margin-bottom: 0;
  }

  ul {
    list-style-type: disc;
  }

  p {
    margin-bottom: 0;
  }

  .discount-group {
    display: flex;
    flex-direction: row;
    gap: 12px;

    .info {
      font-weight: 700;
    }

    & > div {
      padding-left: 24px;

      &:nth-child(odd) {
        width: 30%;
      }

      &:nth-child(even) {
        width: 70%;
      }
    }
  }

  .indent {
    padding-left: 24px;
  }

  .medium {
    font-weight: 400;
  }

  .bold {
    font-weight: 700;
  }

  .info {
    color: ${(props) => props.theme.colors.text.blueOrchid};
  }

  .success {
    color: ${(props) => props.theme.colors.text.jade};
  }

  .warning {
    color: ${(props) => props.theme.colors.text.carrotOrange};
  }

  .error {
    color: ${(props) => props.theme.colors.common.harleyDavidsonOrange};
  }

  @media screen and (max-width: ${variants.screen.sm}) {
    font-size: 16px;
    font-weight: 400;

    .discount-group {
      & > div {
        &:nth-child(odd) {
          width: 50%;
        }

        &:nth-child(even) {
          width: 50%;
        }
      }
    }
  }
`;
