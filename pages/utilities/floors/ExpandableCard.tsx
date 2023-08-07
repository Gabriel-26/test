import React, { ReactNode, useState } from "react";
import {
  CardActions,
  CardContent,
  Collapse,
  Fab,
  Typography,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ExpandableCard = ({
  subheader,
  children,
}: {
  subheader: string;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <CardActions disableSpacing>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Typography className="font-bold ml-1 text-xs">
              {subheader}
            </Typography>
          </Grid>
          <Grid item>
            <ExpandMoreIcon
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              sx={{
                cursor: "pointer",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </Grid>
        </Grid>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{children}</CardContent>
      </Collapse>
    </div>
  );
};

export default ExpandableCard;
