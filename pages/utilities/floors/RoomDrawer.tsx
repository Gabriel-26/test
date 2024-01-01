import React, { useState } from "react";
import { Drawer, Form, Input, Button } from "antd";
import axios from "../../../src/components/utils/axiosInstance";
import useFloorStore from "../../../src/components/utils/zustandStore";

const RoomDrawer = ({ visible, onClose, floorId }: any) => {
  const [roomName, setRoomName] = useState("");
  const setFloors = useFloorStore((state) => state.setFloors);

  const addRoom = async () => {
    try {
      const response = await axios.post("/Rooms", {
        room_name: roomName,
        floor_id: floorId,
      });

      // After adding a new room, update the rooms in the Zustand store
      const newRoom = {
        room_id: response.data.room_id,
        room_name: roomName,
        floor_id: floorId,
        // Add other properties as needed
      };
      // Update the rooms in the Zustand store
      //@ts-ignore
      setFloors((prevFloors: any) =>
        prevFloors.map((floor: any) =>
          floor.id === floorId
            ? { ...floor, rooms: [...floor.rooms, newRoom] }
            : floor
        )
      );

      onClose(); // Close the drawer
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  return (
    <>
      {/* <Drawer
        title="Add a Room"
        width={360}
        open={visible}
        onClose={onClose}
        destroyOnClose={true}
      > */}
      <Form onFinish={addRoom}>
        <Form.Item
          label="Room Name"
          name="room_name"
          rules={[{ required: true, message: "Please enter room name" }]}
        >
          <Input
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Room
          </Button>
        </Form.Item>
      </Form>
      {/* </Drawer> */}
    </>
  );
};

export default RoomDrawer;
