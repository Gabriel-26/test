import React from "react";
import { Typography, Container, Grid } from "@mui/material";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DoorFront from "@mui/icons-material/DoorFront";
import PageContainer from "../container/PageContainer";

const roomsData = {
  totalRooms: 30,
  occupiedRooms: 20,
  vacantRooms: 10,
};

const centerContentStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "100%",
} as React.CSSProperties;

const RoomsOverviewPage = () => {
  return (
    <Grid item xs={10} sm={6}>
      <DashboardCard cardWidth={60} title="Rooms Overview">
        <div style={centerContentStyle}>
          <HotelIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="body1">
            Total Rooms: {roomsData.totalRooms}
          </Typography>
          <BathtubIcon color="success" sx={{ fontSize: 40 }} />
          <Typography variant="body1">
            Occupied Rooms: {roomsData.occupiedRooms}
          </Typography>
          <DoorFront color="error" sx={{ fontSize: 40 }} />
          <Typography variant="body1">
            Vacant Rooms: {roomsData.vacantRooms}
          </Typography>
        </div>
      </DashboardCard>
    </Grid>
  );
};

export default RoomsOverviewPage;
