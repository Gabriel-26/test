import React, { useState, useEffect } from "react";
import { List, Typography, Pagination, Spin } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance"; // Import Axios instance
import DashboardCard from "../shared/DashboardCard";

const { Item } = List;

const RoomUpdates = () => {
  const [roomUpdates, setRoomUpdates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Step 2: Initialize loading state to true
  const pageSize = 5; // Adjust the page size as needed
  const MAX_RETRIES = 5;
  const INITIAL_DELAY = 1000; // 1 second
  let retryCount = 0;

  const formatUpdateDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can adjust the formatting as needed
  };

  // Function to paginate the room updates
  const paginateRoomUpdates = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = roomUpdates.slice(startIndex, endIndex);
    return paginatedData;
  };

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const userRole = sessionStorage.getItem("userRole"); // Get the user's role from sessionStorage

    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    let endpoint = "/resActLog";

    // Check user's role and set the endpoint accordingly
    if (userRole === "chiefResident" || userRole === "resident") {
      endpoint = "/resActLog/logs/department";
    } else if (userRole === "admin") {
      // Prefix the endpoint with /admin for admin users
      endpoint = "/admin" + endpoint;
    }

    const fetchDataWithRetry = () => {
      // Set loading to true when fetching data starts
      setLoading(true); // Step 3: Set loading to true

      axiosInstance
        .get(endpoint)
        .then(async (response) => {
          // Map the room updates to include resident last name
          const updatedRoomUpdates = await Promise.all(
            response.data.map(async (update) => {
              if (
                update.role === "resident" ||
                update.role === "chiefResident"
              ) {
                let residentEndpoint = `/resActLog/residentName/${update.user_id}`;

                // If the user is an admin, add the /admin prefix to the endpoint
                if (userRole === "admin") {
                  residentEndpoint = `/admin${residentEndpoint}`;
                }

                // Fetch the resident's last name using the modified endpoint
                const residentResponse = await axiosInstance.get(
                  residentEndpoint
                );
                const residentLastName = residentResponse.data.lastName;

                return {
                  ...update,
                  residentLastName, // Add the resident's last name to the update object
                };
              }
              return update;
            })
          );

          setRoomUpdates(updatedRoomUpdates);

          // Set loading to false when data is fetched
          setLoading(false); // Step 4: Set loading to false
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.status === 429 &&
            retryCount < MAX_RETRIES
          ) {
            // Retry the request after a delay
            const delay = INITIAL_DELAY * Math.pow(2, retryCount);
            setTimeout(() => {
              fetchDataWithRetry();
            }, delay);
            retryCount++;
          } else {
            // Handle other errors or too many retries
            // Set loading to false when an error occurs
            setLoading(false); // Step 4: Set loading to false in case of an error
            console.error(error);
          }
        });
    };

    // Start the initial request
    fetchDataWithRetry();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <DashboardCard title="Updates">
        <Spin spinning={loading}>
          {" "}
          {/* Step 5: Add Spin component */}
          <List
            header={<div>Room Updates</div>}
            footer={<div></div>}
            bordered
            dataSource={paginateRoomUpdates()} // Use paginated data
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
          total={roomUpdates.length} // Provide the total number of items for pagination
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </DashboardCard>
    </div>
  );
};

export default RoomUpdates;
