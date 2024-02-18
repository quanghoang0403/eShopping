import styled from 'styled-components';
import { variants } from '../variants';

export const Container = styled.div`
    width: 30vw;
    padding: 24px;
    border-radius: 16px;
    background-color: ${(props) => props.theme.colors.mainMenu.background};
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);

    @media screen and (max-width: ${variants.screen.xxl}) {
        width: 40vw;
    }

    @media screen and (max-width: ${variants.screen.xl}) {
        width: 45vw;
    }

    @media screen and (max-width: ${variants.screen.lg}) {
        width: 60vw;
    }

    @media screen and (max-width: ${variants.screen.md}) {
        width: 80vw;
    }

    @media screen and (max-width: ${variants.screen.sm}) {
        width: 100vw;
    }
`;

export const Label = styled.div`
    height: 60px;
    display: flex;
    align-items: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 21px;
    letter-spacing: 0.3px;
    color: ${(props) => props.theme.colors.primary.main};
`;

export const ResetFilter = styled.div`
    display: flex;
    justify-content: flex-end;
    pointer-events: ${(props) => props?.disable ? 'none' : ''};

    span {
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 21px;
        letter-spacing: 0.3px;
        text-decoration-line: underline;
        color: ${(props) => props?.disable ? props.theme.colors.text.placeholder : props.theme.colors.text.slateBlue};
        cursor: pointer;
    }
`;