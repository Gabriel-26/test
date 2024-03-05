import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  TablePagination,
  Stack,
} from "@mui/material";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { green, red } from "@mui/material/colors";
import axios from "../../../src/components/utils/axiosInstance";
import type { ReactElement } from "react";
import PageContainer from "../../../src/components/container/PageContainer";
import FullLayout from "../../../src/layouts/full/FullLayout";
import { Modal, Button, Drawer, Select, Spin, message, Alert } from "antd";
import EditDoctorForm from "./editform";
import AddDoctorForm from "./addform";
const { Option } = Select;

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    resident_id: "",
    resident_userName: "",
    resident_fName: "",
    resident_lName: "",
    resident_mName: "",
    resident_password: "",
    role: "",
    department_id: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false); // State to track if there are no search results
  const { confirm } = Modal;

  const [isEditing, setIsEditing] = useState(false);
  const [editDoctor, setEditDoctor] = useState({
    resident_id: "",
    resident_userName: "",
    resident_fName: "",
    resident_lName: "",
    resident_mName: "",
    resident_password: "",
    role: "",
    department_id: "",
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      let endpoint = "/residents";

      if (role === "admin") {
        endpoint = "/admin/residents";
      }

      const response = await axios.get(endpoint);
      setDoctors(response.data);
      setNoResults(false); // Reset noResults state when fetching data

      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const token = localStorage.getItem("authToken");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Show confirmation modal
      confirm({
        title: "Are you sure you want to delete this resident?",
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          // Start loading
          setDeleteLoading(true);
          // Make a DELETE request to your API endpoint
          axios
            .delete(`/admin/residents/delete/${doctorId}`)
            .then(() => {
              // Fetch updated data after deletion
              handleUpdate();
              // Show success message
              message.success("Resident deleted successfully");
            })
            .catch((error) => {
              // Show error message
              message.error("Failed to delete resident");
              console.error("Error deleting doctor:", error);
              setDeleteError(error.message || "Failed to delete resident");
            })
            .finally(() => {
              // Reset loading state
              setDeleteLoading(false);
              // Close the modal
              setDeleteModalVisible(false);
            });
        },
        onCancel() {
          // Do nothing if cancelled
        },
      });
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleUpdate = () => {
    fetchDoctors(); // Fetch data when an update is needed
  };

  useEffect(() => {
    setPage(0); // Reset page to 0 when search query changes

    fetchDoctors(); // Initial data fetch when the component is mounted
  }, []);

  const handleAddDoctor = () => {
    setIsAddingDoctor(!isAddingDoctor);
  };

  const handleCancel = () => {
    setIsAddingDoctor(false);
    setIsEditing(false);
  };

  const handleEditDoctor = (doctor) => {
    if (isEditing && editDoctor.resident_id === doctor.resident_id) {
      // If the edit form is already open for the same doctor, close it
      setIsEditing(false);
    } else {
      // If the edit form is closed or open for a different doctor, toggle it
      setIsEditing(true);
      setEditDoctor(doctor);
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setNewDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.role === "resident" &&
      (searchQuery === "" ||
        doctor.resident_userName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doctor.resident_fName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doctor.resident_lName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doctor.resident_mName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doctor.department_id
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doctor.resident_gender
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

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
    setPage(0); // Reset page to 0 when rows per page changes
  };

  return (
    <PageContainer>
      <DashboardCard title="Residents">
        <Spin spinning={loading}>
          <Box sx={{ overflow: "auto", width: { xs: "600px", sm: "auto" } }}>
            {/* Add Modal for confirmation */}
            <Modal
              title="Confirm Deletion"
              open={deleteModalVisible}
              onOk={() => setDeleteModalVisible(false)}
              onCancel={() => setDeleteModalVisible(false)}
              confirmLoading={deleteLoading}
            >
              <p>Are you sure you want to delete this resident?</p>
              {deleteError && <Alert message={deleteError} type="error" />}
            </Modal>
            <Button onClick={handleAddDoctor}>New Resident</Button>
            <Stack direction="column" spacing={2}>
              <TextField
                label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  type: "search",
                }}
              />
            </Stack>

            <Drawer
              title={isAddingDoctor ? "Add a Resident" : "Edit Resident"}
              width={720}
              onClose={() => {
                setIsAddingDoctor(false);
                setIsEditing(false);
              }}
              open={isAddingDoctor || isEditing}
              bodyStyle={{ paddingBottom: 80 }}
            >
              {isAddingDoctor ? (
                <AddDoctorForm
                  onUpdate={handleUpdate}
                  newDoctor={newDoctor}
                  handleInputChange={handleInputChange}
                  onFinish={handleCancel}
                />
              ) : isEditing ? (
                <EditDoctorForm
                  editDoctor={editDoctor}
                  onUpdate={handleUpdate}
                  onFinish={handleCancel}
                />
              ) : null}
            </Drawer>

            <Table
              aria-label="simple table"
              sx={{
                whiteSpace: "nowrap",
                mt: 2,
                minWidth: 600,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Id
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Username
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      First Name
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Last Name
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Middle Name
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Gender
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Department ID
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDoctors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((doctor) => (
                    <TableRow key={doctor.resident_id}>
                      <TableCell style={{ textAlign: "center" }}>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            textAlign: "center",
                          }}
                        >
                          {doctor.resident_id}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {doctor.resident_userName}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          sx={{
                            fontSize: "13px",
                          }}
                        ></Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          fontWeight={400}
                          sx={{ whiteSpace: "normal" }} // Add text wrapping
                        >
                          {doctor.resident_fName}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          fontWeight={400}
                          sx={{ whiteSpace: "normal" }} // Add text wrapping
                        >
                          {doctor.resident_lName}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <Typography sx={{ whiteSpace: "normal" }}>
                          {doctor.resident_mName}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <Typography>{doctor.resident_gender}</Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <Typography className=" pl-8">
                          {doctor.department_id}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <Button
                          color="primary"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDeleteDoctor(doctor.resident_id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {/* Display a message if there are no search results */}
                {filteredDoctors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No residents with those credentials.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Conditionally render the TablePagination component */}
            {filteredDoctors.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={filteredDoctors.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Box>
        </Spin>
      </DashboardCard>
    </PageContainer>
  );
};

export default Doctors;
Doctors.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
