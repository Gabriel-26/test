import { useState, useEffect, ReactElement } from "react";
import { Table, Button, message } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import FullLayout from "../../../src/layouts/full/FullLayout";
import PageContainer from "../../../src/components/container/PageContainer";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import React from "react";
import { useRouter } from "next/router"; // Import the useRouter hook

const AssignedRoomsPage: React.FC = () => {
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the useRouter hook

  const columns = [
    {
      title: "Room Name",
      dataIndex: "room_name",
      key: "room_name",
    },
    {
      title: "Status",
      dataIndex: "isFinished",
      key: "isFinished",
      render: (text, record) => (
        <>
          {text ? (
            <CheckOutlined style={{ color: "green", fontSize: "16px" }} />
          ) : (
            <CloseOutlined style={{ color: "red", fontSize: "16px" }} />
          )}
          <Button
            onClick={() => handleUpdateIsFinished(record.resAssRoom_id, !text)}
            style={{ marginLeft: "8px" }}
          >
            {text ? "Mark Unfinished" : "Mark Finished"}
          </Button>
        </>
      ),
    },
    {
      title: "View Room",
      key: "view",
      render: (text, record) => (
        <Button onClick={() => handleViewRoom(record)}>
          {" "}
          {/* Pass the entire room object to handleViewRoom */}
          View Room
        </Button>
      ),
    },
  ];

  const fetchAssignedRooms = async () => {
    try {
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);

      const response = await axiosInstance.get(`/resident-assigned-rooms`);

      if (response.status === 200) {
        setAssignedRooms(response.data);
      }
    } catch (error) {
      console.error("Error fetching assigned rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIsFinished = async (resAssRoom_id, isFinished) => {
    try {
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);

      const response = await axiosInstance.put(
        `/resAssRooms/${resAssRoom_id}/updateIsFinished`,
        { isFinished: isFinished ? 1 : 0 }
      );
      console.log("API Response:", response);

      if (response.status === 200) {
        fetchAssignedRooms();
        message.success("Update successful");
      }
    } catch (error) {
      console.error("Error updating isFinished status:", error);
      message.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoom = (room) => {
    const { room_id, room_name } = room; // Destructure room_id and room_name
    const url = `/utilities/patientroom/${room_name}?room_id=${room_id}`; // Construct the URL
    router.push(url); // Navigate to the room page
  };

  useEffect(() => {
    fetchAssignedRooms();
  }, []);

  return (
    <PageContainer
      title="Assigned Rooms"
      description="View your assigned rooms here."
    >
      <DashboardCard title={"Your Assigned Rooms" || "Loading..."}>
        <h1 className="text-3xl font-bold mb-4">Assigned Rooms</h1>
        <Table
          dataSource={assignedRooms}
          columns={columns}
          rowKey={(record) => record.resAssRoom_id}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default AssignedRoomsPage;

/* @ts-ignore */
AssignedRoomsPage.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
