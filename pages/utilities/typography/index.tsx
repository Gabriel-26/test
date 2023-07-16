import type { ReactElement } from "react";
import { Fab, Typography } from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import FullLayout from "../../../src/layouts/full/FullLayout";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import CardActions from "@mui/material/CardActions";
import NavigationIcon from "@mui/icons-material/Navigation";
import ShareIcon from "@mui/icons-material/Share";
import CardContent from "@mui/material/CardContent";
import ExpandableCard from "./ExpandableCard";

// const navigateButtons = Array.from(Array(23), (_, index) => index + 1);

const Floors = () => {
  const annexAButtons = Array.from(Array(23), (_, index) => ({
    label: ` 0${index + 0o1}`,
  }));
  const annexBButtons = Array.from(Array(14), (_, index) => ({
    label: `${index + 101}`,
  }));
  const annexC1Buttons = Array.from(Array(16), (_, index) => ({
    label: `Room ${index + 201}`,
  }));
  const annexC2Buttons = Array.from(Array(20), (_, index) => ({
    label: `Room${index + 212}`,
  }));
  const annexC3Buttons = Array.from(Array(9), (_, index) => ({
    label: `Room ${index + 232}`,
  }));
  const annexD1Buttons = Array.from(Array(23), (_, index) => ({
    label: `Room 0${index + 0o1}`,
  }));

  annexAButtons[17].label = "18SR";
  annexC2Buttons[0].label = "SR1";
  annexC2Buttons[1].label = "SR2";
  annexC2Buttons[2].label = "SR3";
  annexC2Buttons[3].label = "SR4";
  annexC2Buttons[4].label = "SR5";

  annexC3Buttons[0].label = "32W(ABC)";
  annexC3Buttons[3].label = "35W(ABC)";
  annexC3Buttons[4].label = "36W(ABC)";
  annexC3Buttons[8].label = "SR7";

  return (
    <div>
      <PageContainer title="Annex A" description="this is Sample page">
        <DashboardCard title="Annex A">
          <ExpandableCard>
            <Typography>This is a sample page</Typography>
            {annexAButtons.map((buttonIndex) => (
              <Fab key={buttonIndex.label} variant="extended">
                Room {buttonIndex.label}
              </Fab>
            ))}
          </ExpandableCard>
        </DashboardCard>
      </PageContainer>

      <PageContainer title="Annex B" description="this is Sample page">
        <DashboardCard title="Annex B">
          <ExpandableCard>
            <Typography>This is a sample page</Typography>
            {annexBButtons.map((buttonIndex) => (
              <Fab key={buttonIndex.label} variant="extended">
                Room {buttonIndex.label}
              </Fab>
            ))}
          </ExpandableCard>
        </DashboardCard>
      </PageContainer>

      <PageContainer title="Annex C1" description="this is Sample page">
        <DashboardCard title="Annex C1">
          <ExpandableCard>
            <Typography>This is a sample page</Typography>
            {annexC1Buttons.map((buttonIndex) => (
              <Fab key={buttonIndex.label} variant="extended">
                {buttonIndex.label}
              </Fab>
            ))}
          </ExpandableCard>
        </DashboardCard>
      </PageContainer>

      <PageContainer title="Annex C2" description="this is Sample page">
        <DashboardCard title="Annex C2">
          <ExpandableCard>
            <Typography>This is a sample page</Typography>
            {annexC2Buttons.map((buttonIndex) => (
              <Fab key={buttonIndex.label} variant="extended">
                {buttonIndex.label}
              </Fab>
            ))}
          </ExpandableCard>
        </DashboardCard>
      </PageContainer>

      <PageContainer title="Annex C3" description="this is Sample page">
        <DashboardCard title="Annex C3">
          <ExpandableCard>
            <Typography>This is a sample page</Typography>
            {annexC3Buttons.map((buttonIndex) => (
              <Fab key={buttonIndex.label} variant="extended">
                {buttonIndex.label}
              </Fab>
            ))}
          </ExpandableCard>
        </DashboardCard>
      </PageContainer>

      <PageContainer title="Annex D1" description="this is Sample page">
        <DashboardCard title="Annex D1">
          <ExpandableCard>
            <Typography>This is a sample page</Typography>
            {annexD1Buttons.map((buttonIndex) => (
              <Fab key={buttonIndex.label} variant="extended">
                {buttonIndex.label}
              </Fab>
            ))}
          </ExpandableCard>
        </DashboardCard>
      </PageContainer>
    </div>
  );
};

export default Floors;
Floors.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
