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
import { Button, Drawer, Select, Spin } from "antd";
import EditDoctorForm from "./editform";
import AddDoctorForm from "./addform";

const { Option } = Select;

const Doctors = () => {
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

      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    fetchDoctors(); // Fetch data when an update is needed
  };

  useEffect(() => {
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
        <Spin spinning={loading}>
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
              // extra={
              //   <Space>
              //     <Button onClick={handleCancel}>Cancel</Button>
              //     <Button onClick={handleSubmit} type="primary">
              //       Submit
              //     </Button>
              //   </Space>
              // }
            >
              {isAddingDoctor ? ( // Render add form
                <AddDoctorForm
                  onUpdate={handleUpdate}
                  newDoctor={newDoctor}
                  handleInputChange={handleInputChange}
                  onFinish={handleCancel}
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
                      doctor.role === "resident" &&
                      (searchQuery === "" ||
                        doctor.resident_userName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        doctor.resident_fName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        doctor.resident_lName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        doctor.resident_gender
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())) // Adjust filtering to consider gender
                  )
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
                        <Typography>{doctor.resident_gender}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className=" pl-8">
                          {doctor.department_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          // variant="text"
                          color="primary"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
        </Spin>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={doctors.filter((doctor) => doctor.role === "resident").length}
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
