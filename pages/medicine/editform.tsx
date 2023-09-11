import React, { useState, useEffect } from "react";
import { Form, Input, Button, Space } from "antd";
import axiosInstance from "../../src/components/utils/axiosInstance";
import FullLayout from "../../src/layouts/full/FullLayout";
import { getUserRole } from "../../src/components/utils/roles";

const userRole = getUserRole();

const MedicineEdit = () => {
  const [form] = Form.useForm();
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    if (editingMedicine) {
      form.setFieldsValue(editingMedicine);
    }
  }, [editingMedicine, form]);

  const handleFinish = async (values) => {
    try {
      const token = sessionStorage.getItem("authToken");
      // Set the token in Axios headers for this request
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Perform your edit request here, e.g., axiosInstance.put()
      // Example:
      // await axiosInstance.put(`/admin/medicines/edit/${editingMedicine.medicine_id}`, values);

      // Handle the response as needed
      // ...

      // Reset the form fields
      form.resetFields();
      setEditingMedicine(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <h1>Edit Medicine</h1>
      <Form
        form={form}
        onFinish={handleFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="Medicine Name"
          name="medicine_name"
          rules={[{ required: true, message: "Please enter Medicine Name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Medicine Brand"
          name="medicine_brand"
          rules={[{ required: true, message: "Please enter Medicine Brand" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Medicine Dosage" name="medicine_dosage">
          <Input />
        </Form.Item>
        <Form.Item label="Medicine Type" name="medicine_type">
          <Input />
        </Form.Item>
        <Form.Item
          label="Medicine Price"
          name="medicine_price"
          rules={[{ required: true, message: "Please enter Medicine Price" }]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setEditingMedicine(null);
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MedicineEdit;
