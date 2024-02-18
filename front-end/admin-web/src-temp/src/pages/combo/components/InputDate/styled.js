import styled from 'styled-components';

export const Container = styled.div`
    .ant-picker {
        height: 60px;
        border-color: ${(props) => props.theme.colors.text.timberwolf};
        border: 1px solid ${(props) => props.theme.colors.common.white} !important;
        border-radius: 16px;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25) !important;

        .ant-picker-input > input {
            font-size: 18px;
            font-style: normal;
            font-weight: 400;
            line-height: 21px;
            letter-spacing: 0.3px;
            color: ${(props) => props.theme.colors.shadowColor};
            width: calc(100% - 80px);
        }

        .ant-picker-input {
            display: initial;

            .ant-picker-clear {
                position: absolute;
                top: 50%;
                right: 34px;
            }

            .ant-picker-suffix {
                display: initial;
                position: absolute;
                top: 50%;
                right: 0px;
                transform: translate(0%, -50%);

                svg {
                    width: 24px;
                    height: 24px;
                }
            }
        }

    }

    .ant-picker.ant-picker-focused {
        box-shadow: none;
    }
`;


export const AllowClear = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: ${(props) => props.theme.colors.background.white};
    border-right: 1px solid ${(props) => props.theme.colors.text.timberwolf};

    svg {
        width: 24px;
        height: 24px;
    }
`;

export const PanelContainer = styled.div`
    .ant-picker-date-panel,
    .ant-picker-time-panel {
        width: 330px;
    }

    .ant-picker-date-panel .ant-picker-content {
        width: 100%;
    }

    .ant-picker-header * {
        color: ${(props) => props.theme.colors.text.white}; 
    }

    .ant-picker-header-view button {
        font-weight: 500;
        font-size: 16px;
        color: ${(props) => props.theme.colors.text.white};
    }

    .ant-picker-content thead th {
        font-weight: 600;
        font-size: 16px;
    }

    .ant-picker-cell-selected > div.ant-picker-cell-inner {
        border-radius: 50%;
    }

    .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
        border-radius: 50%;
    }

    .ant-picker-content th, .ant-picker-content td {
        min-width: 35px;
        font-size: 16px;
        font-weight: 400;
    }

    .ant-picker-cell .ant-picker-cell-inner {
        min-width: 35px;
        height: 35px;
        line-height: 35px;
    }

    .ant-picker-panel .ant-picker-footer {
        padding: 5px;
    }
    .ant-picker-today-btn {
        font-size: 16px;
        font-weight: 500;
    }
`;


