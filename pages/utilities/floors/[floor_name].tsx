import { ReactElement, useEffect, useState } from "react";
import axios from "../../../src/components/utils/axiosInstance";
import // ... (other imports remain the same)
"@mui/material";
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
} from "@mui/material";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [floorName, setFloorName] = useState("");
  const router = useRouter();
  const { floor_name: queryFloorName, floor_id: queryFloorId } = router.query; // Get the floor_name and floor_id from the query parameters

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
        // If floor_id is provided, append it to the URL query parameters
        url += `?floor_id=${floorId}`;
      }

      const response = await axios.get(url);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
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
                  <TableCell>Building</TableCell>
                  <TableCell>Room Type</TableCell>
                  <TableCell>Floor ID</TableCell>
                  <TableCell>Room Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.room_id}>
                    <TableCell>{room.room_id}</TableCell>
                    <TableCell>{room.room_name}</TableCell>
                    <TableCell>{room.room_building}</TableCell>
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
