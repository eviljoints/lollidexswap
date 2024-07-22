import * as React from 'react';
import styled, { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from 'styled-components';
import { Text } from 'rebass';
import { useDarkModeManager } from '~/contexts/LocalStorage'; // Ensure this path is correct
import { sm, med, lg, xl, twoXl } from '~/constants/breakpoints';

const theme = (darkMode) => ({
    mode: 'light', // Force light mode for both light and dark modes

    text1: '#1F1F1F',
    text2: '#565A69',
    text3: '#888D9B',
    text4: '#C3C5CB',
    text5: '#EDEEF2',

    white: '#FFFFFF',

    bg1: '#F5E8F4',
    bg2: '#FFD1DC',
    bg3: '#FFE0E6',
    bg4: '#FFB6C1',
    bg5: '#FF69B4',
    bg6: '#FFFFFF',
    bg7: 'rgba(252,252,251,0.8)',

    background: 'linear-gradient(180deg, #F5E8F4 20%, #FFD1DC 30%, #FFB6C1 60% )', // Updated background
    advancedBG: 'rgba(255,255,255,0.4)',
    divider: 'rgba(43, 43, 43, 0.035)',

    primary1: '#FF69B4',

    red1: '#FF6871',
    green1: '#27AE60',
    link: '#2172E5',
    blue: '#2f80ed',

    shadowSm: '0 1px 2px 0 rgba(255, 255, 0, 0.05)', // yellow shadow
    shadow: '0 1px 3px 0 rgba(255, 255, 0, 0.1), 0 1px 2px -1px rgba(255, 255, 0, 0.1)', // yellow shadow
    shadowMd: '0 4px 6px -1px rgba(255, 255, 0, 0.1), 0 2px 4px -2px rgba(255, 255, 0, 0.1)', // yellow shadow
    shadowLg: '0 10px 15px -3px rgba(255, 255, 0, 0.1), 0 4px 6px -4px rgba(255, 255, 0, 0.1)', // yellow shadow

    bpSm: `${sm}rem`,
    bpMed: `${med}rem}`,
    bpLg: `${lg}rem`,
    bpXl: `${xl}rem`,
    bp2Xl: `${twoXl}rem`,

    maxSm: `@media screen and (max-width: ${sm}rem)`,
    maxMed: `@media screen and (max-width: ${med}rem)`,
    maxLg: `@media screen and (max-width: ${lg}rem)`,
    maxXl: `@media screen and (max-width: ${xl}rem)`,

    minSm: `@media screen and (min-width: ${sm}rem)`,
    minMed: `@media screen and (min-width: ${med}rem)`,
    minLg: `@media screen and (min-width: ${lg}rem)`,
    minXl: `@media screen and (min-width: ${xl}rem)`,
    min2Xl: `@media screen and (min-width: ${twoXl}rem)`,

    breakpoints: [`${sm}rem`, `${med}rem`, `${lg}rem`, `${xl}rem`]
});

const TextWrapper = styled(Text)`
	color: ${({ color, theme }) => theme[color]};
`;

export const TYPE = {
    heading(props) {
        return <TextWrapper fontWeight={500} fontSize={16} color={'text1'} {...props} />;
    },

    main(props) {
        return <TextWrapper fontWeight={500} fontSize={14} color={'text1'} {...props} />;
    },

    body(props) {
        return <TextWrapper fontWeight={400} fontSize={14} color={'text1'} {...props} />;
    },

    largeHeader(props) {
        return <TextWrapper fontWeight={500} color={'text1'} fontSize={24} {...props} />;
    }
};

export const Header = styled.h1`
	color: ${({ theme }) => theme['text1']};
	font-size: 24px;
	font-weight: 500;
	margin: 0 0 -20px;
`;

export const GlobalStyle = createGlobalStyle`
  body, #__next {
    background: linear-gradient(130deg, #F5E8F4 20%, #FFD1DC 30%, #FFB6C1 60% ), url('/image.png');
    background-size: cover, 20px 20px;
    background-repeat: no-repeat, repeat;
    position: relative;
    min-height: 100%;
  }

  #__next {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    position: relative;
    color: ${({ theme }) => theme.text1};
    isolation: isolate;

    ${({ theme: { minLg } }) => minLg} {
      flex-direction: row;
    }
  }

  a, input, button, textarea, select {
    &:focus-visible {
      outline: 1px solid ${({ theme }) => theme.text1};
    }
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .tooltip-trigger {
    color: ${({ theme }) => theme.text1};
    display: flex;
    align-items: center;
    padding: 0;

    :focus-visible {
      outline-offset: 2px;
    }
  }

  .tooltip-trigger a {
    display: flex;
  }
`;

export default function ThemeProvider({ children }) {
    const [darkMode] = useDarkModeManager();
    return <StyledComponentsThemeProvider theme={theme(darkMode)}>{children}</StyledComponentsThemeProvider>;
}
