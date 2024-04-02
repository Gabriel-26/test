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
import { Input, Form, Modal, Drawer, Spin, Select, message } from "antd";
import { getUserRole } from "../../../src/components/utils/roles";
import dynamic from "next/dynamic";
import useFloorStore from "../../../src/components/utils/zustandStore";
import roomAddIcon from "../../../src/assets/images/icons/hospitalAdd.png";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { BsBuildingFillAdd } from "react-icons/bs";

const Button = dynamic(() => import("antd/lib/button"));
const { Option } = Select;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const { floors, setFloors } = useFloorStore(); // Replace floors state with useFloorStore
  const [floorName, setFloorName] = useState("");
  const router = useRouter();
  const { floor_name: queryFloorName, floor_id: queryFloorId } = router.query;
  const [showModal, setShowDrawer] = useState(false);
  const [showRoomDrawer, setShowRoomDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const userRole = getUserRole();

  const [showAddForm, setShowAddForm] = useState(false);
  const [floorNameInput, setFloorNameInput] = useState("");
  const [floorIdInput, setFloorIdInput] = useState("");

  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState("");
  const [roomFloorInput, setRoomFloorInput] = useState("");
  const [roomTypeInput, setRoomTypeInput] = useState("");
  const [roomPriceInput, setRoomPriceInput] = useState("");

  const [showEditFloorModal, setShowEditFloorModal] = useState(false);
  const [editFloorName, setEditFloorName] = useState("");
  const [editFloorId, setEditFloorId] = useState("");

  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [editRoomId, setEditRoomId] = useState("");
  const [editRoomName, setEditRoomName] = useState("");
  const [editRoomFloor, setEditRoomFloor] = useState("");
  const [editRoomType, setEditRoomType] = useState("");
  const [editRoomPrice, setEditRoomPrice] = useState("");

  const [showDeleteFloorModal, setShowDeleteFloorModal] = useState(false);
  const [deleteFloorId, setDeleteFloorId] = useState("");

  const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState([]);

  useEffect(() => {
    if (queryFloorName) {
      setFloorName(queryFloorName as string);
    }
    fetchRooms(queryFloorId as string);
    fetchFloors();
  }, [queryFloorName, queryFloorId]);

  const fetchFloors = async () => {
    try {
      const userRole = localStorage.getItem("userRole");
      let url = userRole === "admin" ? "admin/floors" : "/floors";

      const response = await axiosInstance.get(url);
      setFloors(response.data);
    } catch (error) {
      console.error("Error fetching floors:", error);
    }
  };

  const fetchRooms = async (floorId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      let url = "/rooms";
      const userRole = localStorage.getItem("userRole");
      if (userRole === "admin") {
        url = "/admin/rooms";
      }

      if (floorId) {
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

  const handleEditFloor = (floorId, floorName) => {
    setEditFloorId(floorId);
    setEditFloorName(floorName);
    setShowEditFloorModal(true);
  };

  const handleDeleteFloor = (floorId) => {
    setDeleteFloorId(floorId);
    setShowDeleteFloorModal(true);
  };

  const handleEditRoom = (roomId, roomName, roomFloor, roomType, roomPrice) => {
    setEditRoomId(roomId);
    setEditRoomName(roomName);
    setEditRoomFloor(roomFloor);
    setEditRoomType(roomType);
    setEditRoomPrice(roomPrice);
    setShowEditRoomModal(true);
  };

  const handleDeleteRoom = (roomId) => {
    setDeleteRoomId(roomId);
    setShowDeleteRoomModal(true);
  };

  // Updated function to handle floor selection in the dropdown
  const handleEditFloorSelect = (value) => {
    setEditFloorId(value);

    // Fetch the floor_name based on the selected floor_id
    const selectedFloor = floors.find((floor) => floor.floor_id === value);
    if (selectedFloor) {
      setEditFloorName(selectedFloor.floor_name);
    }
  };

  const handleConfirmEditFloor = async () => {
    try {
      const response = await axiosInstance.put(
        `admin/floors/updateFloor/${editFloorId}`,
        {
          floor_name: editFloorName,
          floor_id: editFloorId, // Include the floor_id in the update
        }
      );

      // Fetch floors again after the edit is completed
      fetchFloors();

      // Display success message
      message.success("Floor updated successfully");
    } catch (error) {
      console.error("Error updating floor:", error);

      // Display error message
      message.error("Error updating floor. Please try again.");
    }

    // Reset state
    setEditFloorId(""); // Resetting editFloorId
    setEditFloorName(""); // Resetting editFloorName
    setShowEditFloorModal(false);
  };

  const handleConfirmDeleteFloor = async () => {
    try {
      const response = await axiosInstance.delete(
        `admin/floors/${deleteFloorId}`
      );

      // Fetch floors again after the delete is completed
      fetchFloors();
      fetchRooms(queryFloorId as string);

      // Display success message
      message.success("Floor deleted successfully");
    } catch (error) {
      console.error("Error deleting floor:", error);

      // Display error message
      message.error("Error deleting floor. Please try again.");
    }

    // Reset state
    setDeleteFloorId("");
    setShowDeleteFloorModal(false);
  };

  const handleConfirmEditRoom = async () => {
    try {
      const response = await axiosInstance.put(
        `admin/rooms/updateRoom/${editRoomId}`,
        {
          room_name: editRoomName,
          room_floor: editRoomFloor,
          room_type: editRoomType,
          room_price: editRoomPrice,
          floor_id: editRoomFloor, // Include the floor_id in the update
        }
      );
  
      // Fetch rooms again after the edit is completed
      fetchRooms(queryFloorId as string);
  
      // Display success message
      message.success("Room updated successfully");
    } catch (error) {
      console.error("Error updating room:", error);
  
      // Display error message
      message.error("Error updating room. Please try again.");
    }
  
    // Reset state
    setEditRoomId("");
    setEditRoomName("");
    setEditRoomFloor("");
    setEditRoomType("");
    setEditRoomPrice("");
    setShowEditRoomModal(false);
  };
  

  const handleConfirmDeleteRoom = async () => {
    try {
      const response = await axiosInstance.delete(
        `admin/rooms/delete/${deleteRoomId}`
      );

      // Fetch rooms again after the delete is completed
      fetchRooms(queryFloorId as string);

      // Display success message
      message.success("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting room:", error);

      // Display error message
      message.error("Error deleting room. Please try again.");
    }

    // Reset state
    // setDeleteRoomId("");
    setShowDeleteRoomModal(false);
  };

  const handleAddFloor = async () => {
    try {
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const userRole = localStorage.getItem("userRole");
      let url = "/floors";
      if (userRole === "admin") {
        url = "/admin/floors";
      }

      const response = await axiosInstance.post(url, {
        floor_name: floorNameInput,
        floor_id: floorIdInput,
      });

      // Fetch floors again after the add is completed
      fetchFloors();
      fetchRooms(queryFloorId as string);

      // Display success message
      message.success("Floor added successfully");
    } catch (error) {
      console.error("Error adding floor:", error);

      // Display error message
      message.error("Error adding floor. Please try again.");
    }

    // Reset state
    setFloorNameInput("");
    setFloorIdInput("");
    setShowAddForm(false);
  };

  const handleAddRoom = async () => {
    try {
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const userRole = localStorage.getItem("userRole");
      let url = "/rooms";
      if (userRole === "admin") {
        url = "/admin/rooms";
      }

      const response = await axiosInstance.post(url, {
        room_name: roomNameInput,
        room_floor: roomFloorInput,
        room_type: roomTypeInput,
        room_price: roomPriceInput,
        floor_id: queryFloorId as string,
      });

      // Fetch rooms again after the add is completed
      fetchRooms(queryFloorId as string);

      // Display success message
      message.success("Room added successfully");
    } catch (error) {
      console.error("Error adding room:", error);

      // Display error message
      message.error("Error adding room. Please try again.");
    }

    // Reset state
    setRoomNameInput("");
    setRoomFloorInput("");
    setRoomTypeInput("");
    setRoomPriceInput("");
    setShowAddRoomForm(false);
  };

  // Step 2: Define a function to handle navigation to another page
  return (
    <div>
      <PageContainer title={floorName || "Loading..."}>
        <DashboardCard title={floorName || "Loading..."}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {userRole === "admin" && (
              <div>
                <Button
                  icon={<BsBuildingFillAdd style={{ fontSize: "20px" }} />}
                  color="secondary"
                  onClick={() => setShowAddForm(true)}
                ></Button>
                <Button
                  icon={<FiEdit style={{ fontSize: "20px" }} />}
                  color="primary"
                  onClick={() => handleEditFloor(editFloorId, editFloorName)}
                ></Button>
                <Button
                  icon={<MdDelete style={{ fontSize: "20px" }} />}
                  color="secondary"
                  onClick={() => handleDeleteFloor(deleteFloorId)}
                ></Button>
              </div>
            )}

            {userRole === "admin" && (
              <Button
                icon={
                  <img
                    src={roomAddIcon.src}
                    alt="Add Room"
                    style={{ width: "24px", height: "24px" }}
                  />
                }
                onClick={() => {
                  setShowAddRoomForm(true);
                }}
              />
            )}
          </div>
          <Spin spinning={loading}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }}>
                      Room ID
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      Room Name
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>Floor</TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      Room Type
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      Floor ID
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      Room Price
                    </TableCell>
                    {userRole === "admin" && ( // Only render Actions column for admin role
                      <TableCell style={{ textAlign: "center" }}>
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((room) => (
                      <TableRow key={room.room_id}>
                        <TableCell style={{ textAlign: "center" }}>
                          {userRole === "admin" ? (
                            // Display room_id without link for admin
                            room.room_id
                          ) : (
                            // Make room_id clickable for non-admin users
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
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {room.room_name}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {room.room_floor}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {room.room_type}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {room.floor_id}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {room.room_price}
                        </TableCell>
                        {userRole === "admin" && ( // Only render Actions for admin role
                          <TableCell style={{ textAlign: "center" }}>
                            <Button
                              icon={<FiEdit style={{ fontSize: "20px" }} />}
                              onClick={() =>
                                handleEditRoom(
                                  room.room_id,
                                  room.room_name,
                                  room.room_floor,
                                  room.room_type,
                                  room.room_price
                                )
                              }
                            >
                              {/* <FiEdit style={{ fontSize: "20px" }} /> */}
                            </Button>
                            <Button
                              icon={<MdDelete style={{ fontSize: "20px" }} />}
                              onClick={() => handleDeleteRoom(room.room_id)}
                            >
                              {/* <MdDelete style={{ fontSize: "20px" }} /> */}
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Spin>
          <TablePagination
            rowsPerPageOptions={[8]}
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
      <Modal
        title="Add Floor"
        open={showAddForm}
        onCancel={() => setShowAddForm(false)}
        onOk={handleAddFloor}
        destroyOnClose
        okButtonProps={{ style: { backgroundColor: "green" } }}
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
      <Drawer
        title="Add Room"
        width={300}
        onClose={() => setShowAddRoomForm(false)}
        open={showAddRoomForm}
        destroyOnClose
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item name="room_name" label="Room Name">
            <Input
              value={roomNameInput}
              onChange={(e) => setRoomNameInput(e.target.value)}
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
              type="number" // Use the type attribute to ensure numeric input
              value={roomPriceInput}
              onChange={(e) => {
                // Use a regular expression to allow only numbers
                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                setRoomPriceInput(numericValue);
              }}
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
      {/* Edit Floor Modal */}
      <Modal
        title="Edit Floor"
        open={showEditFloorModal}
        onCancel={() => setShowEditFloorModal(false)}
        onOk={handleConfirmEditFloor}
        okButtonProps={{ style: { backgroundColor: "green" } }}
      >
        <Form layout="vertical">
          {/* Dropdown to select floor */}
          <Form.Item label="Select Floor" name="editFloor">
            <Select
              placeholder="Select a floor"
              onChange={(value) => handleEditFloorSelect(value)}
              value={editFloorId}
            >
              {floors.map((floor) => (
                <Option key={floor.floor_id} value={floor.floor_id}>
                  {floor.floor_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Input field for editing floor_name */}
          <Form.Item label="Edit Floor Name" name="editFloorName">
            <Input
              value={editFloorName}
              onChange={(e) => setEditFloorName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Delete Floor Modal */}
      <Modal
        title="Delete Floor"
        open={showDeleteFloorModal}
        onCancel={() => setShowDeleteFloorModal(false)}
        onOk={handleConfirmDeleteFloor}
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red" },
        }}
      >
        <Form.Item label="Select Floor" name="deleteFloor">
          <Select
            placeholder="Select a floor"
            onChange={(value) => setDeleteFloorId(value)}
          >
            {floors.map((floor) => (
              <Option key={floor.floor_id} value={floor.floor_id}>
                {floor.floor_name}
              </Option>
            ))}
          </Select>
        </Form.Item>{" "}
      </Modal>
      {/* Edit Room Modal */}
      <Modal
        title="Edit Room"
        open={showEditRoomModal}
        onCancel={() => setShowEditRoomModal(false)}
        onOk={handleConfirmEditRoom}
        okButtonProps={{ style: { backgroundColor: "green" } }}
      >
        <Form>
          <Form.Item label="Room Name">
            <Input
              value={editRoomName}
              onChange={(e) => setEditRoomName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Room Type">
            <Input
              value={editRoomType}
              onChange={(e) => setEditRoomType(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Room Price">
            <Input
              value={editRoomPrice}
              onChange={(e) => setEditRoomPrice(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Delete Room Modal */}
      <Modal
        title="Delete Room"
        open={showDeleteRoomModal}
        onCancel={() => setShowDeleteRoomModal(false)}
        onOk={handleConfirmDeleteRoom}
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red" },
        }}
      >
        <p>Are you sure you want to delete this room?</p>
      </Modal>
    </div>
  );
};

export default Rooms;
Rooms.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
