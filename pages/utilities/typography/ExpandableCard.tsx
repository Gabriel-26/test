import React, { ReactNode, useState } from "react";
import {
  CardActions,
  CardContent,
  Collapse,
  Fab,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ExpandableCard = ({ children }: { children: ReactNode }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <Typography variant="h6">{}</Typography>
      <CardActions disableSpacing>
        <ExpandMoreIcon
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ cursor: "pointer" }}
        />
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{children}</CardContent>
      </Collapse>
    </div>
  );
};

export default ExpandableCard;
