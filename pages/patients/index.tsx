import React, { useState, useEffect, ReactElement } from "react";
import axiosInstance from "../../src/components/utils/axiosInstance";
import FullLayout from "../../src/layouts/full/FullLayout";
import { getUserRole } from "../../src/components/utils/roles";
import PageContainer from "../../src/components/container/PageContainer";
import DashboardCard from "../../src/components/shared/DashboardCard";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  TablePagination,
} from "@mui/material";

// Define props interface
interface PatientSearchProps {
  getLayout: (page: React.ReactNode) => React.ReactNode;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ getLayout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [apiRoute, setApiRoute] = useState("/patients"); // Default API route
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch user role using the getUserRole function
    const role = getUserRole();

    // Dynamically construct the API route based on user role
    if (role === "admin") {
      setApiRoute("/admin/patients");
    } else {
      setApiRoute("/patients");
    }
  }, []); // Fetch the initial API route

  useEffect(() => {
    // Fetch the list of patients from the constructed API route
    axiosInstance.get(apiRoute).then((response) => {
      setPatients(response.data);
    });
  }, [apiRoute]); // Re-fetch patients when the API route changes

  useEffect(() => {
    // Filter patients based on the search term
    const filtered = patients.filter((patient) =>
      Object.keys(patient).some(
        (field) =>
          [
            "patient_id",
            "patient_fName",
            "patient_lName",
            "patient_mName",
            "patient_age",
            "patient_sex",
          ].includes(field) &&
          `${patient[field]}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const displayedPatients = searchTerm ? filteredPatients : patients;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <PageContainer>
      <DashboardCard>
        <h1>Patient Search</h1>
        <div>
          <TextField
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleInputChange}
            fullWidth // Make the search bar longer
          />
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Middle Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Sex</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedPatients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient) => (
                  <TableRow key={patient.patient_id}>
                    <TableCell>{patient.patient_id}</TableCell>
                    <TableCell>{patient.patient_fName}</TableCell>
                    <TableCell>{patient.patient_lName}</TableCell>
                    <TableCell>{patient.patient_mName}</TableCell>
                    <TableCell>{patient.patient_age}</TableCell>
                    <TableCell>{patient.patient_sex}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={displayedPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default PatientSearch;
PatientSearch.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
