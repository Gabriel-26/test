import { ReactElement, useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";
import Link from "next/link";

// components
import ResidentsOverview from "../src/components/dashboard/ResidentsOverview";
import RoomsOverview from "../src/components/dashboard/RoomsOverview";
import RoomUpdates from "../src/components/dashboard/Updates";
// import ChiefResidentsOverview from "../src/components/dashboard/ChiefResidentsOverview"; // Add this import for the Chief Resident view
import FullLayout from "../src/layouts/full/FullLayout";
import { getUserRole } from "../src/components/utils/roles";
import FloorList from "../src/components/dashboard/FloorsList";

export default function Home() {
  const userRole = getUserRole(); // Get the user's role directly using your function

  const [renderButton, setRenderButton] = useState(false);

  useEffect(() => {
    // Check user role and conditionally render the button on the client side
    if (userRole === "chiefResident") {
      setRenderButton(true);
    }
  }, [userRole]);
  return (
    <PageContainer title="Dashboard" description="This is Dashboard">
      <Box>
        <Grid container spacing={2} columns={12}>
          <Grid item xs={12}>
            {renderButton && (
              <Link href="/EHR">
                <button>Add New Patient</button>
              </Link>
            )}
          </Grid>
          <Grid item xs={12} lg={10}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ResidentsOverview />
              </Grid>
              <Grid item xs={12}>
                <RoomUpdates />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
