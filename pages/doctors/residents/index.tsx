import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  Collapse,
  TablePagination,
  Stack,
} from "@mui/material";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import EditIcon from "@mui/icons-material/Edit";
import { green, red } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../../../src/components/utils/axiosInstance";
import type { ReactElement } from "react";
import PageContainer from "../../../src/components/container/PageContainer";
import FullLayout from "../../../src/layouts/full/FullLayout";
import { Button, Drawer, Form, Input, Select, Row, Col, Space } from "antd";
import EditDoctorForm from "./editform";
import AddDoctorForm from "./addform";

const { Option } = Select;

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // State to track updates

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

  useEffect(() => {
    fetchDoctors();
  }, [isUpdated]);

  const handleUpdate = () => {
    // Set isUpdated to true to trigger a re-fetch of data
    setIsUpdated(true);
  };
  const fetchDoctors = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const role = sessionStorage.getItem("userRole"); // Assuming user role is stored in sessionStorage

      // Set the token in Axios headers for this request
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      let endpoint = "/residents"; // Default endpoint

      // Check the user's role and update the endpoint if it's "admin"
      if (role === "admin") {
        endpoint = "/admin/residents";
      }

      const response = await axios.get(endpoint);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleAddDoctor = () => {
    setIsAddingDoctor(!isAddingDoctor);
  };

  const handleCancel = () => {
    setIsAddingDoctor(false);
    setIsEditing(false);
  };

  const handleEditDoctor = (
    doctor: React.SetStateAction<{
      resident_id: string;
      resident_userName: string;
      resident_fName: string;
      resident_lName: string;
      resident_mName: string;
      resident_password: string;
      role: string;
      department_id: string;
    }>
  ) => {
    if (isEditing && editDoctor.resident_id) {
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

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      // Set the token in Axios headers for this request
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const newDoctorWithroleZero = {
        ...newDoctor,
        role: "resident",
      };

      // Send a POST request to the API endpoint with the new doctor data
      const response = await axios.post(
        "admin/residents",
        newDoctorWithroleZero
      );

      // Handle the response as needed
      console.log("New doctor added successfully:", response.data);

      // Fetch the updated list of doctors
      fetchDoctors();

      // Clear the form and close the collapsible form section
      setNewDoctor({
        resident_id: "",
        resident_userName: "",
        resident_fName: "",
        resident_lName: "",
        resident_mName: "",
        resident_password: "",
        role: "resident",
        department_id: "",
      });
      setIsAddingDoctor(false);
    } catch (error) {
      console.log("Error adding new doctor:", error);
      // Handle any error that occurred during the request
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
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  return (
    <PageContainer>
      <DashboardCard title="Residents">
        <Box sx={{ overflow: "auto", width: { xs: "600px", sm: "auto" } }}>
          <Button
            onClick={handleAddDoctor}
            // icon={<PlusOutlined />}
            // sx={{ marginBottom: "10px" }}
          >
            New Resident
          </Button>
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
            extra={
              <Space>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSubmit} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            {isAddingDoctor ? ( // Render add form
              <AddDoctorForm
                onUpdate={handleUpdate}
                newDoctor={newDoctor}
                handleInputChange={handleInputChange}
                handleSubmit={handleCancel}
              />
            ) : isEditing ? ( // Render edit form
              <EditDoctorForm
                editDoctor={editDoctor}
                onUpdate={handleUpdate}
                onFinish={handleCancel}
              />
            ) : null}{" "}
            {/* Render nothing when neither adding nor editing */}
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
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Id
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Username
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    First Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Last Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Middle Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Department ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors
                .filter(
                  (doctor) =>
                    doctor.role === "resident" && // Filter condition
                    (searchQuery === "" ||
                      doctor.resident_userName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      doctor.resident_fName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      doctor.resident_lName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()))
                ) // Filter doctors based on the condition
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((doctor) => (
                  <TableRow key={doctor.resident_id}>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                      >
                        {doctor.resident_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {doctor.resident_userName}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            sx={{
                              fontSize: "13px",
                            }}
                          ></Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {doctor.resident_fName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {doctor.resident_lName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{doctor.resident_mName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className=" pl-8">
                        {doctor.department_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        sx={{ marginX: 1 }}
                        onClick={() => handleEditDoctor(doctor)}
                      >
                        <BorderColorIcon sx={{ color: green[400] }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={doctors.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default Doctors;
Doctors.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
