import React from "react";
import { Typography, Grid } from "@mui/material";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import FaceIcon from "@mui/icons-material/Face";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DoorFront from "@mui/icons-material/DoorFront";
import PageContainer from "../container/PageContainer";

const residentsData = {
  totalResidents: 50,
  activeResidents: 38,
  inactiveResidents: 12,
};

const chiefResidentsData = {
  totalChiefResidents: 5,
  activeChiefResidents: 3,
  inactiveChiefResidents: 2,
};

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

const ResidentsOverviewPage = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <DashboardCard cardWidth={60} title="Residents Overview">
          <div style={centerContentStyle}>
            <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="body1">
              Total Residents: {residentsData.totalResidents}
            </Typography>
            <PersonIcon color="success" sx={{ fontSize: 40 }} />
            <Typography variant="body1">
              Active Residents: {residentsData.activeResidents}
            </Typography>
            <FaceIcon color="error" sx={{ fontSize: 40 }} />
            <Typography variant="body1">
              Inactive Residents: {residentsData.inactiveResidents}
            </Typography>
          </div>
        </DashboardCard>
      </Grid>
      <Grid item xs={12} sm={4}>
        <DashboardCard cardWidth={60} title="Chief Residents Overview">
          <div style={centerContentStyle}>
            <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="body1">
              Total Chief Residents: {chiefResidentsData.totalChiefResidents}
            </Typography>
            <PersonIcon color="success" sx={{ fontSize: 40 }} />
            <Typography variant="body1">
              Active Chief Residents: {chiefResidentsData.activeChiefResidents}
            </Typography>
            <FaceIcon color="error" sx={{ fontSize: 40 }} />
            <Typography variant="body1">
              Inactive Chief Residents:{" "}
              {chiefResidentsData.inactiveChiefResidents}
            </Typography>
          </div>
        </DashboardCard>
      </Grid>
      <Grid item xs={12} sm={4}>
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
    </Grid>
  );
};

export default ResidentsOverviewPage;
