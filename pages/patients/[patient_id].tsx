import React, { useState, useEffect, ReactElement } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PatientHistory from "../utilities/patientroom/PatientHistory";
import axiosInstance from "../../src/components/utils/axiosInstance";
import { useRouter } from "next/router";
import FullLayout from "../../src/layouts/full/FullLayout";
import FileViewer from "../utilities/patientroom/FileViewer";

interface PatientDetails {
  patient: {
    created_at: string;
    patient_age: number;
    patient_fName: string;
    patient_id: string;
    patient_lName: string;
    patient_mName: string;
    patient_sex: string;
    updated_at: string;
  };
  patientRoom: {
    created_at: string;
    floor_id: string;
    room_floor: string;
    room_id: string;
    room_name: string;
    room_price: number;
    room_type: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
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

        const token = localStorage.getItem("authToken");
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
        Patient History - {patientDetails?.patient.patient_fName}{" "}
        {patientDetails?.patient.patient_lName}
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
              <List>
                <ListItem>
                  <ListItemText
                    primary={`Patient ID: ${patientDetails.patient.patient_id}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={`First Name: ${patientDetails.patient.patient_fName}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={`Last Name: ${patientDetails.patient.patient_lName}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={`Middle Name: ${patientDetails.patient.patient_mName}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={`Age: ${patientDetails.patient.patient_age}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={`Sex: ${patientDetails.patient.patient_sex}`}
                  />
                </ListItem>
                <Divider />
                {/* <ListItem>
                  <ListItemText
                    primary={`Room ID: ${
                      patientDetails.patientRoom.room_id ||
                      "Patient has no room"
                    }`}
                  />
                </ListItem> */}
                <Divider />
                {/* OR */}
                <ListItem>
                  <ListItemText
                    primary={`Room Name: ${
                      patientDetails.patientRoom.room_name ||
                      "Patient has no room"
                    }`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={`Created At: ${patientDetails.patient.created_at}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={`Updated At: ${patientDetails.patient.updated_at}`}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom>
                Patient History
              </Typography>
              <PatientHistory patientData={patientDetails.patient} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom>
                File Viewer
              </Typography>
              <FileViewer patientData={patientDetails.patient} />
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
