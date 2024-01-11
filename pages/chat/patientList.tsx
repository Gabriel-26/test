import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import axiosInstance from "../../src/components/utils/axiosInstance";

const PatientListPage = ({ onSelectPatients }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatients, setSelectedPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get("patients");
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
      {/* <h1>Patient List</h1> */}
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
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
        </div>
      )}
    </div>
  );
};

export default PatientListPage;
