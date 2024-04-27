import React, { useState, useEffect } from "react";
import { Modal, Button, message, Select } from "antd";
import axiosInstance from "../../src/components/utils/axiosInstance";

const { Option } = Select;

const DeleteDepartmentModal = ({ visible, onClose, setDepartments }) => {
  const [loading, setLoading] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  useEffect(() => {
    // Fetch departments when the modal is opened
    if (visible) {
      fetchDepartments();
    } else {
      // Clear selected department when modal is closed
      setSelectedDepartmentId(null);
    }
  }, [visible]);

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get("admin/departments");
      setDepartmentsList(response.data);
      // Set the default selected department ID if available
      if (response.data.length > 0) {
        setSelectedDepartmentId(response.data[0].department_id);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      message.error("Error fetching departments");
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      setLoading(true);
      // Send a DELETE request to delete the department
      await axiosInstance.delete(`admin/departments/${selectedDepartmentId}`);
      setLoading(false);
      message.success("Department deleted successfully");
      onClose();
      // Fetch departments again to update the list after deletion
      fetchDepartments();
    } catch (error) {
      setLoading(false);
      message.error("Error deleting department");
      console.error("Error deleting department:", error);
    }
  };

  return (
    <Modal
      title="Delete Department"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          loading={loading}
          onClick={handleDeleteDepartment}
          disabled={!selectedDepartmentId} // Disable button if no department is selected
        >
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this department?</p>
      {/* Dropdown to select department */}
      <Select
        style={{ width: "100%" }}
        placeholder="Select department" // Placeholder text for the dropdown
        value={selectedDepartmentId}
        onChange={(value) => setSelectedDepartmentId(value)}
      >
        {departmentsList.map((department) => (
          <Option
            key={department.department_id}
            value={department.department_id}
          >
            {department.department_name}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default DeleteDepartmentModal;
