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
import axios from "../../../src/components/utils/axiosInstance";
import type { ReactElement } from "react";
import PageContainer from "../../../src/components/container/PageContainer";
import FullLayout from "../../../src/layouts/full/FullLayout";
import { Button, Drawer, Spin } from "antd";
import AddChiefResidentForm from "./addform";
import EditChiefResidentForm from "./editform";

const ChiefResident = () => {
  const [doctors, setDoctors] = useState([]);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setPage(0); // Reset page to 0 when search query changes
    fetchDoctors(); // Initial data fetch when the component is mounted
  }, [searchQuery]);

  const fetchDoctors = async () => {
    try {
      setLoading(true); // Set loading to true when starting data fetch
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole"); // Assuming user role is stored in localStorage

      // Set the token in Axios headers for this request
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      let endpoint = "/residents"; // Default endpoint

      // Check the user's role and update the endpoint if it's "admin"
      if (role === "admin") {
        endpoint = "/admin/residents";
      }

      const response = await axios.get(endpoint);
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    fetchDoctors(); // Fetch data when an update is needed
  };

  const handleAddDoctor = () => {
    setIsAddingDoctor(!isAddingDoctor);
  };

  const handleCancel = () => {
    setIsAddingDoctor(false);
    setIsEditing(false);
  };

  const handleDrawerClose = () => {
    setIsAddingDoctor(false);
    setIsEditing(false);
  };

  const handleEditDoctor = (doctor) => {
    if (isEditing && editDoctor.resident_id) {
      // If the edit form is already open for the same doctor, close it
      setIsEditing(false);
    } else {
      // If the edit form is closed or open for a different doctor, toggle it
      setIsEditing(true);
      setEditDoctor(doctor);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.role === "chiefResident" &&
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

  return (
    <PageContainer>
      <DashboardCard title="Chief Residents">
        <Spin spinning={loading}>
          <Box sx={{ overflow: "auto", width: { xs: "600px", sm: "auto" } }}>
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
              title={
                isAddingDoctor ? "Add Chief Resident" : "Edit Chief Resident"
              }
              width={720}
              onClose={handleDrawerClose}
              open={isAddingDoctor || isEditing}
              bodyStyle={{ paddingBottom: 80 }}
            >
              {isAddingDoctor ? (
                <AddChiefResidentForm
                  newChiefResident={newDoctor}
                  onUpdate={handleUpdate}
                  handleInputChange={handleInputChange}
                  onFinish={handleCancel}
                />
              ) : isEditing ? (
                <EditChiefResidentForm
                  editChiefResident={editDoctor}
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
                      Gender
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
                {filteredDoctors
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
                        <Typography>{doctor.resident_gender}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className=" pl-8">
                          {doctor.department_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredDoctors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No residents with those credentials.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Spin>

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
      </DashboardCard>
    </PageContainer>
  );
};

export default ChiefResident;
ChiefResident.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
