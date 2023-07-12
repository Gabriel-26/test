import type { ReactElement } from "react";
import { Fab, Typography } from "@mui/material";
import PageContainer from "../../src/components/container/PageContainer";
import DashboardCard from "../../src/components/shared/DashboardCard";
import FullLayout from "../../src/layouts/full/FullLayout";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import CardActions from "@mui/material/CardActions";
import NavigationIcon from "@mui/icons-material/Navigation";
import ShareIcon from "@mui/icons-material/Share";
import CardContent from "@mui/material/CardContent";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const navigateButtons = Array.from(Array(23), (_, index) => index + 1);

const SamplePage = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <div>
      <PageContainer title="Annex A" description="this is Sample page">
        <DashboardCard title="Annex A">
          <Typography>This is a sample page</Typography>
          <CardActions disableSpacing>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more1"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {navigateButtons.map((buttonIndex) => (
                <Fab key={buttonIndex} variant="extended">
                  <NavigationIcon sx={{ mr: 1 }} />
                  Navigate {buttonIndex}
                </Fab>
              ))}
            </CardContent>
          </Collapse>
        </DashboardCard>
      </PageContainer>

      <PageContainer title="Annex B" description="this is Sample page">
        <DashboardCard title="Annex B">
          <Typography>This is a sample page</Typography>
          <CardActions disableSpacing>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {navigateButtons.map((buttonIndex) => (
                <Fab key={buttonIndex} variant="extended">
                  <NavigationIcon sx={{ mr: 1 }} />
                  Navigate {buttonIndex}
                </Fab>
              ))}
            </CardContent>
          </Collapse>
        </DashboardCard>
      </PageContainer>

      <PageContainer title="Sample Page" description="this is Sample page">
        <DashboardCard title="Annex C1">
          <Typography>This is a sample page</Typography>
        </DashboardCard>
      </PageContainer>
      <PageContainer title="Sample Page" description="this is Sample page">
        <DashboardCard title="Floor 2">
          <Typography>This is a sample page</Typography>
        </DashboardCard>
      </PageContainer>
    </div>
  );
};

export default SamplePage;
SamplePage.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
