import styled from 'styled-components';


export const Container = styled.div`
    position: relative;

    .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
        box-shadow: none;
        border-color: ${(props) => props.theme.colors.text.timberwolf};
    }

    .ant-select:not(.ant-select-customize-input) .ant-select-selector {
        border: 1px solid ${(props) => props.theme.colors.common.white} !important;
        border-radius: 16px;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25) !important;
    }

    .ant-select-multiple .ant-select-selector {
        height: 60px;
        padding: 9px;
    }

    .ant-select-multiple .ant-select-selection-placeholder {
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: 21px;
        letter-spacing: 0.3px;
        color: ${(props) => props.theme.colors.text.main};
    }

    .ant-select-multiple .ant-select-selection-search-input,
    .ant-select-multiple .ant-select-selection-search-mirror {
        height: 38px;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: 21px;
        letter-spacing: 0.3px;
        color: ${(props) => props.theme.colors.text.main};
    }

    .ant-select-multiple .ant-select-selection-item {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 4px;
        height: 40px;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 8px;
        cursor: pointer;       

        .ant-select-selection-item-content {
            margin: 0;
            font-size: 18px;
            font-style: normal;
            font-weight: 400;
            line-height: 21px;
            letter-spacing: 0.3px;
            color: ${(props) => props.theme.colors.text.main};
        }

        .ant-select-selection-item-remove {
            display: none;
        }

        &:hover {
            background-color: ${(props) => props.theme.colors.primary.light};
            border: 1px solid ${(props) => props.theme.colors.primary.light};

            .ant-select-selection-item-content {
                &::after {
                    display: none;
                }
            }

            .ant-select-selection-item-remove {
                display: initial;
                color: ${(props) => props.theme.colors.primary.main};
                
                svg {
                    width: 14px;
                    height: 14px;
                }
            }
        }
    }

    .ant-select-selection-overflow {
        .ant-select-selection-overflow-item:not(.ant-select-selection-overflow-item-rest):not(.ant-select-selection-overflow-item-suffix):not(:last-child) {
            max-width: 80%;

            .ant-select-selection-item-content {
                &::after {
                    content: ',';
                }
            }
        }   
    } 

    .ant-select-multiple {
        .ant-select-arrow {
            width: 24px;
            height: 24px;
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translate(25%, -25%);
            color: ${(props) => props.theme.colors.primary.main};
        }
    }

    .ant-select-focused {
        .ant-select-selection-placeholder {
            display: none;
        }
    }

    .ant-select-multiple.ant-select-allow-clear {
        &:hover {
            .ant-select-arrow {
                visibility: hidden;
            }  
        }
    }

    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
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
            background-color: ${(props) => props.theme.colors.background.linkWater};
        }
    }

    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
        background-color: ${(props) => props.theme.colors.primary.light};

        .ant-select-item-option-state {
            color: ${(props) => props.theme.colors.primary.main};
        }
    }
`
export const TooltipContent = styled.ul`
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
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