import { Modal } from "antd";
import styled from "styled-components";
import { variants } from "../variants";

export const Popover = styled(Modal)`
  position: fixed;
  top: ${variants.position.top.xxl};
  left: calc(10vw + ${variants.position.left.xxl});
  z-index: 1080;

  .ant-modal-content {
    overflow: hidden;
    width: calc(80vw - 2 * ${variants.position.left.xxl});
    height: calc(100vh - 2 * ${variants.position.top.xxl});
    border-radius: ${variants.body.borderRadius.xxl};

    .ant-modal-header {
      padding: ${variants.header.padding.xxl};
      border-bottom: none;
    }

    .ant-modal-body {
      padding: 0 ${variants.body.padding.xxl} ${variants.body.padding.xxl};
      overflow: hidden;
      height: calc(
        100vh - 2 * (${variants.position.top.xxl} + ${variants.header.padding.xxl} + ${variants.body.padding.xxl})
      );
    }
  }

  @media screen and (max-width: ${variants.screen.xl}) {
    left: ${variants.position.left.xl};

    .ant-modal-content {
      overflow: hidden;
      width: calc(100vw - 2 * ${variants.position.left.xl});

      .ant-modal-header {
        padding: ${variants.header.padding.xl};
        border-bottom: none;
      }

      .ant-modal-body {
        padding: 0 ${variants.body.padding.xl} ${variants.body.padding.xl};
        overflow: hidden;
        height: calc(
          100vh - 2 * (${variants.position.top.xl} + ${variants.header.padding.xl} + ${variants.body.padding.xl})
        );
      }
    }
  }

  @media screen and (max-width: ${variants.screen.sm}) {
    top: ${variants.position.top.sm};
    left: ${variants.position.left.sm};

    .ant-modal-content {
      overflow: hidden;
      width: 100vw;
      height: calc(100vh - ${variants.position.top.sm});
      border-radius: ${variants.body.borderRadius.sm};

      .ant-modal-header {
        padding: ${variants.header.padding.sm};
      }

      .ant-modal-body {
        overflow: auto;
        padding: 0 ${variants.body.padding.sm} ${variants.body.padding.sm};
        height: calc(
          100vh - 2 * (${variants.position.top.sm} + ${variants.header.paddingY.sm} + ${variants.body.padding.sm})
        );
      }
    }
  }
`;

export const PopoverHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    width: ${variants.header.iconSize.xxl};
    height: ${variants.header.iconSize.xxl};
    color: ${(props) => props.theme.colors.text.blueMagenta};
    cursor: pointer;

    &:hover {
      color: ${(props) => props.theme.colors.primary.main};
    }
  }

  @media screen and (max-width: ${variants.screen.xl}) {
    svg {
      width: ${variants.header.iconSize.xl};
      height: ${variants.header.iconSize.xl};
    }
  }

  @media screen and (max-width: ${variants.screen.sm}) {
    svg {
      width: ${variants.header.iconSize.sm};
      height: ${variants.header.iconSize.sm};
    }
  }
`;

export const Title = styled.div`
  flex-grow: 1;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  color: ${(props) => props.theme.colors.primary.main};

  @media screen and (max-width: ${variants.screen.sm}) {
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 21px;
    letter-spacing: 0.3px;
    text-align: left;
  }
`;
