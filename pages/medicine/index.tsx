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
  Spin,
  message,
  Alert,
  Modal,
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
import { getUserRole } from "../../src/components/utils/roles";
import DashboardCard from "../../src/components/shared/DashboardCard";

const userRole = getUserRole();
const { confirm } = Modal;

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
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  useEffect(() => {
    setPage(0); // Reset page to 0 when search query changes
    fetchMedicines();
  }, [searchQuery]);

  const fetchMedicines = async () => {
    try {
      setLoading(true); // Set loading to true when starting data fetch

      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole"); // Assuming user role is stored in localStorage

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
      setLoading(false);

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
      setLoading(false);
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    try {
      const token = localStorage.getItem("authToken");

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      confirm({
        title: "Are you sure you want to delete this medicine?",
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          setDeleteLoading(true);

          axiosInstance
            .delete(`admin/medicines/delete/${medicineId}`)
            .then(() => {
              handleUpdate();
              message.success("Medicine deleted successfully");
            })
            .catch((error) => {
              message.error("Failed to delete medicine");
              console.error("Error deleting medicine:", error);
              setDeleteError(error.message || "Failed to delete medicine");
            })
            .finally(() => {
              setDeleteLoading(false);
              setDeleteModalVisible(false);
            });
        },
        onCancel() {
          // Do nothing if cancelled
        },
      });
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const handleUpdate = () => {
    fetchMedicines();
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
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      if (editingMedicine) {
        // Ensure medicine_id is provided when updating a record
        values.medicine_id = editingMedicine.medicine_id;

        await axiosInstance.put(
          `admin/medicines/${editingMedicine.medicine_id}`,
          values
        );
        message.success("Medicine updated successfully");
      } else {
        await axiosInstance.post(`/admin/medicines`, values);
        message.success("Medicine added successfully");
      }
      fetchMedicines();
      closeDrawer();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error adding/updating medicine. Please try again.");
    }
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
    setPage(1); // Reset page to 0 when rows per page changes
  };

  return (
    <>
      <DashboardCard title="Medicines">
        <Spin spinning={loading}>
          <h1>Medicine Formulary</h1>
          <Modal
            title="Confirm Deletion"
            open={deleteModalVisible}
            onOk={() => setDeleteModalVisible(false)}
            onCancel={() => setDeleteModalVisible(false)}
            confirmLoading={deleteLoading}
          >
            <p>Are you sure you want to delete this medicine?</p>
            {deleteError && <Alert message={deleteError} type="error" />}
          </Modal>
          <Button
            // variant="contained"
            color="primary"
            onClick={() => showDrawer()}
            style={{ display: userRole === "admin" ? "block" : "none" }}
          >
            Add Medicine
          </Button>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {medicines.length > 0 ? (
            <TableContainer component={Paper}>
              <Table className="custom-table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }}>ID</TableCell>
                    <TableCell style={{ textAlign: "center" }}>Name</TableCell>
                    <TableCell style={{ textAlign: "center" }}>Brand</TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      Dosage
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>Type</TableCell>
                    <TableCell style={{ textAlign: "center" }}>Price</TableCell>
                    {/* <TableCell>Created At</TableCell>
    <TableCell>Updated At</TableCell> */}
                    {userRole === "admin" && (
                      <TableCell style={{ textAlign: "center" }}>
                        Action
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicines
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((medicine) => (
                      <TableRow key={medicine.medicine_id}>
                        <TableCell style={{ textAlign: "center" }}>
                          {medicine.medicine_id}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {medicine.medicine_name}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {medicine.medicine_brand}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {medicine.medicine_dosage}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {medicine.medicine_type}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {medicine.medicine_price}
                        </TableCell>
                        {userRole === "admin" && (
                          <TableCell style={{ textAlign: "center" }}>
                            <Button
                              // variant="text"
                              color="primary"
                              onClick={() => showDrawer(medicine)}
                              style={{
                                // display: "block",
                                margin: "auto",
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              color="error"
                              onClick={() =>
                                handleDeleteMedicine(medicine.medicine_id)
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableRow>
              <TableCell align="center">
                No medicine found that matches your search in the database.
              </TableCell>
            </TableRow>
          )}
        </Spin>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={medicines.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DashboardCard>

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

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              {editingMedicine ? "Save Changes" : "Add Medicine"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default MedicineList;
MedicineList.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
