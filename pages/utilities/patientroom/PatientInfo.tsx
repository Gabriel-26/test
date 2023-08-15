import React, { useState, useEffect } from "react";
import {  Drawer, Form, Input, Button } from "antd"; // Import necessary components
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { useRouter } from "next/router";
import { Paper } from "@mui/material";

const PatientInfo = () => {
  const router = useRouter();
  const { room_id } = router.query;

  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    if (room_id) {
      fetchPatientData(room_id);
    }
  }, [room_id]);

  const fetchPatientData = async (roomId) => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axiosInstance.get(
        `/PatientHealthRecord/getPatientbyRoom/${roomId}`
      );

      const data = response.data;

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

  const showEditDrawer = (patient) => {
    setEditingPatient(patient);
    setEditDrawerVisible(true);
  };

  const closeEditDrawer = () => {
    setEditingPatient(null);
    setEditDrawerVisible(false);
  };

  const onFinish = async (values) => {
    try {
      // Update patient information using API call
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axiosInstance.put(
        `/PatientHealthRecord/updatePatient/${editingPatient.patient_id}`,
        values
      );

      // Close the edit drawer and fetch updated patient data
      closeEditDrawer();
      fetchPatientData(room_id);
    } catch (error) {
      console.error("Error updating patient data:", error);
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
            <Button onClick={() => showEditDrawer(patient)}>Edit</Button>
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
      <Drawer
        title="Edit Patient Information"
        visible={editDrawerVisible}
        onClose={closeEditDrawer}
      >
        {editingPatient && (
          <Form
            layout="vertical"
            initialValues={editingPatient}
            onFinish={onFinish}
          >
            <Form.Item label="First Name" name="patient_fName">
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="patient_lName">
              <Input />
            </Form.Item>
            <Form.Item label="Middle Name" name="patient_mName">
              <Input />
            </Form.Item>
            <Form.Item label="Age" name="patient_age">
              <Input />
            </Form.Item>
            <Form.Item label="Sex" name="patient_sex">
              <Input />
            </Form.Item>
            <Form.Item label="Vaccination Status" name="patient_vaccination_stat">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </Paper>
  );
};

export default PatientInfo;
