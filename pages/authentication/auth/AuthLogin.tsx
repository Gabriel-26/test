import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { message } from "antd";

import Link from "next/link";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import { JSX } from "@emotion/react/jsx-runtime";
import { useRouter } from "next/router";
import useAdminAuth from "../../../src/components/utils/useAdminAuth";
import useResidentAuth from "../../../src/components/utils/useResidentAuth";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginType, setLoginType] = useState("admin"); // Default to admin login

  const adminAuth = useAdminAuth();
  const residentAuth = useResidentAuth();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRememberMe(event.target.checked);
  };

  const handleLoginTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginType(event.target.value);
  };

  const handleSignIn = async () => {
    try {
      let loginResult;

      if (loginType === "admin") {
        loginResult = await adminAuth.login({ username, password });
      } else {
        loginResult = await residentAuth.login({ username, password });
      }

      if (loginResult === "success") {
        // If the login was successful, set the token and redirect
        const token = sessionStorage.getItem("authToken");
        console.log("Token:", token);

        // Show a success message
        message.success("Login successful");

        // Redirect to the desired route (e.g., '/')
      } else {
        // Show an error message for unsuccessful login
        message.error("Wrong credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);

      // Show an error message for unexpected errors
      message.error("An error occurred during login. Please try again later.");
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

      <FormControl component="fieldset">
        <FormLabel component="legend">Login Type</FormLabel>
        <RadioGroup
          row
          aria-label="login-type"
          name="login-type"
          value={loginType}
          onChange={handleLoginTypeChange}
        >
          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
          <FormControlLabel
            value="resident"
            control={<Radio />}
            label="Resident"
          />
        </RadioGroup>
      </FormControl>

      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="5px"
          >
            {loginType === "admin" ? "Email" : "Username"}
          </Typography>
          <CustomTextField
            variant="outlined"
            fullWidth
            name="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            {loginType === "admin" ? "Password" : "Password"}
          </Typography>
          <CustomTextField
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            value={password}
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
          style={{
            backgroundColor: "blue",
          }}
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
