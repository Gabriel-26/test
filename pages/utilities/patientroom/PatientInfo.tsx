import React, { useState, useEffect } from "react";
import { Drawer, Form, Input, Button, Row, Col, Card } from "antd"; // Import necessary components
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { useRouter } from "next/router";
import { Paper } from "@mui/material";

const PatientInfo = (props: any) => {
  const router = useRouter();
  const { room_id } = router.query;

  const { patientData, updatePatientData } = props; // Destructure patientData and updatePatientData props
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const { patient_id } = patientData;

  useEffect(() => {
    if (room_id) {
      fetchPatientData(room_id);
    }
  }, [room_id]);

  const fetchPatientData = async (roomId: string | string[] | undefined) => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const response = await axiosInstance.get(
        `/patientHealthRecord/getPatientbyRoom/${roomId}`
      );

      const data = response.data;

      if (data && data.length > 0) {
        // Call the updatePatientData function to update the patientData in the parent component
        updatePatientData(data);
      } else {
        // If no data is available, you can choose to handle it as needed
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const showEditDrawer = (patient: React.SetStateAction<null>) => {
    setEditingPatient(patient);
    setEditDrawerVisible(true);
  };

  const closeEditDrawer = () => {
    setEditingPatient(null);
    setEditDrawerVisible(false);
  };

  const onFinish = async (values: any) => {
    try {
      // Update patient information using API call
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      await axiosInstance.put(
        `/patientHealthRecord/updatePatient/${editingPatient.patient_id}`,
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
          <Card
            key={patient.patient_id}
            style={{ marginBottom: "16px" }}
            title={`Patient ID: ${patient.patient_id}`}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <p>
                  <strong>First Name:</strong> {patient.patient_fName}
                </p>
              </Col>
              <Col span={8}>
                <p>
                  <strong>Last Name:</strong> {patient.patient_lName}
                </p>
              </Col>
              <Col span={8}>
                <p>
                  <strong>Middle Name:</strong> {patient.patient_mName}
                </p>
              </Col>
              <Col span={8}>
                <p>
                  <strong>Age:</strong> {patient.patient_age}
                </p>
              </Col>
              <Col span={8}>
                <p>
                  <strong>Sex:</strong> {patient.patient_sex}
                </p>
              </Col>
              <Col span={8}>
                <p>
                  <strong>Vaccination Status:</strong>{" "}
                  {patient.patient_vaccination_stat}
                </p>
              </Col>
              <Col span={24}>
                <Button onClick={() => showEditDrawer(patient)}>Edit</Button>
              </Col>
            </Row>
          </Card>
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
        open={editDrawerVisible}
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
            <Form.Item
              label="Vaccination Status"
              name="patient_vaccination_stat"
            >
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
