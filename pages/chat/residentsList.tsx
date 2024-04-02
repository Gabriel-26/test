import React, { useState, useEffect } from "react";
import { List, Checkbox, Button, Modal } from "antd";
import axiosInstance from "../../src/components/utils/axiosInstance";

interface Resident {
  resident_id: string;
  resident_userName: string;
  resident_fName: string;
  resident_lName: string;
  isDeleted: number;
}

interface ResidentsListProps {
  onSelectResidents: (selectedResidents: string[]) => void;
  onCancel: () => void;
}

const ResidentsList: React.FC<ResidentsListProps> = ({
  onSelectResidents,
  onCancel,
}) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);

  const token = localStorage.getItem("authToken");
  // Set the token in Axios headers for this request
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    axiosInstance
      .get("chatGroupUsers/get/firstAddResidents")
      .then((response) => {
        // Filter out residents with isDeleted equal to 1
        const filteredResidents = response.data.filter(
          (resident: Resident) => resident.isDeleted !== 1
        );
        setResidents(filteredResidents);
        console.log("Residents:", filteredResidents);
      })
      .catch((error) => {
        console.error("Error fetching residents:", error);
      });
  }, []);
  

  const handleCheckboxChange = (checkedValues: string[]) => {
    setSelectedResidents(checkedValues);
  };

  const handleCreateChatGroup = () => {
    onSelectResidents(selectedResidents);
    onCancel(); // Close the modal after creating the chat group
  };

  return (
    <Modal
      title="Select Residents"
      open={true} // Set this to true or false based on your logic
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="create"
          type="primary"
          onClick={handleCreateChatGroup}
          disabled={selectedResidents.length === 0}
          style={{
            background: selectedResidents.length > 0 ? "#4CAF50" : "#d9d9d9",
            borderColor: selectedResidents.length > 0 ? "#4CAF50" : "#d9d9d9",
            color:
              selectedResidents.length > 0 ? "white" : "rgba(0, 0, 0, 0.25)",
          }}
        >
          Create Chat Group
        </Button>,
      ]}
    >
      <Checkbox.Group
        onChange={(checkedValues) =>
          handleCheckboxChange(checkedValues as string[])
        }
        value={selectedResidents}
      >
        <List
          dataSource={residents}
          itemLayout="horizontal"
          renderItem={(resident) => (
            <List.Item>
              <Checkbox value={resident.resident_id}>
                {resident.resident_fName} {resident.resident_lName}
              </Checkbox>
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </Modal>
  );
};

export default ResidentsList;
