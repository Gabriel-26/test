import { ReactElement, ReactNode, useEffect, useState } from "react";
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
import { useRouter } from "next/router";

import LoadingComponent from "./loading"; // Import your LoadingComponent

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
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    const simulateLoading = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a 5-second delay
      setLoading(false); // Authentication check is complete
    };

    if (!authToken || !userRole) {
      simulateLoading().then(() => router.push("/authentication/login"));
    } else {
      simulateLoading();
    }
  }, []); // This effect runs only once when the component mounts

  // If loading is true, display the loading component; otherwise, display the actual content
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>IPIMS</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading ? (
          <LoadingComponent />
        ) : (
          getLayout(<Component {...pageProps} />)
        )}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
