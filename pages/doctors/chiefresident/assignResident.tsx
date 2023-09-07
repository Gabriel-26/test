import { useState, useEffect, ReactElement } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Table,
  Select,
  Space,
  Modal,
  message,
  Row,
  Col,
} from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import FullLayout from "../../../src/layouts/full/FullLayout";
import PageContainer from "../../../src/components/container/PageContainer";
import DashboardCard from "../../../src/components/shared/DashboardCard";

const { Option } = Select;

const AssignResidentRoom = () => {
  const [form] = Form.useForm();
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedResidentId, setSelectedResidentId] = useState(null);
  const [residents, setResidents] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const assignedColumns = [
    {
      title: "Assigned Room ID",
      dataIndex: "resAssRoom_id",
      key: "resAssRoom_id",
    },
    {
      title: "Room ID",
      dataIndex: "room_id",
      key: "room_id",
    },
    {
      title: "Resident ID",
      dataIndex: "resident_id",
      key: "resident_id",
    },
    {
      title: "Is Finished",
      dataIndex: "isFinished",
      key: "isFinished",
      render: (text) => (text ? "Yes" : "No"), // You can format this as needed
    },
  ];

  const mainTableColumns = [
    {
      title: "Resident ID",
      dataIndex: "resident_id",
      key: "resident_id",
    },
    {
      title: "Is Finished",
      dataIndex: "isFinished",
      key: "isFinished",
      render: (text) => (text ? "Yes" : "No"),
    },
  ];

  const unassignedColumns = [
    {
      title: "Resident ID",
      dataIndex: "resident_id",
      key: "resident_id",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Select
            style={{ width: 120 }}
            placeholder="Select Room"
            onChange={(value) => setSelectedRoomId(value)}
          >
            {rooms.map((room) => (
              <Option key={room.room_id} value={room.room_id}>
                {room.room_id}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            onClick={() => {
              setSelectedResidentId(record.resident_id);
              showConfirmationModal();
            }}
          >
            Assign Room
          </Button>
        </Space>
      ),
    },
  ];

  const showConfirmationModal = () => {
    setIsModalVisible(true);
  };

  const handleAssignmentCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleAssignmentConfirm = () => {
    // Perform the assignment logic here
    handleRoomChange(selectedResidentId, selectedRoomId);
    setIsModalVisible(false); // Close the modal
  };

  const handleRoomChange = async (selectedResidentId, selectedRoomId) => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);
      const response = await axiosInstance.post("/resAssRooms", {
        resident_id: selectedResidentId,
        room_id: selectedRoomId,
        isFinished: false,
      });

      if (response.status === 200) {
        console.log("Resident assigned to room successfully.");
        message.success("Resident assigned to room successfully.");
        setSelectedRoomId(null);
        fetchAssignedRooms();
      }
    } catch (error) {
      console.error("Error assigning resident to room:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedRooms = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);

      const response = await axiosInstance.get(`/resAssRooms`);

      if (response.status === 200) {
        setAssignedRooms(response.data);
      }
    } catch (error) {
      console.error("Error fetching assigned rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);

      const response = await axiosInstance.get(`/rooms`);

      if (response.status === 200) {
        console.log("Fetched rooms:", response.data); // Add this line to check the fetched data

        setRooms(response.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);

      const response = await axiosInstance.get("/residents");

      if (response.status === 200) {
        // Filter residents by their roles
        const filteredResidents = response.data.filter(
          (resident) => resident.role === "resident"
        );

        setResidents(filteredResidents);
      }
    } catch (error) {
      console.error("Error fetching residents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedRooms();
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchResidents();
    // Fetch residents data when the component mounts
  }, []);

  const renderAssignedRooms = (record) => {
    const assignedRoomsForResident = assignedRooms.filter(
      (room) => room.resident_id === record.resident_id
    );

    return (
      <Table
        dataSource={assignedRoomsForResident}
        columns={assignedColumns}
        rowKey={(record) => record.resAssRoom_id}
        pagination={false}
      />
    );
  };

  return (
    <PageContainer
      title="Assign Residents to Rooms"
      description="This is your description."
    >
      <DashboardCard title={"Assign Resident" || "Loading..."}>
        <h1>Assign Residents to Rooms</h1>
        <Form form={form}>
          <Table
            dataSource={residents}
            columns={unassignedColumns}
            rowKey={(record) => record.resident_id}
            pagination={false}
          />
        </Form>
        <Row gutter={16}>
          <Col span={12}>
            <DashboardCard title="Assigned Residents">
              <Table
                dataSource={residents}
                columns={mainTableColumns}
                rowKey={(record) => record.resident_id}
                pagination={false}
                expandable={{
                  expandedRowRender: renderAssignedRooms,
                  rowExpandable: (record) =>
                    assignedRooms.some(
                      (room) => room.resident_id === record.resident_id
                    ),
                }}
              />
            </DashboardCard>
          </Col>
          <Col span={12}></Col>
        </Row>
        <Modal
          title="Confirm Assignment"
          open={isModalVisible}
          onOk={handleAssignmentConfirm}
          onCancel={handleAssignmentCancel}
        >
          Are you sure you want to assign this resident to the selected room?
        </Modal>
      </DashboardCard>
    </PageContainer>
  );
};

export default AssignResidentRoom;

AssignResidentRoom.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
