import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Button,
  Collapse,
  Typography,
  Box,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import DashboardCard from "../shared/DashboardCard";

const FloorList = () => {
  const [floors, setFloors] = useState([]);
  const [floorName, setFloorName] = useState("");
  const [floorID, setFloorID] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const getFloors = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      // Set the token in Axios headers for this request
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const response = await axiosInstance.get("/floors");
      return response.data;
    } catch (error) {
      console.error("Error fetching floors:", error);
      return [];
    }
  };

  const addFloor = async (floorName, floorID) => {
    try {
      const response = await axiosInstance.post("/floors", {
        floor_name: floorName,
        floor_id: floorID,
      });
      console.log(response.data.message);
      return response.data;
    } catch (error) {
      console.error("Error adding floor:", error);
      return null;
    }
  };

  useEffect(() => {
    getFloors().then((data) => setFloors(data));
  }, []);

  const handleAddFloorClick = () => {
    setShowAddForm(!showAddForm);
  };

  const handleAddFloor = () => {
    addFloor(floorName, floorID).then(() => {
      setShowAddForm(false);
      setFloorName("");
      setFloorID("");
      getFloors().then((data) => setFloors(data));
    });
  };

  return (
    <Box mt={4} maxWidth="300px" mx="auto" p={2}>
      <Paper elevation={1}>
        <List>
          <Typography variant="h5" gutterBottom paddingLeft={2}>
            Floors
          </Typography>
          {floors.map((floor) => (
            <ListItem key={floor.floor_id}>
              <ListItemText
                primary={floor.floor_name}
                style={{ textAlign: "center" }}
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFloorClick}
          fullWidth
        >
          {showAddForm ? "Cancel" : "Add Floor"}
        </Button>
        <Collapse in={showAddForm}>
          <TextField
            label="Floor ID"
            value={floorID}
            onChange={(e) => setFloorID(e.target.value)}
            fullWidth
          />
          <TextField
            label="Floor Name"
            value={floorName}
            onChange={(e) => setFloorName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddFloor}
            fullWidth // Set the width to 100%
          >
            Add Floor
          </Button>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default FloorList;
