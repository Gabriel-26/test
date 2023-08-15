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
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    resident_id: "",
    resident_userName: "",
    resident_fName: "",
    resident_lName: "",
    resident_mName: "",
    resident_password: "",
    isChief: "",
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
    isChief: "",
    department_id: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/residents");
      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDoctor = () => {
    setIsAddingDoctor(!isAddingDoctor);
  };

  const handleEditDoctor = (
    doctor: React.SetStateAction<{
      resident_id: string;
      resident_userName: string;
      resident_fName: string;
      resident_lName: string;
      resident_mName: string;
      resident_password: string;
      isChief: string;
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

  const handleEditInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setEditDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newDoctorWithIsChiefZero = {
        ...newDoctor,
        isChief: "0",
      };

      // Send a POST request to the API endpoint with the new doctor data
      const response = await axios.post("/residents", newDoctorWithIsChiefZero);

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
        isChief: "0",
        department_id: "",
      });
      setIsAddingDoctor(false);
    } catch (error) {
      console.log("Error adding new doctor:", error);
      // Handle any error that occurred during the request
    }
  };

  const handleEditSubmit = async () => {
    try {
      // Send a PUT request to the API endpoint with the updated doctor data
      const response = await axios.put(
        `/residents/${editDoctor.resident_id}`,
        editDoctor
      );

      // Handle the response as needed
      console.log("Doctor updated successfully:", response.data);

      // Fetch the updated list of doctors
      fetchDoctors();

      // Clear the form and close the edit form section
      setIsEditing(false);
      setEditDoctor({
        resident_id: "",
        resident_userName: "",
        resident_fName: "",
        resident_lName: "",
        resident_mName: "",
        resident_password: "",
        isChief: "",
        department_id: "",
      });
    } catch (error) {
      console.log("Error updating doctor:", error);
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
              setEditDoctor({
                resident_id: "",
                resident_userName: "",
                resident_fName: "",
                resident_lName: "",
                resident_mName: "",
                resident_password: "",
                isChief: "",
                department_id: "",
              });
            }}
            open={isAddingDoctor || isEditing}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
              <Space>
                <Button onClick={handleAddDoctor}>Cancel</Button>
                <Button onClick={handleSubmit} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            {isAddingDoctor ? ( // Render add form
              <Form layout="vertical" requiredMark>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Resident ID"
                      rules={[
                        { required: true, message: "Please enter resident ID" },
                      ]}
                    >
                      <Input
                        name="resident_id"
                        placeholder="Please enter resident ID"
                        value={newDoctor.resident_id}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Resident UserName"
                      rules={[
                        { required: true, message: "Please enter resident ID" },
                      ]}
                    >
                      <Input
                        name="resident_userName"
                        placeholder="Please enter resident username"
                        value={newDoctor.resident_userName}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="First Name"
                      rules={[
                        { required: true, message: "Please enter first name" },
                      ]}
                    >
                      <Input
                        name="resident_fName"
                        placeholder="Please enter first name"
                        value={newDoctor.resident_fName}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Last Name"
                      rules={[
                        { required: true, message: "Please enter last name" },
                      ]}
                    >
                      <Input
                        name="resident_lName"
                        placeholder="Please enter last name"
                        value={newDoctor.resident_lName}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Middle Name"
                      rules={[
                        { required: true, message: "Please enter middle name" },
                      ]}
                    >
                      <Input
                        name="resident_mName"
                        placeholder="Please enter middle name"
                        value={newDoctor.resident_mName}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Password"
                      rules={[
                        { required: true, message: "Please enter password" },
                      ]}
                    >
                      <Input
                        name="resident_password"
                        placeholder="Please enter password"
                        value={newDoctor.resident_password}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Department ID"
                      rules={[
                        {
                          required: true,
                          message: "Please enter Department ID",
                        },
                      ]}
                    >
                      <Input
                        name="department_id"
                        placeholder="Please enter Department ID"
                        value={newDoctor.department_id}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            ) : isEditing ? ( // Render edit form
              <Form layout="vertical" requiredMark>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Username"
                      name="resident_userName"
                      rules={[
                        { required: true, message: "Please enter username" },
                      ]}
                      initialValue={editDoctor.resident_userName}
                    >
                      <Input onChange={handleEditInputChange} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="First Name"
                      name="resident_fName"
                      rules={[
                        { required: true, message: "Please enter first name" },
                      ]}
                      initialValue={editDoctor.resident_fName}
                    >
                      <Input onChange={handleEditInputChange} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Last Name"
                      name="resident_lName"
                      rules={[
                        { required: true, message: "Please enter last name" },
                      ]}
                      initialValue={editDoctor.resident_lName}
                    >
                      <Input onChange={handleEditInputChange} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Middle Name"
                      name="resident_mName"
                      rules={[
                        { required: true, message: "Please enter middle name" },
                      ]}
                      initialValue={editDoctor.resident_mName}
                    >
                      <Input onChange={handleEditInputChange} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Password"
                      name="resident_password"
                      rules={[
                        { required: true, message: "Please enter password" },
                      ]}
                      initialValue={editDoctor.resident_password}
                    >
                      <Input onChange={handleEditInputChange} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Department ID"
                      name="department_id"
                      rules={[
                        {
                          required: true,
                          message: "Please enter Department ID",
                        },
                      ]}
                      initialValue={editDoctor.department_id}
                    >
                      <Input onChange={handleEditInputChange} />
                    </Form.Item>
                  </Col>
                </Row>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditSubmit}
                >
                  Save
                </Button>
              </Form>
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
                    (doctor.isChief === 0 || doctor.role === "Resident") && // Filter condition
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
