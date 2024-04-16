import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Checkbox,
  Typography,
} from "@mui/material";
import axiosInstance from "../../src/components/utils/axiosInstance";

const PatientListPage = ({ onSelectPatients }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatients, setSelectedPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get(
          "residentAssignedPatients/get/PatientsByResident"
        );
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientSelect = (patientId) => {
    const updatedSelectedPatients = selectedPatients.includes(patientId)
      ? selectedPatients.filter((id) => id !== patientId)
      : [...selectedPatients, patientId];

    setSelectedPatients(updatedSelectedPatients);

    // Call the onSelectPatients function to pass the selected patients to the parent component
    onSelectPatients(updatedSelectedPatients);
  };

  // Function to clear the selectedPatients state

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          {patients.length === 0 ? ( // Check if patients array is empty
            <Typography variant="body1">No patients found.</Typography> // Render message if empty
          ) : (
            <List>
              {patients.map((patient) => (
                <ListItem key={patient.patient_id}>
                  <Checkbox
                    onChange={() => handlePatientSelect(patient.patient_id)}
                    checked={selectedPatients.includes(patient.patient_id)}
                  />
                  <ListItemText
                    primary={`${patient.patient_fName} ${patient.patient_lName}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientListPage;
