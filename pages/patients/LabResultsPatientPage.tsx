import React, { useState, useEffect } from "react";
import { Typography, Spin, Alert, Pagination } from "antd";
import axiosInstance from "../../src/components/utils/axiosInstance";
const { Title } = Typography;

const LabResultsPage = ({ patientId }) => {
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(3);

  const fetchLabResults = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/results/patient/${patientId}`);
      setLabResults(response.data);
    } catch (error) {
      console.error("Error fetching lab results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabResults();
  }, [patientId]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = labResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      {/* <Title level={3} style={{ marginBottom: "16px" }}>
        Lab Results Page
      </Title> */}
      {loading ? (
        <Spin size="large" />
      ) : labResults.length > 0 ? (
        <div>
          <Title level={4} style={{ marginBottom: "16px", color: "#2c3e50" }}>
            Patient's Lab Results
          </Title>
          {currentResults.map((result, index) => (
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
                {`Lab Result Date: ${new Date(
                  result.labResultDate
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
                {`Results: ${result.results}`}
              </p>
            </div>
          ))}
          <Pagination
            current={currentPage}
            total={labResults.length}
            pageSize={resultsPerPage}
            onChange={paginate}
            style={{ marginTop: "16px", textAlign: "center" }}
          />
        </div>
      ) : (
        <Alert
          message="No Lab Results Found"
          description="There are no lab results recorded for this patient."
          type="info"
        />
      )}
    </div>
  );
};

export default LabResultsPage;
