import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { IconBellRinging } from "@tabler/icons-react";

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notifications = [
    // Add your notification data here
    { id: 1, text: "New notification 1" },
    { id: 2, text: "New notification 2" },
    { id: 3, text: "New notification 3" },
    { id: 4, text: "New notification 3" },
  ];

  return (
    <div>
      <IconButton
        size="large"
        aria-label="show notifications"
        color="inherit"
        aria-controls="notifications-menu"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <Badge badgeContent={notifications.length} color="primary">
          <IconBellRinging size="21" stroke="1.5" />
        </Badge>
      </IconButton>
      <Popover
        id="notifications-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} onClick={handleClose} button>
              <ListItemText primary={notification.text} />
            </ListItem>
          ))}
        </List>
        {notifications.length === 0 && (
          <Typography variant="body2" color="textSecondary" align="center">
            No new notifications.
          </Typography>
        )}
      </Popover>
    </div>
  );
};

export default NotificationDropdown;
