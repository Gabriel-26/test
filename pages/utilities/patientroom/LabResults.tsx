import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, TextareaAutosize, Grid } from "@mui/material";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { Spin, Alert, Pagination, Modal, message, Button } from "antd";
import moment from "moment-timezone";

const { confirm } = Modal;

const LabResultsPage = ({ patientData }) => {
  const [labResults, setLabResults] = useState("");
  const [fetchedResults, setFetchedResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3); // Set the number of items per page

  const fetchLabResults = async (patientData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/results/patient/${patientData.patient_id}`
      );
      setFetchedResults(response.data);
    } catch (error) {
      console.error("Error fetching lab results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setLabResults(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!labResults) {
        console.error("Lab results cannot be empty.");
        return;
      }

      const currentDate = moment()
        .tz("Asia/Manila")
        .format("YYYY-MM-DD HH:mm:ss");

      const requestData = {
        labResultDate: currentDate,
        results: labResults,
        patient_id: patientData.patient_id,
        created_at: currentDate,
        updated_at: currentDate,
      };

      const existingResults = await axiosInstance.get(
        `/results/${patientData.patient_id}`
      );
      const existingResult = existingResults.data;

      if (existingResult) {
        await axiosInstance.put(`/results/${existingResult.labResults_id}`, {
          ...requestData,
        });
      } else {
        await axiosInstance.post("/results", requestData);
      }

      // Clear the textarea by resetting the labResults state to an empty string
      setLabResults("");

      fetchLabResults(patientData);
    } catch (error) {
      console.error("Error submitting lab results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteResult = async (selectedResultId) => {
    confirm({
      title: "Are you sure you want to delete this lab result?",
      content: "This action cannot be undone.",
      onOk() {
        axiosInstance
          .delete(`/results/delete/${selectedResultId}`)
          .then((response) => {
            if (response.status === 200) {
              // Filter out the deleted result from the fetchedResults array
              const updatedResults = fetchedResults.filter(
                (result) => result.labResults_id !== selectedResultId
              );
              // Update the fetchedResults state with the new array
              setFetchedResults(updatedResults);
              message.success("Lab result deleted successfully!");
            } else {
              console.error("Failed to delete lab result.");
              message.error("Failed to delete lab result. Please try again.");
            }
          })
          .catch((error) => {
            console.error("Error deleting lab result:", error);
            message.error("Failed to delete lab result. Please try again.");
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    fetchLabResults(patientData);
  }, []);
  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Hospital Lab Results
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Lab Results:
          </Typography>
          <TextareaAutosize
            aria-label="results"
            placeholder="Enter lab results here..."
            value={labResults}
            onChange={handleInputChange}
            style={{ width: "100%", fontSize: "1.2rem" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <Spin size="large" />
          ) : fetchedResults.length > 0 ? (
            <div>
              <Typography variant="h6" gutterBottom>
                Fetched Lab Results:
              </Typography>
              {fetchedResults
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((result, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #ecf0f1",
                      borderRadius: "8px",
                      padding: "20px",
                      marginBottom: "20px",
                      background: "#fff",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      wordWrap: "break-word", // Add word wrap
                    }}
                  >
                    {/* <p style={{ marginBottom: "8px" }}>
                      <strong>Lab Results ID:</strong> {result.labResults_id}
                    </p> */}
                    <p style={{ marginBottom: "8px" }}>
                      <strong>Lab Result Date:</strong>{" "}
                      {moment(result.labResultDate)
                        .tz("Asia/Manila")
                        .format("dddd, MMMM D, YYYY HH:mm:ss")}
                    </p>
                    <p style={{ marginBottom: "8px" }}>
                      <strong>Results:</strong> {result.results}
                    </p>

                    <Button
                      key="delete"
                      onClick={() => handleDeleteResult(result.labResults_id)}
                      danger
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              <Pagination
                current={currentPage}
                total={fetchedResults.length}
                pageSize={pageSize}
                onChange={handlePageChange}
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
        </Grid>
      </Grid>
    </div>
  );
};

export default LabResultsPage;
