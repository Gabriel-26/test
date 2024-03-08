import React, { useState, useEffect } from "react";
import { Typography, Spin, Alert, Pagination } from "antd";
import axiosInstance from "../../src/components/utils/axiosInstance";
const { Title } = Typography;

const Medication = (props: any) => {
  const { patientId } = props;
  const [patientMedications, setPatientMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [medicationsPerPage] = useState(2);

  const fetchPatientMedications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/patientMedicines/patient/${patientId}`
      );
      const patientMedicationsData = response.data;
      setPatientMedications(patientMedicationsData);
    } catch (error) {
      console.error("Error fetching patient medications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientMedications();
  }, [patientId]);

  // Logic to paginate medications
  const indexOfLastMedication = currentPage * medicationsPerPage;
  const indexOfFirstMedication = indexOfLastMedication - medicationsPerPage;
  const currentMedications = patientMedications.slice(
    indexOfFirstMedication,
    indexOfLastMedication
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div style={{ maxWidth: "800px", margin: "auto", height: "675px" }}>
      {/* <Title level={3} style={{ marginBottom: "16px" }}>
        Medication Page
      </Title> */}
      {loading ? (
        <Spin size="large" />
      ) : patientMedications.length > 0 ? (
        <div>
          <Title level={4} style={{ marginBottom: "16px", color: "#2c3e50" }}>
            Patient's Medications
          </Title>
          {currentMedications.map((medication, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ecf0f1",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p
                style={{
                  color: "#3498db",
                  marginBottom: "8px",
                  fontSize: "18px",
                }}
              >
                {`Medicine: ${medication.medicine_name}`}
              </p>
              <p style={{ marginBottom: "8px" }}>
                {`Type: ${medication.medicine_type}`}
              </p>
              <p style={{ marginBottom: "8px" }}>
                {`Frequency: ${medication.medicine_frequency}`}
              </p>
              <p style={{ marginBottom: "8px" }}>
                {`Patient ID: ${medication.patient_id}`}
              </p>
              <p style={{ marginBottom: "8px" }}>
                {`Date: ${new Date(
                  medication.patientMedicineDate
                ).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  timeZone: "Asia/Manila",
                })}`}
              </p>
              <p style={{ marginBottom: "8px" }}>
                {`Created At: ${new Date(medication.created_at).toLocaleString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  }
                )}`}
              </p>
              <p style={{ marginBottom: "8px" }}>
                {`Updated At: ${new Date(medication.updated_at).toLocaleString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  }
                )}`}
              </p>
            </div>
          ))}
          <Pagination
            current={currentPage}
            total={patientMedications.length}
            pageSize={medicationsPerPage}
            onChange={paginate}
            style={{ marginTop: "16px", textAlign: "center" }}
          />
        </div>
      ) : (
        <Alert
          message="No Medications Found"
          description="There are no medications recorded for this patient."
          type="info"
        />
      )}
    </div>
  );
};

export default Medication;
