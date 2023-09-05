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
import useFloorStore from "../utils/zustandStore"; // Import the Zustand store

const FloorList = () => {
  const [floorName, setFloorName] = useState("");
  const [floorID, setFloorID] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const floors = useFloorStore((state) => state.floors);
  const setFloors = useFloorStore((state) => state.setFloors);

  const getFloors = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
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

  const addFloor = async () => {
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
    // Fetch floors and set them in the Zustand store
    getFloors().then((data) => setFloors(data));
  }, [setFloors]);

  const handleAddFloorClick = () => {
    setShowAddForm(!showAddForm);
  };

  const handleAddFloor = async () => {
    // Add a new floor
    const result = await addFloor();

    if (result) {
      // If adding is successful, update the floors in the Zustand store
      getFloors().then((data) => {
        setFloors(data);
      });

      // Clear input fields and hide the form
      setFloorName("");
      setFloorID("");
      setShowAddForm(false);
    }
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
          sx={{ color: "#03bdcc" }}
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
            fullWidth
            sx={{ color: "#03bdcc" }}
          >
            Add Floor
          </Button>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default FloorList;
