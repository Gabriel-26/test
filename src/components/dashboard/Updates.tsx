import React, { useState, useEffect } from "react";
import { List, Typography, Pagination, Spin, notification } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import DashboardCard from "../shared/DashboardCard";

const { Item } = List;

const RoomUpdates = () => {
  const [roomUpdates, setRoomUpdates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 5;
  const MAX_RETRIES = 5;
  const INITIAL_DELAY = 1000; // 1 second

  const formatUpdateDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can adjust the formatting as needed
  };

  const fetchDataWithRetry = async (retryCount = 0) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const userRole = sessionStorage.getItem("userRole");

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      let endpoint = "/resActLog";

      if (userRole === "chiefResident" || userRole === "resident") {
        endpoint = "/resActLog/logs/department";
      } else if (userRole === "admin") {
        endpoint = "/admin" + endpoint;
      }

      const response = await axiosInstance.get(endpoint);

      const updatedRoomUpdates = await Promise.all(
        response.data.map(async (update) => {
          if (update.role === "resident" || update.role === "chiefResident") {
            let residentEndpoint = `/resActLog/residentName/${update.user_id}`;

            if (userRole === "admin") {
              residentEndpoint = `/admin${residentEndpoint}`;
            }

            const residentResponse = await axiosInstance.get(residentEndpoint);
            const residentLastName = residentResponse.data.lastName;

            return {
              ...update,
              residentLastName,
            };
          }
          return update;
        })
      );

      setRoomUpdates(updatedRoomUpdates);
      setLoading(false);
    } catch (error) {
      handleFetchError(error, retryCount);
    }
  };

  const handleFetchError = (error, retryCount) => {
    if (
      error.response &&
      error.response.status === 429 &&
      retryCount < MAX_RETRIES
    ) {
      const retryAfterHeader = error.response.headers["retry-after"];
      const delay = retryAfterHeader
        ? parseInt(retryAfterHeader) * 1000
        : Math.pow(2, retryCount) * INITIAL_DELAY;

      // Retry the request after the calculated delay
      setTimeout(() => {
        fetchDataWithRetry(retryCount + 1);
      }, delay);
    } else {
      // Handle other errors or too many retries
      setLoading(false);
      console.error(error);
      notification.error({
        message: "Error",
        description: `Failed to fetch room updates. Retry count: ${
          retryCount + 1
        }`,
      });
    }
  };

  useEffect(() => {
    // Fetch data only if it's not already in the cache
    if (roomUpdates.length === 0) {
      fetchDataWithRetry();
    }
  }, [roomUpdates]);

  const paginateRoomUpdates = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = roomUpdates.slice(startIndex, endIndex);
    return paginatedData;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <DashboardCard title="Updates">
        <Spin spinning={loading}>
          <List
            header={<div>Room Updates</div>}
            footer={<div></div>}
            bordered
            dataSource={paginateRoomUpdates()}
            renderItem={(update, index) => (
              <Item>
                <Typography.Text strong>
                  {`Resident/ Dr. ${
                    update.residentLastName || update.user_id
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
          total={roomUpdates.length}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </DashboardCard>
    </div>
  );
};

export default RoomUpdates;
