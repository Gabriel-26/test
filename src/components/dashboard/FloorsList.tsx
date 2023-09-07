import React, { useState } from "react";
import { Button, Input, Form, Drawer, InputNumber } from "antd";
import axiosInstance from "../utils/axiosInstance";
import useFloorStore from "../utils/zustandStore";

const FloorList = () => {
  const [floorName, setFloorName] = useState("");
  const [floorID, setFloorID] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleAddFloor = async () => {
    // Add a new floor
    const result = await addFloor();

    if (result) {
      // Clear input fields
      setFloorName("");
      setFloorID("");
      setShowAddForm(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowAddForm(true)}
      >
        Add Floor
      </Button>
      <Drawer
        title="Add Floor"
        width={720}
        onClose={() => setShowAddForm(false)}
        visible={showAddForm}
        destroyOnClose
        footer={
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => setShowAddForm(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleAddFloor}>
              Add Floor
            </Button>
          </div>
        }
      >
        <Form layout="vertical">
          <Form.Item name="floor_id" label="Floor ID">
            <Input
              value={floorID}
              onChange={(e) => setFloorID(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="floor_name" label="Floor Name">
            <Input
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default FloorList;
