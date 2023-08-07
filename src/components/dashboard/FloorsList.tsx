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

  const addFloor = async (floorName: string, floorID: string) => {
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
  }, [setFloors]);

  const handleAddFloorClick = () => {
    setShowAddForm(!showAddForm);
  };

  const handleAddFloor = () => {
    addFloor(floorName, floorID).then(() => {
      setShowAddForm(false);
      setFloorName("");
      setFloorID("");
      // After adding a new floor, update the floors in the Zustand store
      getFloors().then((data) => {
        setFloors(data); // Update the floors in the Zustand store
      });
    });
  };

  return (
    <Box mt={4} maxWidth="300px" mx="auto" p={2}>
      <Paper elevation={1}>
        <List>
          <Typography variant="h5" gutterBottom paddingLeft={2}>
            Floors
          </Typography>
          {floors.map(
            (floor: {
              floor_id: React.Key | null | undefined;
              floor_name:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | React.PromiseLikeOfReactNode
                | null
                | undefined;
            }) => (
              <ListItem key={floor.floor_id}>
                <ListItemText
                  primary={floor.floor_name}
                  style={{ textAlign: "center" }}
                />
              </ListItem>
            )
          )}
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
            fullWidth // Set the width to 100%
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
