import React, { useState, useEffect, ReactElement } from "react";
import { Button, Form, Input, Drawer, DatePicker, InputNumber } from "antd";
import axiosInstance from "../../src/components/utils/axiosInstance";
import FullLayout from "../../src/layouts/full/FullLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"; // Import Material-UI Table components

const columns = [
  { field: "medicine_id", headerName: "Medicine ID" },
  { field: "medicine_name", headerName: "Medicine Name" },
  { field: "medicine_brand", headerName: "Medicine Brand" },
  { field: "medicine_dosage", headerName: "Medicine Dosage" },
  { field: "medicine_type", headerName: "Medicine Type" },
  { field: "medicine_price", headerName: "Medicine Price" },
  { field: "created_at", headerName: "Created At" },
  { field: "updated_at", headerName: "Updated At" },
  {
    field: "actions",
    headerName: "Actions",
    renderCell: (params) => (
      <Button onClick={() => handleEdit(params.row)}>Edit</Button>
    ),
  },
];

const Medicine = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [medicines, setMedicines] = useState([]); // Initialize medicines with an empty array

  const [form] = Form.useForm();

  const fetchMedicines = async () => {
    try {
      const response = await axiosInstance.get(`/medicines`);
      console.log("API response:", response.data); // Log the API response
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  useEffect(() => {
    fetchMedicines(); // Fetch medicines data when the component mounts
  }, []);

  const showDrawer = (record: any) => {
    setDrawerVisible(true);
    setEditingMedicine(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditingMedicine(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingMedicine) {
        // Edit existing medicine
        await axiosInstance.put(`medicines/edit/${editingMedicine.id}`, values);
      } else {
        // Add new medicine
        await axiosInstance.post(`/medicines`, values);
      }
      fetchMedicines();
      closeDrawer();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => showDrawer(null)}
        style={{ marginBottom: 16 }}
      >
        Add Medicine
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((row) => (
              <TableRow key={row.medicine_id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === "actions" ? (
                      <Button onClick={() => handleEdit(row)}>Edit</Button>
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer
        title={editingMedicine ? "Edit Medicine" : "Add Medicine"}
        width={720}
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item name="medicine_id" label="Medicine ID">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="medicine_name"
            label="Medicine Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="medicine_brand"
            label="Medicine Brand"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="medicine_dosage" label="Medicine Dosage">
            <Input />
          </Form.Item>
          <Form.Item name="medicine_type" label="Medicine Type">
            <Input />
          </Form.Item>
          <Form.Item
            name="medicine_price"
            label="Medicine Price"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="created_at" label="Created At">
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled />
          </Form.Item>
          <Form.Item name="updated_at" label="Updated At">
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingMedicine ? "Save Changes" : "Add Medicine"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Medicine;
Medicine.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
