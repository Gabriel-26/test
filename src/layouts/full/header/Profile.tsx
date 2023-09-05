import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconListCheck, IconMail, IconUser } from "@tabler/icons-react";
import useAuth from "../../../components/utils/useResidentAuth"; // Correct path to useAuth
import useAdminAuth from "../../../components/utils/useAdminAuth";
import useResidentAuth from "../../../components/utils/useResidentAuth";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [userRole, setUserRole] = useState("");

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  useEffect(() => {
    // Access sessionStorage within a useEffect to ensure it's run on the client side
    const storedUserRole = sessionStorage.getItem("userRole");

    // Check if userRole is present in sessionStorage
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []); // Empty dependency array ensures it runs on

  // Use the appropriate authentication module based on the user's role
  const auth = userRole === "admin" ? useAdminAuth() : useResidentAuth();

  const handleLogout = async () => {
    await auth.logout(); // Call the appropriate logout function based on the user's role
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src="/images/profile/user-2.png"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        {/* <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem> */}
        <Box mt={1} py={1} px={2}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
