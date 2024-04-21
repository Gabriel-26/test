import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../src/components/utils/axiosInstance";
import FullLayout from "../../src/layouts/full/FullLayout";
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
  Typography,
} from "@mui/material";
import { getUserRole } from "../../src/components/utils/roles";
import { Input } from "antd";

interface PatientSearchProps {
  getLayout: (page: React.ReactNode) => React.ReactNode;
}
interface PatientSearchWithLayoutProps extends PatientSearchProps {
  getLayout: (page: ReactElement) => ReactElement;
}

const PatientSearch: React.FC<PatientSearchProps> & {
  getLayout?: (page: ReactElement) => ReactElement;
} = (props) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [apiRoute, setApiRoute] = useState(
    "/residentAssignedPatients/get/PatientsByResident"
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Fetch user role using the getUserRole function
    const role = getUserRole();
    const token = localStorage.getItem("authToken");
    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // Dynamically construct the API route based on user role
    if (role === "admin") {
      setApiRoute("/admin/patients");
    } else {
      setApiRoute("/residentAssignedPatients/get/PatientsByResident");
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
    const filtered = patients.filter(
      (patient) =>
        typeof patient === "object" &&
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
      <DashboardCard title="Patients">
        <div>
          <Input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleInputChange}
            style={{ marginBottom: 5 }} // Add bottom margin
          />
        </div>
        <TableContainer
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          {displayedPatients.length === 0 ? (
            <Typography variant="subtitle2" color="textSecondary">
              No patients found.
            </Typography>
          ) : (
            <Table className="custom-table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      ID
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
                      Age
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Sex
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedPatients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((patient) => (
                    <TableRow key={patient.patient_id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {/* Use router.push to navigate to patient history page */}
                          <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() =>
                              router.push(`patients/${patient.patient_id}`)
                            }
                          >
                            {patient.patient_id}
                          </span>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {patient.patient_fName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {patient.patient_lName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {patient.patient_mName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {patient.patient_age}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {patient.patient_sex}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25]}
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

PatientSearch.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};

export default PatientSearch as React.FC<PatientSearchWithLayoutProps>;
