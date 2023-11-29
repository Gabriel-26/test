import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Space } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance"; // Replace with your axios import

const { Option } = Select;

const EditDoctorForm = ({ editDoctor, onFinish, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(editDoctor);
  }, [editDoctor, form]);

  const handleFinish = async (values) => {
    try {
      const token = sessionStorage.getItem("authToken");
      // Set the token in Axios headers for this request
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      // Send a PUT request to the API endpoint with the updated doctor data
      // Send a PUT request to update the doctor
      const response = await axiosInstance.put(
        `/admin/residents/${editDoctor.resident_id}`,
        values
      );

      // Handle the response as needed
      console.log("Doctor updated successfully:", response.data);
      onUpdate();

      // Trigger the onFinish callback to close the edit form
      onFinish();
    } catch (error) {
      console.log("Error updating doctor:", error);
      // Handle any error that occurred during the request
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        label="Resident ID"
        name="resident_id"
        rules={[{ required: true, message: "Please enter Resident ID" }]}
      >
        <Input disabled />
      </Form.Item>
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
        rules={[{ required: true, message: "Please select Role" }]}
      >
        <Select>
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

          <Button onClick={onFinish}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EditDoctorForm;
