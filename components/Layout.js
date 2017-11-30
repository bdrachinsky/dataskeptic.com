import Head from 'next/head'
import React from 'react';
import Header from "./Header";
import Container from "./Container";

import theme from '../shared/styles'
import {ThemeProvider, injectGlobal} from 'styled-components'

injectGlobal`
  @font-face {
    font-family: 'SF Light';
    src: url('/static/fonts/SFUIDisplay-Light.otf');
  }
  @font-face {
    font-family: 'SF Regular';
    src: url('/static/fonts/SFUIDisplay-Regular.otf');
  }
  @font-face {
    font-family: 'SF Medium';
    src: url('/static/fonts/SFUIDisplay-Medium.otf');
  }
  * {
    font-family: 'SF Regular';
  }
`;

const Layout = (props) => (
    <ThemeProvider theme={theme}>
        <div>
            <Head>
                <title>DataSkeptic</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" rel="stylesheet" />
            </Head>
            <Header/>
                {props.children}
        </div>
    </ThemeProvider>)
export default Layout