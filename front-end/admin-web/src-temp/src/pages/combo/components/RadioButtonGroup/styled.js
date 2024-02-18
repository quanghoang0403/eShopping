import styled from 'styled-components';

export const Container = styled.div`
    .ant-radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .ant-radio-button-wrapper {
            display: flex;
            align-items: center;
            height: 58px;
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: 0.3px;
            border: none;
            border-radius: 16px;
            color: ${(props) => props.theme.colors.text.main};
            background-color: ${(props) => props.theme.colors.background.white};
            box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);

            svg {
                display: none;
                width: 24px;
                height: 24px;
            }
        }

        .ant-radio-button-wrapper > span:not(.ant-radio-button) {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ant-radio-button-wrapper:not(:first-child)::before {
            width: 0;
            height: 0;
            display: none;
        }

        .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
            color: ${(props) => props.theme.colors.text.white};
            background-color: ${(props) => props.theme.colors.primary.main};
            border-color: ${(props) => props.theme.colors.primary.main};

            svg {
                display: block;
            }
        }
    }
`;


