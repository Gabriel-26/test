import React, { useState, useEffect } from "react";
import { Typography, Avatar, Fab } from "@mui/material";
import { IconArrowDownRight, IconInbox } from "@tabler/icons-react";
import DashboardCard from "../shared/DashboardCard";
import axiosInstance from "../../../src/components/utils/axiosInstance"; // Import Axios instance

const RoomUpdates = () => {
  const [roomUpdates, setRoomUpdates] = useState([]);

  const formatUpdateDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can adjust the formatting as needed
  };

  // Function to fetch room updates from the API
  const fetchRoomUpdates = () => {
    const token = sessionStorage.getItem("authToken");
    const userRole = sessionStorage.getItem("userRole"); // Get the user's role from sessionStorage

    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    let endpoint = "/resActLog";

    // Check user's role and set the endpoint accordingly
    if (userRole === "chiefResident" || userRole === "resident") {
      endpoint = "/resActLog/logs/department";
    } else if (userRole === "admin") {
      // Prefix the endpoint with /admin for admin users
      endpoint = "/admin" + endpoint;
    }

    axiosInstance.get(endpoint).then(async (response) => {
      // Map the room updates to include resident last name
      const updatedRoomUpdates = await Promise.all(
        response.data.map(async (update) => {
          if (update.role === "resident" || update.role === "chiefResident") {
            let residentEndpoint = `/resActLog/residentName/${update.user_id}`;

            // If the user is an admin, add the /admin prefix to the endpoint
            if (userRole === "admin") {
              residentEndpoint = `/admin${residentEndpoint}`;
            }

            // Fetch the resident's last name using the modified endpoint
            const residentResponse = await axiosInstance.get(residentEndpoint);
            const residentLastName = residentResponse.data.lastName;

            return {
              ...update,
              residentLastName, // Add the resident's last name to the update object
            };
          }
          return update;
        })
      );

      setRoomUpdates(updatedRoomUpdates);
    });
  };

  useEffect(() => {
    fetchRoomUpdates();

    // Poll for room updates every 10 seconds (adjust the interval as needed)
    const pollingInterval = setInterval(() => {
      fetchRoomUpdates();
    }, 10000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  return (
    <DashboardCard
      title="Room Updates"
      action={
        <Fab color="primary" size="medium" sx={{ color: "#03bdcc" }}>
          <IconInbox width={24} />
        </Fab>
      }
    >
      <>
        {roomUpdates.map((update, index) => (
          <div key={index}>
            <Typography variant="body1" fontWeight="600">
              {`Resident/ Dr. ${
                update.residentLastName || update.user_id
              } has performed the action: ${update.action}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {`Update Time: ${formatUpdateDate(update.created_at)}`}
            </Typography>
            {index !== roomUpdates.length - 1 && <hr />}{" "}
            {/* Add horizontal line between updates */}
          </div>
        ))}
        {roomUpdates.length === 0 && (
          <Typography variant="body1" color="textSecondary">
            No updates at the moment.
          </Typography>
        )}
      </>
    </DashboardCard>
  );
};

export default RoomUpdates;
