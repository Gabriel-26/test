import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../src/components/utils/axiosInstance";
import FullLayout from "../../src/layouts/full/FullLayout";
import PageContainer from "../../src/components/container/PageContainer";
import DashboardCard from "../../src/components/shared/DashboardCard";
import _ from "lodash";

import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  // const fetchPatientHistory = async (patientID) => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     axiosInstance.defaults.headers.common[
  //       "Authorization"
  //     ] = `Bearer ${token}`;
  //     const response = await axiosInstance.get(
  //       `/attributeValues/getPHR/${patientID}`
  //     );
  //     const phrData = response.data;
  //     setPatientHistory((prevPatientHistory) => ({
  //       ...prevPatientHistory,
  //       [patientID]: phrData,
  //     }));
  //   } catch (error) {
  //     console.error(
  //       `Error fetching patient history for patient ${patientID}:`,
  //       error
  //     );
  //   }
  // };

  useEffect(() => {
    // Fetch user role using the getUserRole function
    const role = getUserRole();
    const token = localStorage.getItem("authToken");
    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // Dynamically construct the API route based on user role
    const apiRoute =
      role === "admin"
        ? "/admin/patients"
        : "/residentAssignedPatients/get/PatientsByResident";

    // Fetch the list of patients from the constructed APXI route
    axiosInstance.get(apiRoute).then((response) => {
      setPatients(response.data);
      console.log(response.data);
      // Store PHR data in patientHistory with patientID as the key
      const updatedPatientHistory = {};

      // Iterate over each patient ID
      Object.keys(response.data).forEach((patientID) => {
        // Access the patient object for the current patient ID
        const patient = response.data[patientID];

        // Ensure that the patient object exists and has the necessary properties
        if (
          patient &&
          patient.assigned_patient &&
          patient.assigned_patient.patient_id
        ) {
          const phrData = patient.phr_data;
          console.log("Patient ID:", patientID);
          console.log("PHR Data:", phrData);
          updatedPatientHistory[patientID] = phrData;
        }
      });
      console.log("Updated Patient History:", updatedPatientHistory);

      setPatientHistory(updatedPatientHistory);
    });
  }, []); // Fetch the initial list of patients

  useEffect(() => {
    // Filter patients based on the search term and categoryAtt_name
    const filteredPatients = Array.isArray(patients)
      ? patients.filter((patient) => {
          // Check if any patient's attributes match the search term
          const matchesSearchTerm = Object.values(patient).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
          );
          // Check if any patient history matches the search term for categoryAtt_name and value
          const matchesCategoryAttName = patientHistory[
            patient.patient_id
          ]?.some((phrData) => {
            // Remove "phr_" prefix from categoryAtt_name
            const attributeName = phrData.categoryAtt_name.replace("phr_", "");
            // Check if categoryAtt_name matches the search term and the value is not "No"
            const value =
              phrData.attributeVal_values === "1" ? "Malignancy" : "No";
            const value2 =
              phrData.attributeVal_values === "1" ? "Cathetic" : "No";
            const value3 = phrData.attributeVal_values === "1" ? "Obese" : "No";
            const value4 =
              phrData.attributeVal_values === "1" ? "DentalCanes" : "No";
            const value5 =
              phrData.attributeVal_values === "1" ? "Gingivitis" : "No";
            const value6 =
              phrData.attributeVal_values === "1" ? "OralUlcers" : "No";
            const value7 =
              phrData.attributeVal_values === "1" ? "OralPetachie" : "No";
            const value8 =
              phrData.attributeVal_values === "1" ? "SkinRash" : "No";
            const value9 =
              phrData.attributeVal_values === "1" ? "SkinEccymosis" : "No";
            const value10 =
              phrData.attributeVal_values === "1" ? "SkinNodules" : "No";
            const value11 =
              phrData.attributeVal_values === "1" ? "SkinUlcer" : "No";
            const value12 = phrData.attributeVal_values === "1" ? "CHF" : "No";
            const value13 =
              phrData.attributeVal_values === "1" ? "Asthma" : "No";
            const value14 = phrData.attributeVal_values === "1" ? "HTN" : "No";
            const value15 =
              phrData.attributeVal_values === "1" ? "Thyroid" : "No";
            const value16 =
              phrData.attributeVal_values === "1" ? "Diabetes" : "No";
            const value17 =
              phrData.attributeVal_values === "1" ? "HepaticRenal" : "No";
            const value18 =
              phrData.attributeVal_values === "1" ? "Tuberculosis" : "No";
            const value19 =
              phrData.attributeVal_values === "1" ? "Psychiatric" : "No";
            const value20 = phrData.attributeVal_values === "1" ? "CAD" : "No";
            return (
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value2.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value3.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value4.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value5.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value6.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value7.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value8.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value9.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value10.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value11.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value12.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value13.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value14.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value15.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value16.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value17.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value18.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value19.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (attributeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                value20.toLowerCase().includes(searchTerm.toLowerCase()))
            );
          });

          // Return true if either the patient's attributes or patient history matches the search term
          return matchesSearchTerm || matchesCategoryAttName;
        })
      : [];
    setFilteredPatients(filteredPatients);
  }, [searchTerm, patients, patientHistory]);

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

  // useEffect(() => {
  //   // Fetch patient history when patient_id changes
  //   displayedPatients.forEach((patient: any) => {
  //     fetchPatientHistory(patient.patient_id);
  //   });
  // }, [displayedPatients]);

  return (
    <PageContainer>
      <DashboardCard title="Patients">
        <div>
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            style={{ marginBottom: 5 }} // Add bottom margin
          />
        </div>
        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          {displayedPatients.length === 0 ? (
            <Typography variant="subtitle1" align="center">
              No patients to display
            </Typography>
          ) : (
            <TableContainer
              style={{
                display: "flex",
                // justifyContent: "center",
                // textAlign: "center",
                // minHeight: "400px",
                minWidth: "2800px",
              }}
            >
              <Table
                className="custom-table"
                stickyHeader
                aria-label="sticky table"
              >
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
                    {/* Display PHR fields */}
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Malignancy
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Cathetic
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Obese
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Dental Canes
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Gingivitis
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Oral Ulcers
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Oral Petachie
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Skin Rash
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Skin Eccymosis
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Skin Nodules
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Skin Ulcer
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        CHF
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Asthma
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        HTN
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Thyroid
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Diabetes
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        HepaticRenal
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Tuberculosis
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Psychiatric
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        CAD
                      </Typography>
                    </TableCell>
                    {/* Add more columns for additional PHR fields */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(displayedPatients).map((patientID) => {
                    const patient = displayedPatients[patientID];
                    return (
                      <TableRow key={patientID}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {/* Use router.push to navigate to patient history page */}
                            <span
                              style={{ cursor: "pointer", color: "blue" }}
                              onClick={() =>
                                router.push(`patients/${patientID}`)
                              }
                            >
                              {patientID}
                            </span>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patient.patient.patient_fName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patient.patient.patient_lName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patient.patient.patient_mName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patient.patient.patient_age}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patient.patient.patient_sex}
                          </Typography>
                        </TableCell>
                        {/* Display PHR fields for each patient */}
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "malignancy"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "bodyHabitusCathetic"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "bodyHabitusObese"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName ===
                                  "dentionAndGumsDentalCanes"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName ===
                                  "dentionAndGumsGingivitis"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "oropharynxOralUlcers"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName ===
                                  "oropharynxOralPetachie"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "skinRash"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "skinEccymosis"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "skinNodules"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "skinUlcer"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "PMH_CHF"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "PMH_Asthma"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "PMH_HTN"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "PMH_Thyroid"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "PMH_Diabetes"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "PMH_HepaticRenal"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "PMH_Tuberculosis"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "PMH_Psychiatric"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {patientHistory[patient.patient.patient_id]?.map(
                              (phrData) => {
                                const attributeName =
                                  phrData.categoryAtt_name.replace("phr_", "");
                                const value =
                                  phrData.attributeVal_values === "1"
                                    ? "Yes"
                                    : "No";
                                return attributeName === "PMH_CAD"
                                  ? value
                                  : null;
                              }
                            )}
                          </Typography>
                        </TableCell>
                        {/* Add more cells for additional PHR fields */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
        {displayedPatients.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25]}
            component="div"
            count={displayedPatients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </DashboardCard>
    </PageContainer>
  );
};

PatientSearch.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};

export default PatientSearch as React.FC<PatientSearchWithLayoutProps>;
