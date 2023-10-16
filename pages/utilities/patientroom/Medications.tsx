// components/medication/Medication.tsx
import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Select, DatePicker } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance"; // Import your axios instance

const { Title } = Typography;
const { Option } = Select; // Ant Design Select component

const Medication = () => {
  const [form] = Form.useForm();
  const [medications, setMedications] = useState([]);
  const [dosages, setDosages] = useState({}); // State to store dosages for each medicine
  const [loading, setLoading] = useState(false); // Add loading state
  const originalDate = new Date("2023-10-03T14:27:25.140Z");
  const formattedDate = originalDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD

  useEffect(() => {
    // Fetch medications from your API when the component mounts
    const fetchMedications = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get("/medicines"); // Adjust the API endpoint
        const medicationsData = response.data;

        setMedications(medicationsData);
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleMedicineChange = (selectedMedicine) => {
    // Fetch available dosages for the selected medicine
    const fetchDosages = async () => {
      try {
        const response = await axiosInstance.get(
          `/medicines/${selectedMedicine}/dosages`
        );
        const dosagesData = response.data;

        // Update the dosages state for the selected medicine
        setDosages({
          ...dosages,
          [selectedMedicine]: dosagesData,
        });

        // Reset the dosage field when the medicine changes
        form.setFieldsValue({ dosage: undefined });
      } catch (error) {
        console.error("Error fetching dosages:", error);
      }
    };

    fetchDosages();
  };

  const handleAddMedication = async (values) => {
    try {
      // Format the patientMedicineDate to 'YYYY-MM-DD'
      values.patientMedicineDate = new Date(values.patientMedicineDate)
        .toISOString()
        .slice(0, 10);

      console.log("Medication data:", values);

      const response = await axiosInstance.post("/patientMedicines", values);

      if (response.status === 201) {
        console.log("Medication saved successfully.");
        form.resetFields();
      } else {
        console.error("Failed to save medication.");
      }
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  return (
    <div>
      <Title level={3}>Medication Page</Title>
      <Form
        form={form}
        onFinish={handleAddMedication}
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
          name="medicine"
          rules={[{ required: true, message: "Please select medicine" }]}
        >
          <Select placeholder="Select a medicine">
            {medications.map((medication, index) => (
              <Option key={index} value={medication.medicine}>
                {medication.medicine_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* <Form.Item
          label="Dosage"
          name="dosage"
          rules={[{ required: true, message: "Please select dosage" }]}
        >
          <Select
            placeholder="Select a dosage"
            disabled={!form.getFieldValue("medicine")}
          >
            {form.getFieldValue("medicine") &&
              dosages[form.getFieldValue("medicine")]?.map((dosage, index) => (
                <Option key={index} value={dosage}>
                  {dosage}
                </Option>
              ))}
          </Select>
        </Form.Item> */}
        <Form.Item
          label="Frequency"
          name="medicine_frequency"
          rules={[{ required: true, message: "Please enter frequency" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Patient Medicine Date" // New field for patientMedicineDate
          name="patientMedicineDate"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Medication
          </Button>
        </Form.Item>
      </Form>
      {loading ? (
        <p>Loading medications...</p>
      ) : (
        <div>
          {medications.map((medication, index) => (
            <div key={index}>
              <p>{`Medicine: ${medication.medicine_name}`}</p>
              <p>{`Dosage: ${medications[index].dosage}`}</p>
              <p>{`Frequency: ${medication.medicine_frequency}`}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Medication;
