import React, { useState, useEffect, ReactElement } from "react";
import { Table, Space, Modal, message, Button } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import moment from "moment"; // Import moment library for date formatting
import FullLayout from "../../../src/layouts/full/FullLayout";
import PageContainer from "../../../src/components/container/PageContainer";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import { MdDelete } from "react-icons/md";

const { confirm } = Modal;

const SharedPatientDataPage = () => {
  const [sharedPatientData, setSharedPatientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    {
      title: "RAP ID",
      dataIndex: "RAP_id",
      key: "RAP_id",
    },
    {
      title: "Is Main Resident",
      dataIndex: "isMainResident",
      key: "isMainResident",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Resident ID",
      dataIndex: "resident_id",
      key: "resident_id",
    },
    {
      title: "Patient ID",
      dataIndex: "patient_id",
      key: "patient_id",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"), // Format the date using moment
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"), // Format the date using moment
    },
  ];

  const fetchSharedPatientData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setLoading(true);
      const response = await axiosInstance.get(
        "/residentAssignedPatients/get/PatientsAssignedToResident"
      );
      setSharedPatientData(response.data);
    } catch (error) {
      setError(error.message || "An error occurred while fetching data.");
      console.error("Error fetching shared patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedPatientData();
  }, []);

  const showDeleteConfirmation = (RAP_id, resident_id) => {
    confirm({
      title: `Are you sure you want to remove access from resident ${resident_id}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteRecord(RAP_id);
      },
    });
  };

  const handleDeleteRecord = async (RAP_id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `/residentAssignedPatients/${RAP_id}`
      );
      if (response.status === 200) {
        message.success("Record deleted successfully.");
        fetchSharedPatientData();
      }
    } catch (error) {
      message.error("Error deleting record.");
      console.error("Error deleting record:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Shared Patient Data"
      description="View shared patient data from residents"
    >
      <DashboardCard title="Shared Patient Data">
        <Table
          dataSource={sharedPatientData}
          columns={[
            ...columns,
            {
              title: "Action",
              key: "action",
              render: (text, record) => (
                <Space size="middle">
                  <Button
                    icon={<MdDelete style={{ fontSize: "22px" }} />}
                    color="error"
                    onClick={() =>
                      showDeleteConfirmation(record.RAP_id, record.resident_id)
                    }
                  ></Button>
                </Space>
              ),
            },
          ]}
          loading={loading}
          rowKey="RAP_id"
          pagination={{ pageSize: 5 }} // Set pageSize to 1 to display one item per page
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DashboardCard>
    </PageContainer>
  );
};

export default SharedPatientDataPage;

SharedPatientDataPage.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
