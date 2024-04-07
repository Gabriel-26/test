import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "../../../components/utils/axiosInstance";
import Profile from "./Profile";
import { IconBellRinging, IconMenu } from "@tabler/icons-react";
import NotificationDropdown from "./notifications";
interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const [loggedInUserName, setLoggedInUserName] = useState("");

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: "#FFFFFF",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));
  const ThickDivider = styled(Divider)(({ theme }) => ({
    borderBottom: `4px solid ${theme.palette.divider}`, // Adjust thickness and color as needed
  }));
  return (
    <>
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileSidebar}
            sx={{
              display: {
                lg: "none",
                xs: "inline",
              },
            }}
          >
            <IconMenu width="20" height="20" />
          </IconButton>
          {/* <IconButton
      size="large"
      aria-label="show 11 new notifications"
      color="inherit"
      aria-controls="msgs-menu"
      aria-haspopup="true"
    >
      <Badge variant="dot" color="primary">
        <IconBellRinging size="21" stroke="1.5" />
      </Badge>
    </IconButton> */}
          <NotificationDropdown />
          <Box flexGrow={1} />
          {/* Adjust the height to your desired space */}
          {/* <Stack spacing={1} direction="row" alignItems="center"> */}
          {/* @ts-ignore */}
          <Profile loggedInUserName={loggedInUserName} />{" "}
          {/* Pass the username as prop */}
          {/* </Stack> */}
        </ToolbarStyled>
      </AppBarStyled>
      <ThickDivider />
    </>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
