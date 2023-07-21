import React, { useState } from "react";
import { Box, Typography, FormGroup, FormControlLabel, Button, Stack, Checkbox } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import { JSX } from "@emotion/react/jsx-runtime";
import { useRouter } from "next/router";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {  
  const [resident_userName, setUsername] = useState("");
  const [resident_password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/loginResident", {
        resident_userName,
        resident_password,
      });

      // Store the authentication token in local storage or cookies
      const authToken = response.data.token;
      // Example of storing token in local storage
      localStorage.setItem("authToken", authToken);

      // Redirect to the desired page after successful authentication
      router.push("/");
    } catch (error) {
      console.error(error);
      // Handle authentication error
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
            htmlFor="username"
            mb="5px"
          >
            Username
          </Typography>
          <CustomTextField
            variant="outlined"
            fullWidth
            value={resident_userName}
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
            Password
          </Typography>
          <CustomTextField
            type="password"
            variant="outlined"
            fullWidth
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
