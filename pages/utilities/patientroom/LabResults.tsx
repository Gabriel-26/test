import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextareaAutosize,
  Button,
  Grid,
} from "@mui/material";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { Spin, Alert } from "antd";

const LabResultsPage = ({ patientData }) => {
  const [labResults, setLabResults] = useState("");
  const [fetchedResults, setFetchedResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch lab results when component mounts
    fetchLabResults(patientData);
  }, []);

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
      // Check if labResults is empty or null
      if (!labResults) {
        console.error("Lab results cannot be empty.");
        return;
      }

      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const requestData = {
        labResultDate: formattedDate,
        results: labResults,
        patient_id: patientData.patient_id,
        created_at: formattedDate,
        updated_at: formattedDate,
      };

      // Fetch existing lab results
      const existingResults = await axiosInstance.get(
        `/results/${patientData.patient_id}`
      );
      const existingResult = existingResults.data;

      if (existingResult) {
        // If lab result already exists, update it using PUT request
        await axiosInstance.put(`/results/${existingResult.labResults_id}`, {
          ...requestData,
        });
      } else {
        // If lab result doesn't exist, create it using POST request
        await axiosInstance.post("/results", requestData);
      }
      // Refresh lab results after submission
      fetchLabResults(patientData);
    } catch (error) {
      console.error("Error submitting lab results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h3" align="center" gutterBottom>
          Hospital Lab Results
        </Typography>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Enter Lab Results:
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
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
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
                  <Typography variant="h5" gutterBottom>
                    Fetched Lab Results:
                  </Typography>
                  {fetchedResults.map((result, index) => (
                    <Typography key={index} variant="body1" gutterBottom>
                      Lab Results ID: {result.labResults_id}
                      <br />
                      Lab Result Date: {result.labResultDate}
                      <br />
                      Results: {result.results}
                      <br />
                      Patient ID: {result.patient_id}
                      <br />
                      Created At: {result.created_at}
                      <br />
                      Updated At: {result.updated_at}
                      <br />
                    </Typography>
                  ))}
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
        </Paper>
      </Box>
    </Container>
  );
};

export default LabResultsPage;
