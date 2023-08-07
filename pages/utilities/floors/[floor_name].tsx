import { ReactElement, useEffect, useState } from "react";
import axios from "../../../src/components/utils/axiosInstance";
import PageContainer from "../../../src/components/container/PageContainer";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import FullLayout from "../../../src/layouts/full/FullLayout";
import { useRouter } from "next/router";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link as MuiLink, // Rename the Link component to avoid conflict with next/link
} from "@mui/material";
import useFloorStore from "../../../src/components/utils/zustandStore";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [floorName, setFloorName] = useState("");
  const router = useRouter();
  const { floor_name: queryFloorName, floor_id: queryFloorId } = router.query; // Get the floor_name and floor_id from the query parameters
  const floors = useFloorStore((state) => state.floors); // Access the floors data from the Zustand store

  useEffect(() => {
    if (queryFloorName) {
      // If the query parameter 'floor_name' is present in the URL, set the floorName state accordingly
      setFloorName(queryFloorName as string);
    }
    fetchRooms(queryFloorId as string); // Fetch rooms after setting the floor_id
  }, [queryFloorName, queryFloorId]);

  const fetchRooms = async (floorId?: string) => {
    try {
      const token = sessionStorage.getItem("authToken");
      // Set the token in Axios headers for this request
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      let url = "/Rooms";
      if (floorId) {
        // If floor_id is provided, append it to the URL as a parameter
        url = `/Rooms/getRoomsByfloor/${floorId}`;
      }

      const response = await axios.get(url);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Step 2: Define a function to handle navigation to another page
  return (
    <div>
      <PageContainer
        title={floorName || "Loading..."}
        description="This is Sample page"
      >
        <DashboardCard title={floorName || "Loading..."}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room ID</TableCell>
                  <TableCell>Room Name</TableCell>
                  <TableCell>Floor</TableCell>
                  <TableCell>Room Type</TableCell>
                  <TableCell>Floor ID</TableCell>
                  <TableCell>Room Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  // Step 3: Wrap the cells in a clickable element (e.g., Link)
                  <TableRow key={room.room_id}>
                    <TableCell>
                      {/* Step 4: Use next/link for navigation */}
                      <MuiLink
                        href={`/utilities/patientroom/${room.room_name}?room_id=${room.room_id}`}
                      >
                        {/* The room_id is displayed as a link */}
                        {room.room_id}
                      </MuiLink>
                    </TableCell>
                    <TableCell>{room.room_name}</TableCell>
                    <TableCell>{room.room_floor}</TableCell>
                    <TableCell>{room.room_type}</TableCell>
                    <TableCell>{room.floor_id}</TableCell>
                    <TableCell>{room.room_price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DashboardCard>
      </PageContainer>
    </div>
  );
};

export default Rooms;
Rooms.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
