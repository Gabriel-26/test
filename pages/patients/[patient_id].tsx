import React, { useState, useEffect, ReactElement } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import PatientHistory from "../utilities/patientroom/PatientHistory";
import axiosInstance from "../../src/components/utils/axiosInstance";
import { useRouter } from "next/router";
import FullLayout from "../../src/layouts/full/FullLayout";
import FileViewer from "../utilities/patientroom/FileViewer";

interface PatientDetails {
  patient_id: string;
  patient_fName: string;
  patient_lName: string;
  patient_mName: string;
  patient_age: number;
  patient_sex: string;
  created_at: string;
  updated_at: string;
  // Add other fields as needed
}

const PatientHistoryPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { patient_id: patientID } = router.query;

  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async (patientID) => {
      try {
        console.log("Fetching patient details for patient ID:", patientID);

        const token = sessionStorage.getItem("authToken");
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        console.log("Patient ID", patientID);

        const response = await axiosInstance.get(
          `patients/getPatientbyId/${patientID}`
        );

        console.log("Response:", response.data);

        setPatientDetails(response.data as PatientDetails);
        setLoadingDetails(false);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setErrorDetails(error);
        setLoadingDetails(false);
      }
    };

    if (patientID) {
      console.log("Received patient ID:", patientID);
      fetchPatientDetails(patientID);
    }
  }, [patientID]);

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        gutterBottom
        style={{ color: theme.palette.primary.main }}
      >
        Patient History - {patientDetails?.patient_fName}{" "}
        {patientDetails?.patient_lName}
      </Typography>

      {loadingDetails && <CircularProgress style={{ margin: "20px" }} />}

      {errorDetails && (
        <Typography variant="body1" color="error" gutterBottom>
          Error fetching patient details. Please try again later.
        </Typography>
      )}

      {!loadingDetails && !errorDetails && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom>
                Patient Details
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Patient ID: {patientDetails.patient_id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                First Name: {patientDetails.patient_fName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Last Name: {patientDetails.patient_lName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Middle Name: {patientDetails.patient_mName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Age: {patientDetails.patient_age}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Sex: {patientDetails.patient_sex}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Created At: {patientDetails.created_at}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Updated At: {patientDetails.updated_at}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom>
                Patient History
              </Typography>
              <PatientHistory patientData={patientDetails} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom>
                File Viewer
              </Typography>
              <FileViewer patientData={patientDetails} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PatientHistoryPage;

PatientHistoryPage.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
