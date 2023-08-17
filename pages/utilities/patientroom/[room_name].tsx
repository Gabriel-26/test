import React, { useState, useEffect, ReactElement } from "react";
import { Paper, Box, Grid } from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import FullLayout from "../../../src/layouts/full/FullLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import PatientInfo from "./PatientInfo";
import { useRouter } from "next/router";
import { Drawer, Button } from "@mui/material";
import EditForm2 from "./EditForm2";
import PatientHistory from "./PatientHistory";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: "60px",
}));

const darkTheme = createTheme({ palette: { mode: "dark" } });
const lightTheme = createTheme({ palette: { mode: "light" } });

const RoomView = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { room_name: queryRoomName } = router.query; // Get the room_name from query parameters

  const handleEditClick = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <PageContainer
      title={queryRoomName || "(Room Name)"}
      description="this is Shadow"
    >
      <DashboardCard title={queryRoomName || "(Room Name)"}>
        <Tabs
          defaultValue="account"
          className="min-w-[600px] w-full md:w-[90%]"
        >
          <TabsList>
            <TabsTrigger value="account">Patient Info</TabsTrigger>
            <TabsTrigger value="password">Patient History</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <PatientInfo />
          </TabsContent>
          <TabsContent value="password">
            <PatientHistory />
          </TabsContent>
        </Tabs>
        {/* <Button variant="outlined" onClick={handleEditClick}>
          Edit Patient Data
        </Button>
        <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
          {/* Inside the drawer, display your editable form 
          <EditForm2 />
          {/* <EditForm onClose={handleCloseDrawer} /> 
        </Drawer> */}
      </DashboardCard>
    </PageContainer>
  );
};

export default RoomView;
RoomView.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
