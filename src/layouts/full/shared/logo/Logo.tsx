import { styled } from "@mui/material";
import Image from "next/image";

const CenteredLogo = styled("div")(() => ({
  height: "100px",
  width: "180px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center", // Center horizontally
  alignItems: "center", // Center vertically
}));

const Logo = () => {
  return (
    <>
      <CenteredLogo>
        <Image
          src="/images/logos/CME.png"
          alt="logo"
          height={70}
          width={90}
          priority
        />
      </CenteredLogo>
      <CenteredLogo>
        <Image
          src="/images/logos/logo.png"
          alt="logo"
          height={60}
          width={150}
          priority
        />
      </CenteredLogo>
      <CenteredLogo>
        <Image
          src="/images/logos/VisayasMed.png"
          alt="logo"
          height={60}
          width={150}
          priority
        />
      </CenteredLogo>
    </>
  );
};

export default Logo;
