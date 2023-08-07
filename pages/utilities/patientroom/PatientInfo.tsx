import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { useRouter } from "next/router";

const PatientInfo = () => {
  const router = useRouter();
  const { room_id } = router.query; // Get the room_id from the query parameters

  // Step 1: State to store patient data
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 2: Fetch patient data from API
  useEffect(() => {
    if (room_id) {
      fetchPatientData(room_id); // Fetch patient data for the specified room_id
    }
  }, [room_id]);

  const fetchPatientData = async (roomId) => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const response = await axiosInstance.get(
        `/PatientHealthRecord/getPatientbyRoom/${roomId}`
      );

      // Assuming the API response is an array of patients for the given room_id
      const data = response.data;

      console.log("API Response Data:", data); // Log the API response for debugging

      if (data && data.length > 0) {
        setPatientData(data);
      } else {
        setPatientData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setError(error);
      setLoading(false);
    }
  };

  let content;
  if (loading) {
    content = <p>Loading patient data...</p>;
  } else if (error) {
    content = <p>Error fetching patient data: {error.message}</p>;
  } else if (patientData.length > 0) {
    content = (
      <>
        <h2>Patient Information</h2>
        {patientData.map((patient) => (
          <div key={patient.patient_id}>
            <p>Patient ID: {patient.patient_id}</p>
            <p>First Name: {patient.patient_fName}</p>
            <p>Last Name: {patient.patient_lName}</p>
            <p>Middle Name: {patient.patient_mName}</p>
            <p>Age: {patient.patient_age}</p>
            <p>Sex: {patient.patient_sex}</p>
            <p>Vaccination Status: {patient.patient_vaccination_stat}</p>
            <hr />
          </div>
        ))}
      </>
    );
  } else {
    content = <p>No patients found for this room.</p>;
  }

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      {content}
    </Paper>
  );
};

export default PatientInfo;
