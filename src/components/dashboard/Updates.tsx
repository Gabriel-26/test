import React, { useState, useEffect } from "react";
import { List, Typography, Pagination, Spin, notification } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import DashboardCard from "../shared/DashboardCard";

const { Item } = List;

const RoomUpdates = () => {
  const [roomUpdates, setRoomUpdates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;

  const formatUpdateDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const fetchData = async (page = 1) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const userRole = sessionStorage.getItem("userRole");

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      let endpoint = "/resActLog";
      let responseDataKey = "data"; // Default key for responseData

      if (userRole === "chiefResident" || userRole === "resident") {
        endpoint = "/resActLog/logs/department";
        responseDataKey = "data"; // Consistent key for responseData
      } else if (userRole === "admin") {
        endpoint = "/admin" + endpoint;
      }

      const response = await axiosInstance.get(endpoint, { params: { page } });
      console.log("API Response:", response.data);

      const responseData = response.data[responseDataKey];
      console.log("Response Data:", responseData);

      const updatedRoomUpdates = await Promise.all(
        responseData.map(async (update) => {
          if (update.role === "resident" || update.role === "chiefResident") {
            let residentEndpoint = `/resActLog/residentName/${update.user_id}`;

            if (userRole === "admin") {
              residentEndpoint = `/admin${residentEndpoint}`;
            }

            const residentResponse = await axiosInstance.get(residentEndpoint);
            const residentLastName = residentResponse.data.lastName;
            console.log("Update Data:", update);

            return {
              ...update,
              residentLastName,
            };
          }
          return update;
        })
      );

      setRoomUpdates(updatedRoomUpdates);
      setTotalItems(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        description: "Failed to fetch room updates.",
      });
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
  };

  return (
    <div>
      <DashboardCard title="Updates">
        <Spin spinning={loading}>
          <List
            header={<div>Room Updates</div>}
            footer={<div></div>}
            bordered
            dataSource={roomUpdates}
            renderItem={(update, index) => (
              <Item key={`${update.RA_id}_${index}`}>
                <Typography.Text strong>
                  {`Resident/ Dr. ${
                    update.residentLastName || update.resident_id
                  } has performed the action: ${update.action}`}
                </Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  {`Update Time: ${formatUpdateDate(update.created_at)}`}
                </Typography.Text>
              </Item>
            )}
          />
        </Spin>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </DashboardCard>
    </div>
  );
};

export default RoomUpdates;
