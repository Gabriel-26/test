import { useState, useEffect, ReactElement } from "react";
import { Table, Button, message } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import FullLayout from "../../../src/layouts/full/FullLayout";
import PageContainer from "../../../src/components/container/PageContainer";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const AssignedRoomsPage: React.FC = () => {
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    // {
    //   title: "Assigned Room ID",
    //   dataIndex: "resAssRoom_id",
    //   key: "resAssRoom_id",
    // },
    {
      title: "Room Name",
      dataIndex: "room_name",
      key: "room_name",
    },
    {
      title: "Is Finished",
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
  ];

  const fetchAssignedRooms = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);

      const response = await axiosInstance.get(`/resident-assigned-rooms`); // Update the route

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
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);

      const response = await axiosInstance.put(
        `/resAssRooms/${resAssRoom_id}/updateIsFinished`,
        { isFinished: isFinished ? 1 : 0 } // Toggle between 0 and 1
      );
      console.log("API Response:", response); // Log the response

      if (response.status === 200) {
        // Update the local state or refetch the data
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
          pagination={false}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default AssignedRoomsPage;

AssignedRoomsPage.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
