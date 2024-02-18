import styled from 'styled-components';


export const Container = styled.div`
     position: relative;

    .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
        box-shadow: none;
        border-color: ${(props) => props.theme.colors.text.timberwolf};
    }

    .ant-select.ant-select-single .ant-select-selector {
        border: 1px solid ${(props) => props.theme.colors.common.white} !important;
        border-radius: 16px;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25) !important;
    }

    .ant-select-single .ant-select-selector .ant-select-selection-search {
        position: absolute;
        top: 0;
        right: 54px;
        bottom: 0;
        left: 20px;
    }

    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
        height: 60px;
        padding: 14px 20px;
    }

    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input {
        height: 60px;
    }

    .ant-select-single.ant-select-open .ant-select-selection-item {
        visibility: hidden;
    }

    .ant-select-selection-search,
    .ant-select-selection-item {
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: 21px;
        letter-spacing: 0.3px;
        color: ${(props) => props.theme.colors.text.main};
    }

    .ant-select-arrow {
        width: 24px;
        height: 24px;
        position: absolute;
        transform: translate(25%, -25%);
        top: 50%;
        right: 20px;
        color: ${(props) => props.theme.colors.primary.main};
    }
`;

export const Menus = styled.div`
    .ant-select-item {
        padding: 12px;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 21px; 
        letter-spacing: 0.3px;
    }

    .ant-select-item-option:not(.ant-select-item-option-selected) {
        &:hover {
            background-color: ${(props) => props.theme.colors.background.fog} !important;
        }
    }

    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
        background-color: ${(props) => props.theme.colors.primary.light};

        .ant-select-item-option-state {
            color: ${(props) => props.theme.colors.primary.main};
        }
    }

    .ant-select-item-option-active:not(.ant-select-item-option-disabled):not(.ant-select-item-option-selected) {
        background-color: ${(props) => props.theme.colors.background.white};;
    }
`

export const NoDataFounded = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
        width: 60px;
        height: 60px;
    }

    span {
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: ${(props) => props.theme.colors.text.placeholder};
    }
`