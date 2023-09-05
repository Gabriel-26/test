import React, { useState, useEffect, ReactElement } from "react";
import axiosInstance from "../../src/components/utils/axiosInstance";
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import FullLayout from "../../src/layouts/full/FullLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

interface Medicine {
  medicine_id: number;
  medicine_name: string;
  medicine_brand: string;
  medicine_dosage: string;
  medicine_type: string;
  medicine_price: number;
  created_at: string;
  updated_at: string;
}

const MedicineList = () => {
  const [medicines, setMedicineData] = useState<Medicine[]>([]); // Renamed variable
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, [searchQuery]);

  const fetchMedicines = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const role = sessionStorage.getItem("userRole"); // Assuming user role is stored in sessionStorage

      // Set the token in Axios headers for this request
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      let endpoint = "/medicines"; // Default endpoint

      // Check the user's role and update the endpoint if it's "admin"
      if (role === "admin") {
        endpoint = "/admin/medicines";
      }

      const response = await axiosInstance.get(endpoint);
      console.log(response.data);

      const filteredMedicines = response.data.filter((medicine) =>
        Object.values(medicine).some(
          (value) =>
            value !== null &&
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setMedicineData(filteredMedicines);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const showDrawer = (medicine?: Medicine) => {
    setEditingMedicine(medicine ?? null);
    setDrawerVisible(true);
    form.setFieldsValue(medicine ?? {});
  };

  const closeDrawer = () => {
    setEditingMedicine(null);
    setDrawerVisible(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const token = sessionStorage.getItem("authToken");
      // Set the token in Axios headers for this request
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      if (editingMedicine) {
        // Edit existing medicine
        await axiosInstance.put(
          `/medicines/edit/${editingMedicine.medicine_id}`,
          values
        );
      } else {
        // Add new medicine
        await axiosInstance.post(`/admin/medicines`, values);
      }
      fetchMedicines();
      closeDrawer();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Change the base to 10
    setPage(0);
  };

  return (
    <div>
      <h1>Medicine Formulary</h1>
      <Button variant="contained" color="primary" onClick={() => showDrawer()}>
        Add Medicine
      </Button>
      <Input
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {medicines.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                {/* <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell> */}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((medicine) => (
                  <TableRow key={medicine.medicine_id}>
                    <TableCell>{medicine.medicine_id}</TableCell>
                    <TableCell>{medicine.medicine_name}</TableCell>
                    <TableCell>{medicine.medicine_brand}</TableCell>
                    <TableCell>{medicine.medicine_dosage}</TableCell>
                    <TableCell>{medicine.medicine_type}</TableCell>
                    <TableCell>{medicine.medicine_price}</TableCell>
                    {/* <TableCell>{medicine.created_at}</TableCell>
                  <TableCell>{medicine.updated_at}</TableCell> */}
                    <TableCell>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => showDrawer(medicine)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={medicines.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <p>No medicines available.</p>
      )}
      <Drawer
        title={editingMedicine ? "Edit Medicine" : "Add Medicine"}
        width={720}
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
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

export default MedicineList;
MedicineList.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
