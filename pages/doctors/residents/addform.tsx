import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Space, message } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance"; // Replace with your axios import

const { Option } = Select;

const AddDoctorForm = ({
  newDoctor,
  handleInputChange,
  onUpdate,
  onFinish,
}) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Reset the form fields when a new doctor is added
    handleInputChange({ target: { name: "resident_userName", value: "" } });
    handleInputChange({ target: { name: "resident_fName", value: "" } });
    handleInputChange({ target: { name: "resident_lName", value: "" } });
    handleInputChange({ target: { name: "resident_mName", value: "" } });
    handleInputChange({ target: { name: "resident_gender", value: "" } });
    handleInputChange({ target: { name: "resident_password", value: "" } });
    handleInputChange({ target: { name: "role", value: "resident" } }); // Set the role to "resident"
    handleInputChange({ target: { name: "department_id", value: "" } });
    fetchDepartments();
  }, []); // Empty dependency array ensures the effect runs only once

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      const response = await axiosInstance.get("/admin/departments"); // Adjust the API endpoint accordingly
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  const handleFinish = async (values) => {
    try {
      const token = localStorage.getItem("authToken");
      // Set the token in Axios headers for this request
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      // Send a POST request to the API endpoint for creating residents
      const response = await axiosInstance.post(
        "/admin/residents", // Replace with your actual API endpoint for creating residents
        values
      );

      // Handle the response as needed
      console.log("New resident added successfully:", response.data);
      onUpdate();

      // Trigger any necessary actions (e.g., fetch the updated list of residents)
      // ...
      onFinish();

      // Reset the form fields
      handleInputChange({ target: { name: "resident_userName", value: "" } });
      handleInputChange({ target: { name: "resident_fName", value: "" } });
      handleInputChange({ target: { name: "resident_lName", value: "" } });
      handleInputChange({ target: { name: "resident_mName", value: "" } });
      handleInputChange({ target: { name: "resident_gender", value: "" } });
      handleInputChange({ target: { name: "resident_password", value: "" } });
      handleInputChange({ target: { name: "department_id", value: "" } });
      message.success("New resident added successfully");
    } catch (error) {
      console.log("Error adding new resident:", error);
      // Handle any error that occurred during the request
      message.error("Error adding new resident. Please try again.");
    }
  };

  return (
    <Form
      onFinish={handleFinish} // Use handleSubmit if provided, or handleFinish if not
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        label="Username"
        name="resident_userName"
        rules={[{ required: true, message: "Please enter Username" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="First Name"
        name="resident_fName"
        rules={[{ required: true, message: "Please enter First Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="resident_lName"
        rules={[{ required: true, message: "Please enter Last Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Middle Name"
        name="resident_mName"
        rules={[{ required: true, message: "Please enter Middle Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Gender"
        name="resident_gender"
        rules={[{ required: true, message: "Please select a gender" }]}
      >
        <Select placeholder="Select a gender">
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Password" name="resident_password">
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        initialValue="resident" // Set the initial value to "resident"
        rules={[{ required: true, message: "Please select Role" }]}
      >
        <Select disabled>
          <Option value="resident">Resident</Option>
          {/* Add other role options if needed */}
        </Select>
      </Form.Item>
      <Form.Item
        label="Department ID"
        name="department_id"
        rules={[{ required: true, message: "Please select Department ID" }]}
      >
        <Select>
          {departments.map((department) => (
            <Option
              key={department.department_name}
              value={department.department_id}
            >
              {department.department_name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "green",
              // "&:hover": { backgroundColor: "orange" },
            }}
          >
            Save
          </Button>

          <Button onClick={onFinish}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddDoctorForm;
