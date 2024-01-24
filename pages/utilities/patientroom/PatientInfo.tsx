import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  Spin,
  Typography,
} from "antd";
import { Paper } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter } from "next/router";
import axiosInstance from "../../../src/components/utils/axiosInstance";
const { Title, Text } = Typography;

const PatientInfo = (props: any) => {
  const router = useRouter();
  const { room_id } = router.query;
  const { patientData, updatePatientData } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    if (room_id) {
      fetchPatientData(room_id);
    }
  }, [room_id]);

  const fetchPatientData = async (roomId: string | string[] | undefined) => {
    try {
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const response = await axiosInstance.get(
        `/patAssRooms/getPatientbyRoom/${roomId}`
      );

      const data = response.data;

      if (data && data.length > 0) {
        updatePatientData(data);
      } else {
        // Handle no data as needed
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
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      await axiosInstance.put(`/patients/${editingPatient.patient_id}`, values);

      closeEditDrawer();
      fetchPatientData(room_id);
    } catch (error) {
      console.error("Error updating patient data:", error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      {loading && <Spin size="large" />}
      {!loading && error && (
        <Typography.Text type="danger">
          Error fetching patient data: {error.message}
        </Typography.Text>
      )}
      {!loading && !error && patientData.length > 0 && (
        <>
          <Title level={3}>Patient Information</Title>
          {patientData.map((patient) => (
            <Card
              key={patient.patient_id}
              style={{ marginBottom: "16px" }}
              title={`Patient ID: ${patient.patient_id}`}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text strong>First Name:</Text>{" "}
                  <Text>{patient.patient_fName}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Last Name:</Text>{" "}
                  <Text>{patient.patient_lName}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Middle Name:</Text>{" "}
                  <Text>{patient.patient_mName}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Age:</Text> <Text>{patient.patient_age}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Sex:</Text> <Text>{patient.patient_sex}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Room ID:</Text>{" "}
                  <Text>{patient.patientRoom}</Text>
                </Col>
                {/* OR */}
                <Col span={8}>
                  <Text strong>Room Name:</Text>{" "}
                  <Text>{patient.patientRoom}</Text>
                </Col>
                {/* <Col span={8}>
                  <Text strong>Vaccination History:</Text>{" "}
                  <Text>{patient.phr_vaccinationHistory}</Text>
                </Col> */}
                <Col span={24}>
                  <Button
                    icon={<EditOutlinedIcon />}
                    onClick={() => showEditDrawer(patient)}
                    className="bg-skyblue hover:bg-lightblue active:bg-darkblue focus:outline-none border-skyblue"
                  >
                    Edit
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </>
      )}
      {!loading && !error && patientData.length === 0 && (
        <Typography.Text>No patients found for this room.</Typography.Text>
      )}

      <Drawer
        title="Edit Patient Information"
        open={editDrawerVisible}
        onClose={closeEditDrawer}
        width={400}
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
            {/* <Form.Item
              label="Vaccination History"
              name="phr_vaccinationHistory"
            >
              <Input />
            </Form.Item> */}
            <Form.Item>
              <Button
                // type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#1890ff", color: "white" }}
              >
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
