import styled from 'styled-components';

export const Container = styled.div`
    .ant-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .ant-checkbox-wrapper {
            padding: 14px 8px;
            border-radius: 16px;
            background-color: ${(props) => props.theme.colors.background.white};
            box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);

            .ant-checkbox {
                display: none;
            }

            span {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 20px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: 0.3px;
                color: ${(props) => props.theme.colors.text.main};

                svg.checked-icon {
                    display: none;
                    width: 22px;
                    height: 22px;
                }
            }
        }

        .ant-checkbox-wrapper + .ant-checkbox-wrapper {
            margin-left: 0;
        }

        .ant-checkbox-wrapper.ant-checkbox-wrapper-checked {
            background-color: ${(props) => props.theme.colors.primary.main};

            span {
                color: ${(props) => props.theme.colors.text.white};

                svg.checked-icon {
                    display: initial;
                }
            }
        }
    }
`;
