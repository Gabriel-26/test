import React, { useEffect, useState } from "react";
import axiosInstance from "../../../src/components/utils/axiosInstance";
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
  TablePagination,
} from "@mui/material";
import { Input, Form, Modal, Drawer, Spin } from "antd";
import { getUserRole } from "../../../src/components/utils/roles";
import dynamic from "next/dynamic"; // Import the dynamic function

const Button = dynamic(() => import("antd/lib/button"));
// Dynamically import Button
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [floorName, setFloorName] = useState("");
  const router = useRouter();
  const { floor_name: queryFloorName, floor_id: queryFloorId } = router.query; // Get the floor_name and floor_id from the query parameters
  const [showModal, setShowDrawer] = useState(false);
  const [showRoomDrawer, setShowRoomDrawer] = useState(false); // New state for the room drawer
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const userRole = getUserRole();

  // State for the "Add Floor" form
  const [showAddForm, setShowAddForm] = useState(false);
  const [floorNameInput, setFloorNameInput] = useState("");
  const [floorIdInput, setFloorIdInput] = useState("");

  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState("");
  const [roomFloorInput, setRoomFloorInput] = useState("");
  const [roomTypeInput, setRoomTypeInput] = useState("");
  const [roomPriceInput, setRoomPriceInput] = useState("");

  useEffect(() => {
    if (queryFloorName) {
      // If the query parameter 'floor_name' is present in the URL, set the floorName state accordingly
      setFloorName(queryFloorName as string);
    }
    fetchRooms(queryFloorId as string); // Fetch rooms after setting the floor_id
  }, [queryFloorName, queryFloorId]);

  // Function to fetch rooms
  const fetchRooms = async (floorId?: string) => {
    try {
      setLoading(true); // Set loading to true when starting data fetch

      const token = sessionStorage.getItem("authToken");
      // Set the token in Axios headers for this request
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      let url = "/rooms";

      // Check the user role in sessionStorage and set the API endpoint accordingly
      const userRole = sessionStorage.getItem("userRole");
      if (userRole === "admin") {
        url = "/admin/rooms"; // Set admin API endpoint
      }

      if (floorId) {
        // If floor_id is provided, append it to the URL as a parameter
        url += `/getRoomsByfloor/${floorId}`;
      }

      const response = await axiosInstance.get(url);
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };

  // Function to handle adding a floor
  const handleAddFloor = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      // Set the token in Axios headers for this request
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Check the user role in sessionStorage and set the API endpoint accordingly
      const userRole = sessionStorage.getItem("userRole");
      let url = "/floors";
      if (userRole === "admin") {
        url = "/admin/floors"; // Set admin API endpoint
      }

      const response = await axiosInstance.post(url, {
        floor_name: floorNameInput,
        floor_id: floorIdInput,
      });
      console.log(response.data.message);
      // Clear input fields and hide the form
      setFloorNameInput("");
      setFloorIdInput("");
      setShowAddForm(false);
      // Fetch rooms again
      fetchRooms(queryFloorId as string);
    } catch (error) {
      console.error("Error adding floor:", error);
    }
  };

  // Function to handle adding a room
  const handleAddRoom = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      // Set the token in Axios headers for this request
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Check the user role in sessionStorage and set the API endpoint accordingly
      const userRole = sessionStorage.getItem("userRole");
      let url = "/rooms";
      if (userRole === "admin") {
        url = "/admin/rooms"; // Set admin API endpoint
      }

      const response = await axiosInstance.post(url, {
        room_name: roomNameInput,
        room_floor: roomFloorInput,
        room_type: roomTypeInput,
        room_price: roomPriceInput,
        floor_id: queryFloorId as string,
      });
      console.log(response.data.message);
      // Clear input fields and hide the form
      setRoomNameInput("");
      setRoomFloorInput("");
      setRoomTypeInput("");
      setRoomPriceInput("");
      setShowAddRoomForm(false);
      // Fetch rooms again
      fetchRooms(queryFloorId as string);
    } catch (error) {
      console.error("Error adding room:", error);
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
          {/* Add the button or link beside the floorName */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {userRole === "admin" && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowAddForm(true)} // Show the "Add Floor" form
              >
                Add Floor
              </Button>
            )}

            {userRole === "admin" && (
              <Button
                variant="contained"
                color="secondary" // You can choose a different color
                onClick={() => setShowAddRoomForm(true)} // Open the room drawer
              >
                Add Room
              </Button>
            )}
          </div>
          <Spin spinning={loading}>
            {" "}
            {/* Add the Spin component here */}
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
                  {rooms
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((room) => (
                      // Step 3: Wrap the cells in a clickable element (e.g., Link)
                      <TableRow key={room.room_id}>
                        <TableCell>
                          {/* Step 4: Use next/link for navigation */}
                          <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() =>
                              router.push(
                                `/utilities/patientroom/${room.room_name}?room_id=${room.room_id}`
                              )
                            }
                          >
                            {room.room_id}
                          </span>
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
          </Spin>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rooms.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </DashboardCard>
      </PageContainer>

      {/* Add Floor Form */}
      <Modal
        title="Add Floor"
        open={showAddForm}
        onCancel={() => setShowAddForm(false)}
        onOk={handleAddFloor}
        destroyOnClose
        okButtonProps={{ style: { backgroundColor: "green" } }} // Change '#YourColorCode' to the desired color
      >
        <Form layout="vertical">
          <Form.Item name="floor_name" label="Floor Name">
            <Input
              value={floorNameInput}
              onChange={(e) => setFloorNameInput(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Room Form */}
      <Drawer
        title="Add Room"
        width={720}
        onClose={() => setShowAddRoomForm(false)}
        open={showAddRoomForm}
        destroyOnClose
        footer={null} // Remove the original footer
      >
        <Form layout="vertical">
          <Form.Item name="room_name" label="Room Name">
            <Input
              value={roomNameInput}
              onChange={(e) => setRoomNameInput(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="room_floor" label="Room Floor">
            <Input
              value={roomFloorInput}
              onChange={(e) => setRoomFloorInput(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="room_type" label="Room Type">
            <Input
              value={roomTypeInput}
              onChange={(e) => setRoomTypeInput(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="room_price" label="Room Price">
            <Input
              value={roomPriceInput}
              onChange={(e) => setRoomPriceInput(e.target.value)}
            />
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <Button
                onClick={() => setShowAddRoomForm(false)}
                style={{ marginRight: "8px" }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleAddRoom}
                style={{ backgroundColor: "green", borderColor: "green" }}
              >
                Add Room
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Rooms;
Rooms.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
