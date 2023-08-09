import type { ReactElement } from "react";
import { Grid, Box } from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";

// components
import FloorsList from "../src/components/dashboard/FloorDrawer";
import ResidentsOverview from "../src/components/dashboard/ResidentsOverview";
import RoomsOverview from "../src/components/dashboard/RoomsOverview";
import Doctors from "./doctors/residents";
// import Blog from "../src/components/dashboard/Blog";
import RoomUpdates from "../src/components/dashboard/Updates";
import FullLayout from "../src/layouts/full/FullLayout";

export default function Home() {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          {/* <Grid item xs={4} lg={2}>
            <FloorsList />
          </Grid> */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ResidentsOverview />
              </Grid>
              <Grid item xs={12}>
                <RoomUpdates />
              </Grid>
            </Grid>
          </Grid>

          <RoomsOverview />

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
