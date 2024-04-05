import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Switch,
  Button,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { message } from "antd";
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
  const [loginType, setLoginType] = useState("admin");
  const adminAuth = useAdminAuth();
  const residentAuth = useResidentAuth();
  const router = useRouter();

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

  const handleLoginTypeChange = () => {
    setLoginType((prevLoginType) =>
      prevLoginType === "admin" ? "resident" : "admin"
    );
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
        const token = localStorage.getItem("authToken");
        console.log("Token:", token);
        message.success("Login successful");
        router.push("/"); // Redirect to the desired route
      } else {
        message.error("Wrong credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      message.error("An error occurred during login. Please try again later.");
    }
  };

  const handlePasswordKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSignIn();
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

      <Stack direction="row" spacing={1} alignItems="center">
        <FormControl component="fieldset">
          <FormLabel component="legend">Login</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={loginType === "resident"}
                  onChange={handleLoginTypeChange}
                  name="loginTypeSwitch"
                  color="primary"
                />
              }
              label={loginType === "resident" ? "Resident" : "Admin"}
            />
          </FormGroup>
        </FormControl>
      </Stack>

      <Stack spacing={2}>
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
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handlePasswordKeyDown}
          />
        </Box>
        {/* <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={rememberMe}
                onChange={handleRememberMeChange}
                name="rememberMe"
                color="primary"
              />
            }
            label="Remember this Device"
          />
        </FormGroup> */}
      </Stack>

      <Box mt={2}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSignIn}
          style={{ backgroundColor: "blue" }}
        >
          Sign In
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthLogin;
