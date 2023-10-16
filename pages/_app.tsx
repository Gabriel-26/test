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

  useEffect(() => {
    // Check if the user is not logged in (no authToken or role in sessionStorage)
    const authToken = sessionStorage.getItem("authToken");
    const userRole = sessionStorage.getItem("userRole");

    if (!authToken || !userRole) {
      // Redirect to the login page if not logged in
      router.push("/authentication/login");
    }
  }, []); // This effect runs only once when the component mounts

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
