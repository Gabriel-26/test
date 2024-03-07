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
  const [pageSize, setPageSize] = useState(3);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedResult, setEditedResult] = useState({
    labResults_id: "",
    labResultDate: "",
    results: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  const fetchLabResults = async () => {
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
        await axiosInstance.put(
          `/results/${existingResult.labResults_id}`,
          requestData
        );
      } else {
        await axiosInstance.post("/results", requestData);
      }

      // Clear the textarea by resetting the labResults state to an empty string
      setLabResults("");

      // Close the modal after submitting
      setAddModalVisible(false);

      fetchLabResults();
      message.success("Lab result added successfully!");
    } catch (error) {
      console.error("Error submitting lab results:", error);
      message.error("Failed to add lab result. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditResult = (result) => {
    setEditedResult(result);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    setEditLoading(true);
    try {
      const { labResults_id, labResultDate, results } = editedResult;
      const currentDate = moment()
        .tz("Asia/Manila")
        .format("YYYY-MM-DD HH:mm:ss");

      const requestData = {
        labResultDate,
        results,
        patient_id: patientData.patient_id,
        updated_at: currentDate,
      };

      await axiosInstance.put(`/results/${labResults_id}`, requestData);

      // Close the edit modal after updating
      setEditModalVisible(false);

      fetchLabResults();
      message.success("Lab result updated successfully!");
    } catch (error) {
      console.error("Error updating lab result:", error);
      message.error("Failed to update lab result. Please try again.");
    } finally {
      setEditLoading(false);
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
              const updatedResults = fetchedResults.filter(
                (result) => result.labResults_id !== selectedResultId
              );
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
    fetchLabResults();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Hospital Lab Results
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" marginBottom="1rem">
            <Button
              type="primary"
              onClick={() => setAddModalVisible(true)}
              className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
            >
              Add Lab Result
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
                      wordWrap: "break-word",
                    }}
                  >
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
                      key="edit"
                      onClick={() => handleEditResult(result)}
                      style={{ marginRight: "8px" }}
                    >
                      Edit
                    </Button>
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

      <Modal
        title="Add Lab Result"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
      >
        <TextareaAutosize
          aria-label="results"
          placeholder="Enter lab results here..."
          value={labResults}
          onChange={handleInputChange}
          style={{ width: "100%", fontSize: "1.2rem" }}
        />
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Modal>

      <Modal
        title="Edit Lab Result"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={editLoading}
            onClick={handleUpdate}
          >
            Update
          </Button>,
        ]}
      >
        <TextareaAutosize
          aria-label="results"
          placeholder="Enter lab results here..."
          value={editedResult.results}
          onChange={(e) =>
            setEditedResult({ ...editedResult, results: e.target.value })
          }
          style={{ width: "100%", fontSize: "1.2rem" }}
        />
      </Modal>
    </div>
  );
};

export default LabResultsPage;
