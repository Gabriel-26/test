import React, { useEffect, useState } from "react";
import { Avatar, Box, Menu, Button, IconButton, MenuItem } from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import useAdminAuth from "../../../components/utils/useAdminAuth";
import useResidentAuth from "../../../components/utils/useResidentAuth";

// Import the image
import doctorMaleImage from "../../../assets/images/profile/doctorm.png";
import doctorFemaleImage from "../../../assets/images/profile/femaledoc.png";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userNameInitial, setUserNameInitial] = useState("");
  const [userGender, setUserGender] = useState(""); // Added state for user gender

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    const storedUserName = localStorage.getItem("userN");
    const storedUserGender = localStorage.getItem("userGender"); // Retrieve user gender

    if (storedUserRole) {
      setUserRole(storedUserRole);
    }

    if (storedUserName) {
      setUserNameInitial(storedUserName.charAt(0).toUpperCase());
    }

    if (storedUserGender) {
      setUserGender(storedUserGender);
    }
  }, []);

  const auth = userRole === "admin" ? useAdminAuth() : useResidentAuth();

  const handleLogout = async () => {
    await auth.logout();
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
        {/* Conditionally render the Avatar based on user gender */}
        <Avatar
          src={
            userGender === "Female"
              ? doctorFemaleImage.src
              : doctorMaleImage.src
          }
          alt="Doctor"
          sx={{
            width: 35,
            height: 35,
            backgroundColor: "primary.main",
          }}
        />
      </IconButton>
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
        <Box mt={1} py={1} px={2}>
          <Button
            variant="outlined"
            s
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
