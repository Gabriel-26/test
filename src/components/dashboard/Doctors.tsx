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
  Button,
} from "@mui/material";
import DashboardCard from "../shared/DashboardCard";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { green, red } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    resident_id: "",
    resident_userName: "",
    resident_fName: "",
    resident_lName: "",
    resident_mName: "",
    department_id: "",

  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/residents");
      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDoctor = () => {
    setIsAddingDoctor(!isAddingDoctor);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {

      // Send a POST request to the API endpoint with the new doctor data
      const response = await axios.post(
        "http://127.0.0.1:8000/api/residents",
        newDoctor
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
        department_id: "",
      });
      setIsAddingDoctor(false);
    } catch (error) {
      console.log("Error adding new doctor:", error);
      // Handle any error that occurred during the request
    }
  };
  

  return (
    <DashboardCard title="Doctors">
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddDoctor}
          sx={{ marginBottom: "10px" }}
        >
          Add Doctor
        </Button>
        <Collapse in={isAddingDoctor}>
          <Box sx={{ marginBottom: "10px" }}>
            <TextField  
              label="Resident ID"
              name="resident_id"
              value={newDoctor.resident_id}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              label="Username"
              name="resident_userName"
              value={newDoctor.resident_userName}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              label="First Name"
              name="resident_fName"
              value={newDoctor.resident_fName}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              label="Last Name"
              name="resident_lName"
              value={newDoctor.resident_lName}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              label="Middle Name"
              name="resident_mName"
              value={newDoctor.resident_mName}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              label="Department ID"
              name="department_id"
              value={newDoctor.department_id}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Add
            </Button>
          </Box>
        </Collapse>
        {/* Rest of the code */}
  
  
    
        <TextField
          label="Search"
          InputProps={{
            type: "search",
          }}
        />
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2,
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
            {doctors.map((doctor) => (
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
                      >
                
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
                <TableCell >
                 <Typography color="textSecondary"
                    variant="subtitle2"
                    fontWeight={400}>
                  {doctor.resident_lName}
                </Typography>  

            
                </TableCell>
                <TableCell>
                  <Typography >{doctor.resident_mName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography >{doctor.department_id}</Typography>
                </TableCell>
                <TableCell>
                  <IconButton>
                    <DeleteIcon sx={{ color: green[400] }} />
                  </IconButton>
                  <IconButton sx={{ marginX: -1 }}>
                    <BorderColorIcon sx={{ color: red[400] }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default Doctors;
