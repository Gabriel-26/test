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
import useFloorStore from "../src/components/utils/zustandStore";
import axiosInstance from "../src/components/utils/axiosInstance";

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

  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    // Fetch floors data during SSR and set it in the Zustand store
    // Replace fetchFloors with your actual function to fetch the floors
    const fetchFloors = async () => {
      try {
        const response = await axiosInstance.get("/floors"); // Replace with your API endpoint
        const floorsData = response.data;
        useFloorStore.getState().setFloors(floorsData); // Set the floors in the store
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };

    fetchFloors();
  }, []);

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
