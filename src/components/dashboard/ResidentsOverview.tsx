import React, { useState, useEffect } from "react";
import { Typography, Grid } from "@mui/material";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import FaceIcon from "@mui/icons-material/Face";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DoorFront from "@mui/icons-material/DoorFront";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { getUserRole } from "../utils/roles";

const centerContentStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "100%",
} as React.CSSProperties;

const ResidentsOverviewPage = () => {
  const [residentsData, setResidentsData] = useState({
    totalResidents: 0,
    activeResidents: 0,
    inactiveResidents: 0,
  });

  const [chiefResidentsData, setChiefResidentsData] = useState({
    totalChiefResidents: 0,
    activeChiefResidents: 0,
    inactiveChiefResidents: 0,
  });

  const [roomsData, setRoomsData] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    vacantRooms: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        // Assuming you have a function to get the user's role
        const userRole = getUserRole(); // Implement this function

        let residentsEndpoint = "/residents";
        let chiefResidentsEndpoint = "/residents";
        let roomsEndpoint = "/your-rooms-api-endpoint";

        // If the user is an admin, prefix the endpoints with /admin
        if (userRole === "admin") {
          residentsEndpoint = "/admin" + residentsEndpoint;
          chiefResidentsEndpoint = "/admin" + chiefResidentsEndpoint;
          roomsEndpoint = "/admin" + roomsEndpoint;
        }

        const residentsResponse = await axiosInstance.get(residentsEndpoint);
        const activeResidents = residentsResponse.data.filter(
          (resident) => resident.role === "resident" && resident.isActive
        );
        const inactiveResidents = residentsResponse.data.filter(
          (resident) => resident.role === "resident" && !resident.isActive
        );

        setResidentsData({
          totalResidents: residentsResponse.data.length,
          activeResidents: activeResidents.length,
          inactiveResidents: inactiveResidents.length,
        });

        const chiefResidents = residentsResponse.data.filter(
          (resident) => resident.role === "chiefResident"
        );
        const activeChiefResidents = chiefResidents.filter(
          (chiefResident) => chiefResident.isActive
        );
        const inactiveChiefResidents = chiefResidents.filter(
          (chiefResident) => !chiefResident.isActive
        );

        setChiefResidentsData({
          totalChiefResidents: chiefResidents.length,
          activeChiefResidents: activeChiefResidents.length,
          inactiveChiefResidents: inactiveChiefResidents.length,
        });

        // const roomsResponse = await axiosInstance.get(roomsEndpoint);
        // setRoomsData({
        //   totalRooms: roomsResponse.data.totalRooms,
        //   occupiedRooms: roomsResponse.data.occupiedRooms,
        //   vacantRooms: roomsResponse.data.vacantRooms,
        // });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
