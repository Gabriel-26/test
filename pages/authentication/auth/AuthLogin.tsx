import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import { JSX } from "@emotion/react/jsx-runtime";
import { useRouter } from "next/router";
import axios from "../../../src/components/utils/axiosInstance";
import useAuth from "../../../src/components/utils/useAuth"; // Correct path to useAuth

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [resident_userName, setResidentUserName] = useState("");
  const [resident_password, setResidentPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResidentUserName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResidentPassword(event.target.value);
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRememberMe(event.target.checked);
  };

  const handleSignIn = async () => {
    try {
      await login({
        resident_userName,
        resident_password,
      });

      const token = sessionStorage.getItem("authToken");
      console.log("Token:", token);
    } catch (error) {
      // Handle any login errors here, if needed
      console.error("Error occurred during login:", error);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}
      {subtext}

      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="resident_userName"
            mb="5px"
          >
            Username
          </Typography>
          <CustomTextField
            variant="outlined"
            fullWidth
            name="resident_userName"
            value={resident_userName}
            onChange={handleUsernameChange}
          />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="resident_password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField
            type="password"
            variant="outlined"
            fullWidth
            name="resident_password"
            value={resident_password}
            onChange={handlePasswordChange}
          />
        </Box>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
              }
              label="Remember this Device"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
