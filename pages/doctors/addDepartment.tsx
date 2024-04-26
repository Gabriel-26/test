import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd"; // Import message from 'antd'
import axiosInstance from "../../src/components/utils/axiosInstance";
const AddDepartmentModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleAddDepartment = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await axiosInstance.post("admin/departments", values);
      onClose();
      form.resetFields(); // Reset the form fields

      message.success("Department added successfully");
    } catch (error) {
      message.error("Error in adding Department");
      console.error("Error adding department:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Department"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleAddDepartment}
          style={{
            backgroundColor: "green",
            // "&:hover": { backgroundColor: "orange" },
          }}
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="department_name"
          label="Department Name"
          rules={[{ required: true, message: "Please enter department name" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDepartmentModal;
