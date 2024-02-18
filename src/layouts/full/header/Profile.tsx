import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import useAdminAuth from "../../../components/utils/useAdminAuth";
import useResidentAuth from "../../../components/utils/useResidentAuth";

// Import the images
import doctorMaleImage from "../../../assets/images/profile/doctorm.png";
import doctorFemaleImage from "../../../assets/images/profile/femaledoc.png";
import adminImage from "../../../assets/images/profile/admin.png";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userNameInitial, setUserNameInitial] = useState("");
  const [userGender, setUserGender] = useState(""); // Added state for user gender
  const [residentFName, setResidentFName] = useState(""); // Added state for resident first name
  const [residentLName, setResidentLName] = useState(""); // Added state for resident last name

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
    const storedResidentFName = localStorage.getItem("resFirstName"); // Retrieve resident first name
    const storedResidentLName = localStorage.getItem("resLastname"); // Retrieve resident last name

    if (storedUserRole) {
      setUserRole(storedUserRole);
    }

    if (storedUserName) {
      setUserNameInitial(storedUserName.charAt(0).toUpperCase());
    }

    if (storedUserGender) {
      setUserGender(storedUserGender);
    }

    if (storedResidentFName) {
      setResidentFName(storedResidentFName);
    }

    if (storedResidentLName) {
      setResidentLName(storedResidentLName);
    }
  }, []);

  const auth = userRole === "admin" ? useAdminAuth() : useResidentAuth();

  const handleLogout = async () => {
    await auth.logout();
  };

  // Set the image source based on user gender or default to admin image
  const avatarSrc =
    userGender === "Female"
      ? doctorFemaleImage.src
      : userGender === "Male"
      ? doctorMaleImage.src
      : adminImage.src;

  // Determine the name to display based on whether it's a resident or admin
  const maxLength = 20; // Maximum length for displaying the resident's name

  // Truncate the resident's name if it exceeds the maximum length
  const truncatedName =
    residentFName.length + residentLName.length > maxLength
      ? `${residentFName.substring(
          0,
          maxLength / 2
        )}... ${residentLName.substring(0, maxLength / 2)}`
      : `${residentFName} ${residentLName}`;

  // Determine the name to display based on whether it's a resident or admin
  const displayName = truncatedName || "Admin";

  // Display the role based on userRole
  // Display the role based on userRole
  const displayRole =
    userRole === "resident" || userRole === "chiefResident"
      ? userRole === "chiefResident"
        ? "Chief Resident"
        : "resident"
      : "";

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
          src={avatarSrc}
          alt="Avatar"
          sx={{
            width: 35,
            height: 35,
            backgroundColor: "primary.main",
          }}
        />
        {/* Display the user's name and role */}
        <Box sx={{ marginLeft: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="body1">{displayName}</Typography>
          {displayRole && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {displayRole}
            </Typography>
          )}
        </Box>
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
