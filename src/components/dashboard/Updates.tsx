import React from "react";
import { Typography, Avatar, Fab } from "@mui/material";
import { IconArrowDownRight, IconInbox } from "@tabler/icons-react";
import DashboardCard from "../shared/DashboardCard";

const RoomUpdates = () => {
  // Mock data for demonstration purposes
  const roomUpdates = [
    {
      residentName: "Dr. Smith",
      roomNumber: "102",
      floorName: "Annex A",
      timestamp: "2023-08-03 10:15:00",
    },
    {
      residentName: "Dr. Johnson",
      roomNumber: "205",
      floorName: "Annex B",
      timestamp: "2023-08-03 12:30:00",
    },
    // Add more mock updates here...
  ];

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
              {`Resident/ Dr. ${update.residentName} has updated details/information of room ${update.roomNumber} ${update.floorName}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {`Update Time: ${update.timestamp}`}
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
