import type { ReactElement } from "react";
import { Grid, Box } from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";

// components
import FloorsList from "../src/components/dashboard/FloorsList";
import YearlyBreakup from "../src/components/dashboard/YearlyBreakup";
import RecentTransactions from "../src/components/dashboard/RecentTransactions";
import Doctors from "./doctors/residents";
// import Blog from "../src/components/dashboard/Blog";
import MonthlyEarnings from "../src/components/dashboard/MonthlyEarnings";
import FullLayout from "../src/layouts/full/FullLayout";

export default function Home() {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={4} lg={2}>
            <FloorsList />
          </Grid>
          {/* <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid> */}
          {/* <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid> */}
          <Grid item xs={12} lg={8}>
            <Doctors />
          </Grid>
          {/* <Grid item xs={12}>
            <Blog />
          </Grid> */}
        </Grid>
      </Box>
    </PageContainer>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
