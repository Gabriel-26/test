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

import { MdDelete } from "react-icons/md";
import SharedPatientDataPage from "./sharedPatientData";
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
  const [residentNames, setResidentNames] = useState({});
  const [selectKey, setSelectKey] = useState(Date.now());
  const [selectedRooms, setSelectedRooms] = useState({});

  const assignedColumns = [
    // {
    //   title: "Assigned Room ID",
    //   dataIndex: "resAssRoom_id",
    //   key: "resAssRoom_id",
    // },
    {
      title: "Room Name",
      dataIndex: "room_name",
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
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          icon={<MdDelete style={{ fontSize: "20px" }} />}
          type="default"
          onClick={() => {
            showDeleteConfirmation(record.resAssRoom_id);
          }}
          style={{ zIndex: 1 }} // Set a higher z-index
        ></Button>
      ),
    },
  ];

  const mainTableColumns = [
    {
      title: "Resident Name",
      dataIndex: "resident_id",
      key: "resident_id",
      render: (residentId) => {
        const residentName = residentNames[residentId];
        return residentName ? residentName : "Loading...";
      },
    },
    {
      title: "Is Finished",
      dataIndex: "resident_id",
      key: "isFinished",
      render: (residentId) => {
        const assignedRoomsForResident = assignedRooms.filter(
          (room) => room.resident_id === residentId
        );
        if (assignedRoomsForResident.length === 0) {
          return "No"; // Default to "No" if there are no assigned rooms
        }
        const allRoomsFinished = assignedRoomsForResident.every(
          (room) => room.isFinished
        );
        return allRoomsFinished ? "Yes" : "No";
      },
    },
  ];

  const unassignedColumns = [
    {
      title: "Resident",
      dataIndex: "resident_id",
      key: "resident_id",
      render: (residentId) => {
        const residentLastName = residentNames[residentId];
        return residentLastName ? residentLastName : "Loading...";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Select
            key={selectKey}
            style={{ width: 120 }}
            placeholder="Select Room"
            onChange={(value) => {
              const updatedSelectedRooms = { ...selectedRooms };
              updatedSelectedRooms[record.resident_id] = value;
              setSelectedRooms(updatedSelectedRooms);
            }}
          >
            {rooms.map((room) => (
              <Option key={room.room_id} value={room.room_id}>
                {room.room_name}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
            onClick={() => {
              setSelectedResidentId(record.resident_id);
              showConfirmationModal();
            }}
            disabled={!selectedRooms[record.resident_id]}
          >
            Assign Room
          </Button>
        </Space>
      ),
    },
  ];

  const handleDeleteAssignment = async (resAssRoomId) => {
    try {
      console.log("Delete button clicked");

      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);
      const response = await axiosInstance.delete(
        `resAssRooms/${resAssRoomId}`
      );

      if (response.status === 200) {
        console.log("Assignment deleted successfully.");
        message.success("Assignment deleted successfully.");
        fetchAssignedRooms();
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      message.error("Error deleting assignment.");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirmation = (resAssRoomId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this assignment?",
      content: "This action cannot be undone.",
      okText: "Confirm",
      okType: "danger",
      onOk() {
        handleDeleteAssignment(resAssRoomId);
      },
    });
  };

  const showConfirmationModal = () => {
    setIsModalVisible(true);
  };

  const handleAssignmentCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleAssignmentConfirm = () => {
    // Perform the assignment logic here
    handleRoomChange(selectedResidentId, selectedRooms[selectedResidentId]);
    setIsModalVisible(false); // Close the modal
    setSelectedRoomId(null); // Clear selected room
    setSelectKey(Date.now()); // Change the key to force re-render
  };

  const handleRoomChange = async (selectedResidentId, selectedRoomId) => {
    try {
      const token = localStorage.getItem("authToken");
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
      if (error.response && error.response.status === 429) {
        // Handle 429 Too Many Requests error
        console.error("Too Many Requests. Please try again later.");
        message.error("Too Many Requests. Please try again later.");
      } else {
        console.error("Error assigning resident to room:", error);
        // Add an error message for unsuccessful assignment
        message.error("Error assigning resident to room. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedRooms = async () => {
    try {
      const token = localStorage.getItem("authToken");
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
      const token = localStorage.getItem("authToken");
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
      const token = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");
      const chiefResidentDepartmentId = localStorage.getItem("depID");

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);

      let response;
      if (userRole === "chiefResident") {
        // Fetch residents based on the chiefResident's department_id
        response = await axiosInstance.get(
          `/resAssRooms/residentsByDepartment/${chiefResidentDepartmentId}`
        );
      } else {
        // Fetch all residents for other roles
        response = await axiosInstance.get("/residents");
      }

      if (response.status === 200) {
        const filteredResidents = response.data.filter(
          (resident) => resident.role === "resident"
        );

        const namesMapping = {};
        filteredResidents.forEach((resident) => {
          const fullName = ` ${resident.resident_lName}`;
          namesMapping[resident.resident_id] = fullName;
        });

        setResidents(filteredResidents);
        setResidentNames(namesMapping);
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
        <h1 className="text-3xl font-bold mb-4">Assign Residents to Rooms</h1>
        <Form form={form} className="mb-4">
          <Table
            dataSource={residents}
            columns={unassignedColumns}
            rowKey={(record) => record.resident_id}
            pagination={false}
            scroll={{ y: 250 }}
          />
        </Form>
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <DashboardCard title="Assigned Residents">
              <Table
                dataSource={residents}
                columns={mainTableColumns}
                rowKey={(record) => record.resident_id}
                pagination={{ pageSize: 4 }} // Set pageSize to 1 to display one item per page
                // scroll={{ y: 250 }}
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
        </Row>
        <Modal
          title="Confirm Assignment Deletion"
          open={isModalVisible}
          onOk={showDeleteConfirmation}
          onCancel={showDeleteConfirmation}
          okText="Yes"
          cancelText="No"
        >
          <p>Are you sure you want to delete this assignment?</p>
        </Modal>
        <Modal
          title="Confirm Assignment"
          open={isModalVisible}
          onOk={handleAssignmentConfirm}
          onCancel={handleAssignmentCancel}
          okButtonProps={{
            style: { backgroundColor: "#52c41a", borderColor: "#52c41a" },
          }}
        >
          <p className="text-lg">
            Are you sure you want to assign this resident to the selected room?
          </p>
        </Modal>
      </DashboardCard>
      <SharedPatientDataPage />
    </PageContainer>
  );
};

export default AssignResidentRoom;

AssignResidentRoom.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
