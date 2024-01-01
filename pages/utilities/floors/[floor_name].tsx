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
import { Input, Form, Modal, Drawer, Spin, Select } from "antd";
import { getUserRole } from "../../../src/components/utils/roles";
import dynamic from "next/dynamic";

const Button = dynamic(() => import("antd/lib/button"));
const { Option } = Select;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [floorName, setFloorName] = useState("");
  const router = useRouter();
  const { floor_name: queryFloorName, floor_id: queryFloorId } = router.query;
  const [showModal, setShowDrawer] = useState(false);
  const [showRoomDrawer, setShowRoomDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
      const response = await axiosInstance.get("admin/floors");
      setFloors(response.data);
    } catch (error) {
      console.error("Error fetching floors:", error);
    }
  };

  const fetchRooms = async (floorId) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      let url = "/rooms";
      const userRole = sessionStorage.getItem("userRole");
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
    } catch (error) {
      console.error("Error updating floor:", error);
    }

    // Reset state
    setEditFloorId("");
    setEditFloorName("");
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
    } catch (error) {
      console.error("Error deleting floor:", error);
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
        }
      );

      // Fetch rooms again after the edit is completed
      fetchRooms(queryFloorId as string);
    } catch (error) {
      console.error("Error updating room:", error);
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
        `admin/rooms/${deleteRoomId}`
      );

      // Fetch rooms again after the delete is completed
      fetchRooms(queryFloorId as string);
    } catch (error) {
      console.error("Error deleting room:", error);
    }

    // Reset state
    // setDeleteRoomId("");
    setShowDeleteRoomModal(false);
  };

  const handleAddFloor = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const userRole = sessionStorage.getItem("userRole");
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
    } catch (error) {
      console.error("Error adding floor:", error);
    }

    // Reset state
    setFloorNameInput("");
    setFloorIdInput("");
    setShowAddForm(false);
  };

  const handleAddRoom = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const userRole = sessionStorage.getItem("userRole");
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
    } catch (error) {
      console.error("Error adding room:", error);
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
      <PageContainer
        title={floorName || "Loading..."}
        description="This is Sample page"
      >
        <DashboardCard title={floorName || "Loading..."}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {userRole === "admin" && (
              <Button
                // variant="contained"
                color="secondary"
                onClick={() => setShowAddForm(true)}
              >
                Add Floor
              </Button>
            )}
            {userRole === "admin" && (
              <div>
                <Button
                  color="primary"
                  onClick={() => handleEditFloor(editFloorId, editFloorName)}
                >
                  Edit Floor
                </Button>

                <Button
                  color="secondary"
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleDeleteFloor(deleteFloorId)}
                >
                  Delete Floor
                </Button>
              </div>
            )}

            {userRole === "admin" && (
              <Button
                // variant="contained"
                color="secondary"
                onClick={() => setShowAddRoomForm(true)}
              >
                Add Room
              </Button>
            )}
          </div>
          <Spin spinning={loading}>
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
                    {userRole === "admin" && ( // Only render Actions column for admin role
                      <TableCell>Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((room) => (
                      <TableRow key={room.room_id}>
                        <TableCell>
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
                        {userRole === "admin" && ( // Only render Actions for admin role
                          <TableCell>
                            <Button
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
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteRoom(room.room_id)}
                            >
                              Delete
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
        width={720}
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
      {/* Edit Floor Modal */}
      <Modal
        title="Edit Floor"
        visible={showEditFloorModal}
        onCancel={() => setShowEditFloorModal(false)}
        onOk={handleConfirmEditFloor}
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
      ;{/* Delete Floor Modal */}
      <Modal
        title="Delete Floor"
        visible={showDeleteFloorModal}
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
        visible={showEditRoomModal}
        onCancel={() => setShowEditRoomModal(false)}
        onOk={handleConfirmEditRoom}
      >
        <Form>
          <Form.Item label="Room Name">
            <Input
              value={editRoomName}
              onChange={(e) => setEditRoomName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Room Floor">
            <Input
              value={editRoomFloor}
              onChange={(e) => setEditRoomFloor(e.target.value)}
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
        visible={showDeleteRoomModal}
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
