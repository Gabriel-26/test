import { ReactElement, ReactNode, useEffect } from "react";
import "/globals.css";
import type { NextPage } from "next";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../src/createEmotionCache";
import { baselightTheme } from "../src/theme/DefaultColors";
import axiosInstance from "../src/components/utils/axiosInstance";
import { useRouter } from "next/router"; // Import useRouter

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const theme = baselightTheme;
  const router = useRouter(); // Initialize the router

  const getLayout = Component.getLayout ?? ((page) => page);

  // useEffect(() => {
  //   // Check if there is a token in sessionStorage
  //   const token = sessionStorage.getItem("token");

  //   // If token is not found, redirect to the login page
  //   if (!token) {
  //     router.push("/authentication/login"); // Redirect to your login page
  //   }
  // }, []); // The empty dependency array means this effect runs only once, on component mount

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>IPIMS</title>
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
