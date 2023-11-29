import React from "react";
import { Box } from "@mui/material";
import Image from "next/image";
const LoadingComponent = () => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
      }}
    >
      <Image
        src="/images/logos/CME.png"
        alt="CME Logo"
        height={70}
        width={90}
        priority
        style={{ marginRight: "16px" }}
      />
      <Image
        src="/images/logos/logo.png"
        alt="Logo"
        height={60}
        width={150}
        priority
        style={{ marginRight: "16px" }}
      />
      <Image
        src="/images/logos/VisayasMed.png"
        alt="VisayasMed Logo"
        height={60}
        width={150}
        priority
      />
    </Box>
  );
};

export default LoadingComponent;
