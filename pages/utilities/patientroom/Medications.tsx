// components/medication/Medication.tsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  AutoComplete,
  Spin,
  Alert,
} from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment-timezone";

const { Title } = Typography;
const { Option } = Select;

const Medication = (props: any) => {
  const [form] = Form.useForm();
  const { patientId } = props;
  const [medications, setMedications] = useState([]);
  const [dosages, setDosages] = useState({});
  const [patientMedications, setPatientMedications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/medicines");
        const medicationsData = response.data;
        setMedications(medicationsData);
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPatientMedications = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/patientMedicines/patient/${patientId}`
        );
        const patientMedicationsData = response.data;
        setPatientMedications(patientMedicationsData);
      } catch (error) {
        console.error("Error fetching patient medications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
    fetchPatientMedications();
  }, [patientId]);

  const handleMedicineChange = async (selectedMedicine) => {
    try {
      const response = await axiosInstance.get(
        `/medicines/${selectedMedicine}/dosages`
      );
      const dosagesData = response.data;

      setDosages({
        ...dosages,
        [selectedMedicine]: dosagesData,
      });

      form.setFieldsValue({ dosage: undefined });
    } catch (error) {
      console.error("Error fetching dosages:", error);
    }
  };

  const handleAddMedication = async (values, selectedDate) => {
    try {
      // Use the selected date from the DatePicker and current time
      const selectedDateTime = selectedDate;
      const currentHour = moment().tz("Asia/Manila").hours();
      const currentMinute = moment().tz("Asia/Manila").minutes();

      // Set the time part to the current time
      selectedDateTime.set({
        hour: currentHour,
        minute: currentMinute,
        second: 0,
      });

      values.patientMedicineDate = selectedDateTime.format();
      values.patient_id = patientId;

      const selectedMedicine = medications.find(
        (medication) => medication.medicine_name === values.medicine_id
      );

      if (selectedMedicine) {
        const response = await axiosInstance.post("/patientMedicines", {
          ...values,
          medicine_id: selectedMedicine.medicine_id,
        });

        if (response.status === 200) {
          const formattedDate = selectedDateTime.format("YYYY-MM-DD HH:mm:ss");

          console.log("Medication saved successfully.", {
            ...values,
            patientMedicineDate: formattedDate,
          });

          form.resetFields();

          // Fetch the updated list of patient medications
          const updatedMedicationsResponse = await axiosInstance.get(
            `/patientMedicines/patient/${patientId}`
          );

          const updatedMedications = updatedMedicationsResponse.data;

          // Update patientMedications state with the updated list
          setPatientMedications(updatedMedications);
        } else {
          console.error("Failed to save medication.");
        }
      } else {
        console.error("Selected medicine not found.");
      }
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  // const handleDeleteMedication = async (medicationId) => {
  //   try {
  //     const response = await axiosInstance.delete(
  //       `/patientMedicines/${medicationId}`
  //     );

  //     if (response.status === 200) {
  //       console.log("Medication deleted successfully.");
  //       // Update patientMedications state to exclude the deleted medication
  //       setPatientMedications(
  //         patientMedications.filter(
  //           (medication) => medication.patientMedicine_id !== medicationId
  //         )
  //       );
  //     } else {
  //       console.error("Failed to delete medication.");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting medication:", error);
  //   }
  // };

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <Title level={3} style={{ marginBottom: "16px" }}>
        Medication Page
      </Title>
      <Form
        form={form}
        onFinish={(values) =>
          handleAddMedication(values, form.getFieldValue("patientMedicineDate"))
        }
        layout="vertical"
        style={{ marginBottom: "16px" }}
        onValuesChange={(changedValues) => {
          if ("medicine" in changedValues) {
            handleMedicineChange(changedValues.medicine);
          }
        }}
      >
        <Form.Item
          label="Medicine"
          name="medicine_id"
          rules={[{ required: true, message: "Please select medicine" }]}
        >
          <AutoComplete
            placeholder="Type to search and select a medicine"
            filterOption={(inputValue, option) =>
              option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onSelect={(value, option) => {
              // Store the selected medicine_name in the form
              form.setFieldsValue({
                medicine_id: value,
              });
            }}
          >
            {medications.map((medication, index) => (
              <AutoComplete.Option key={index} value={medication.medicine_name}>
                {medication.medicine_name}
              </AutoComplete.Option>
            ))}
          </AutoComplete>
        </Form.Item>

        <Form.Item
          label="Frequency"
          name="medicine_frequency"
          rules={[{ required: true, message: "Please enter frequency" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Patient Medicine Date"
          name="patientMedicineDate"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Add Medication
          </Button>
        </Form.Item>
      </Form>
      {loading ? (
        <Spin size="large" />
      ) : patientMedications.length > 0 ? (
        <div>
          <Title level={4} style={{ marginBottom: "16px", color: "#2c3e50" }}>
            Patient's Medications
          </Title>
          {patientMedications.map((medication, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ecf0f1",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p
                style={{
                  color: "#3498db",
                  marginBottom: "8px",
                  fontSize: "18px",
                }}
              >
                {`Medicine: ${medication.medicine_name}`}
              </p>
              <p
                style={{ marginBottom: "8px" }}
              >{`Dosage: ${medication.medicine_dosage}`}</p>
              <p
                style={{ marginBottom: "8px" }}
              >{`Type: ${medication.medicine_type}`}</p>
              <p
                style={{ marginBottom: "8px" }}
              >{`Frequency: ${medication.medicine_frequency}`}</p>
              <p
                style={{ marginBottom: "8px" }}
              >{`Patient ID: ${medication.patient_id}`}</p>
              <p style={{ marginBottom: "8px" }}>{`Date: ${new Date(
                medication.patientMedicineDate
              ).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZone: "Asia/Manila", // Set the timezone for the Philippines
              })}`}</p>

              <p style={{ marginBottom: "8px" }}>{`Created At: ${new Date(
                medication.created_at
              ).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}`}</p>
              <p style={{ marginBottom: "8px" }}>{`Updated At: ${new Date(
                medication.updated_at
              ).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}`}</p>

              {/* <Button
                type="danger"
                onClick={() =>
                  handleDeleteMedication(medication.patientMedicine_id)
                }
                className="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                style={{ marginTop: "12px" }}
              >
                <DeleteOutlined /> Delete Medication
              </Button> */}
            </div>
          ))}
        </div>
      ) : (
        <Alert
          message="No Medications Found"
          description="There are no medications recorded for this patient."
          type="info"
        />
      )}
    </div>
  );
};

export default Medication;
