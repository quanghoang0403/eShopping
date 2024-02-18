import styled from 'styled-components';
import { variants } from '../variants';

export const Container = styled.div`
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
                display: ${(props) => props?.selectedAll ? 'none' : 'initial'};
                color: ${(props) => props.theme.colors.primary.main};
                
                svg {
                    width: 14px;
                    height: 14px;
                }
            }
        }
    }

    .ant-select-selection-overflow {
        max-width: 100%;
        
        .ant-select-selection-overflow-item:not(.ant-select-selection-overflow-item-rest):not(.ant-select-selection-overflow-item-suffix):not(:last-child) {
            max-width: 80%;

            &:hover {
                .ant-select-selection-item-content {
                    &::after {
                        display: none;
                    }
                } 
            }

            .ant-select-selection-item-content {
                &::after {
                    content: ',';
                    display: ${(props) => props?.selectedAll ? 'none' : 'initial'};
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

        .ant-select-clear {
            display: ${(props) => props?.selectedAll ? 'none' : 'initial'};
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
                visibility: ${(props) => props?.selectedAll ? 'initial' : 'hidden'};;
            }  
        }
    }
`;

export const Menus = styled.div`
    width: calc(30vw - 64px);
    margin: 8px;

    .ant-select-item-option:not(.ant-select-item-option-grouped) {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        margin: 0;
        border-radius: 12px;

        &:hover {
            background-color: ${(props) => props.theme.colors.background.fog} !important;
        }
    }

    .ant-select-item.ant-select-item-group {
        padding: 16px;
        margin: 0;
        border-radius: 12px;
    }

    .ant-select-item-option.ant-select-item-option-grouped {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        margin-left: calc(80px + 16px);
        margin-right: 0;
        margin-bottom: 6px;
        border-radius: 12px;
        background-color: ${(props) => props.theme.colors.primary.light} !important;
        margin-right: 20px;

        &:hover {
            background-color: ${(props) => props.theme.colors.background.fog} !important;
        }
    }

    .ant-select-item-option:not(.ant-select-item-option-selected) {
        &::after {
            content: "";
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 8px;
            padding: 0 11px;
            background-color: ${(props) => props.theme.colors.common.white};
            border: 2px solid ${(props) => props.theme.colors.secondary.main};
        }
    }

    .ant-select-item-option:not(.ant-select-item-option-grouped):not(.ant-select-item-option-selected) {
        &::after {
            margin-right: 20px;
        }
    }

    .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
        background-color: ${(props) => props.theme.colors.background.white};
    }

    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
        background-color: ${(props) => props.theme.colors.background.white};

        .ant-select-item-option-state {
            width: 24px;
            height: 24px;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: ${(props) => props.theme.colors.text.white};
            background-color: ${(props) => props.theme.colors.text.carrotOrange};
            border: 2px solid ${(props) => props.theme.colors.text.carrotOrange};

            .anticon-check {
            font-size: 14px;
            }
        }
    }

    .ant-select-item-option-selected:not(.ant-select-item-option-grouped):not(.ant-select-item-option-disabled) {
        .ant-select-item-option-state {
            margin-right: 20px;
        }
    }

    @media screen and (max-width: ${variants.screen.xxl}) {
        width: calc(40vw - 64px);
    }

    @media screen and (max-width: ${variants.screen.xl}) {
        width: calc(45vw - 64px);
    }

    @media screen and (max-width: ${variants.screen.lg}) {
        width: calc(60vw - 64px);
    }

    @media screen and (max-width: ${variants.screen.md}) {
        width: calc(80vw - 64px);
    }

    @media screen and (max-width: ${variants.screen.sm}) {
        width: 100vw;
    }
`;

export const TooltipContent = styled.ul`
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: left;
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

export const GroupVariants = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;

    img {
        width: 80px;
        height: 80px;
        border-radius: 12px;
    }

    span {
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        color: ${(props) => props.theme.colors.text.violentViolet};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`

export const ProductHasVariants = styled.div`
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    color: ${(props) => props.theme.colors.text.violentViolet};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const ProductNoneVariants = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;

    img {
        width: 80px;
        height: 80px;
        border-radius: 12px;
    }

    span {
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        color: ${(props) => props.theme.colors.text.violentViolet};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`

export const AllProduts = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;

    span {
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        color: ${(props) => props.theme.colors.text.violentViolet};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`