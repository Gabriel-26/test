import React, { useState, useEffect } from "react";
import {
  styled,
  Container,
  Box,
  Modal,
  Typography,
  Button,
} from "@mui/material";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import { Props } from "next/script";
import { useRouter } from "next/router";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "50px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "white",
}));

const FullLayout: React.FC<Props> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let clearModalTimer;

    const handleUserActivity = () => {
      clearTimeout(clearModalTimer);
      // clearModalTimer = setTimeout(() => setShowModal(false), 30 * 1000); // 30 seconds
      clearModalTimer = setTimeout(() => setShowModal(false), 7200 * 1000); // 2 hours
    };

    const handleInactive = () => {
      setShowModal(true);
    };

    // Add event listeners
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);
    window.addEventListener("focus", handleUserActivity);

    // Set modal timer
    // clearModalTimer = setTimeout(handleInactive, 30 * 1000); // 30 seconds
    clearModalTimer = setTimeout(handleInactive, 7200 * 1000); // 2 hours

    return () => {
      // Cleanup event listeners
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("focus", handleUserActivity);
      clearTimeout(clearModalTimer);
    };
  }, []);

  const handleBacktoLogin = () => {
    // Clear local storage or perform any other logout actions
    localStorage.clear();
    router.push("/authentication/login");
  };

  return (
    <MainWrapper className="mainwrapper">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <PageWrapper className="page-wrapper">
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <Container
          sx={{
            maxWidth: "1200px",
            backgroundColor: "white",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
      </PageWrapper>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="inactive-modal-title"
        aria-describedby="inactive-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography
            id="inactive-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            You have been inactive for too long.
          </Typography>
          <Typography
            id="inactive-modal-description"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Please log in again.
          </Typography>
          <Button onClick={handleBacktoLogin}>Close</Button>
        </Box>
      </Modal>
    </MainWrapper>
  );
};

export default FullLayout;
