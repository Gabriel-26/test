import React, { useEffect } from "react";
import { Form, Input, Select, Button, Space } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance"; // Replace with your axios import

const { Option } = Select;

const AddDoctorForm = ({
  newDoctor,
  handleInputChange,
  onUpdate,
  handleSubmit,
}) => {
  useEffect(() => {
    // Reset the form fields when a new doctor is added
    handleInputChange({ target: { name: "resident_userName", value: "" } });
    handleInputChange({ target: { name: "resident_fName", value: "" } });
    handleInputChange({ target: { name: "resident_lName", value: "" } });
    handleInputChange({ target: { name: "resident_mName", value: "" } });
    handleInputChange({ target: { name: "resident_password", value: "" } });
    handleInputChange({ target: { name: "role", value: "resident" } }); // Set the role to "resident"
    handleInputChange({ target: { name: "department_id", value: "" } });
  }, [newDoctor, handleInputChange]);

  const handleFinish = async (values) => {
    try {
      const token = sessionStorage.getItem("authToken");
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

      // Reset the form fields
      handleInputChange({ target: { name: "resident_userName", value: "" } });
      handleInputChange({ target: { name: "resident_fName", value: "" } });
      handleInputChange({ target: { name: "resident_lName", value: "" } });
      handleInputChange({ target: { name: "resident_mName", value: "" } });
      handleInputChange({ target: { name: "resident_password", value: "" } });
      handleInputChange({ target: { name: "department_id", value: "" } });
    } catch (error) {
      console.log("Error adding new resident:", error);
      // Handle any error that occurred during the request
    }
  };

  return (
    <Form
      onFinish={handleFinish} // Use handleSubmit if provided, or handleFinish if not
      labelCol={{ span: 4 }}
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
        rules={[{ required: true, message: "Please enter Department ID" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "green",
              "&:hover": { backgroundColor: "orange" },
            }}
          >
            Save
          </Button>

          <Button
            onClick={() =>
              handleInputChange({
                target: { name: "resident_userName", value: "" },
              })
            }
          >
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddDoctorForm;
