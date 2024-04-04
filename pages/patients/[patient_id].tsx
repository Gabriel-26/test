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
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import PatientHistory from "../utilities/patientroom/PatientHistory";
import axiosInstance from "../../src/components/utils/axiosInstance";
import { useRouter } from "next/router";
import FullLayout from "../../src/layouts/full/FullLayout";
import Medication from "./MedicationPatientPage";
import LabResultsPage from "./LabResultsPatientPage";
import PatientFiles from "./PatientFiles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
interface AdmissionData {
  created_at: string;
}

interface DischargeData {
  dischargeDate: string;
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
  const [admittedDates, setAdmittedDates] = useState<AdmissionData[]>([]);
  const [dischargedDates, setDischargedDates] = useState<DischargeData[]>([]);
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

    const fetchAdmittedAndDischargedDates = async (patientID) => {
      try {
        const response = await axiosInstance.get(
          `patAssRooms/getNumberOfAdmissions/${patientID}`
        );
        console.log("Admitted Dates:", response.data);
        console.log("Discharged Dates:", response.data);
        setAdmittedDates(response.data);
        setDischargedDates(response.data);
      } catch (error) {
        console.error("Error fetching admitted and discharged dates:", error);
      }
    };

    if (patientID) {
      console.log("Received patient ID:", patientID);
      fetchPatientDetails(patientID);
      fetchAdmittedAndDischargedDates(patientID);
    }
  }, [patientID]);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom align="center">
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
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="admitted-dates-content"
                      id="admitted-dates-header"
                    >
                      <Typography>Admitted Dates</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: "-10px 16px 1px 16px" }}>
                      <List>
                        {admittedDates.map((date, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={formatDate(date.created_at)} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
                <Divider />
                <ListItem>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="discharged-dates-content"
                      id="discharged-dates-header"
                    >
                      <Typography>Discharged Dates</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: "8px 16px" }}>
                      <List>
                        {dischargedDates.map((date, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={formatDate(date.dischargeDate)} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>

              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom align="center">
                File Viewer
              </Typography>
              <PatientFiles patientData={patientDetails.patient} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom align="center">
                Medications
              </Typography>
              <Medication patientId={patientDetails?.patient.patient_id} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom align="center">
                Lab Results
              </Typography>
              <LabResultsPage patientId={patientDetails?.patient.patient_id} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: theme.spacing(3) }}>
              <Typography variant="h6" gutterBottom align="center">
                Patient History
              </Typography>
              <PatientHistory patientData={patientDetails.patient} />
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
