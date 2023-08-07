import React from "react";
import { Typography, Grid } from "@mui/material";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import FaceIcon from "@mui/icons-material/Face";
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

const ResidentsOverviewPage = () => {
  return (
    <>
      <DashboardCard title="Residents Overview">
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
      </DashboardCard>

      <DashboardCard title="Chief Residents Overview">
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
          Inactive Chief Residents: {chiefResidentsData.inactiveChiefResidents}
        </Typography>
      </DashboardCard>
    </>
  );
};

export default ResidentsOverviewPage;
