import React, { useState, useEffect } from "react";
import { List, Radio, Button, Modal } from "antd";
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
  const [selectedResident, setSelectedResident] = useState<string | null>(null);

  const token = localStorage.getItem("authToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const currentUserResidentId = localStorage.getItem("resID");
  
    axiosInstance
      .get("chatGroupUsers/get/firstAddResidents")
      .then((response) => {
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

  const handleRadioChange = (e: any) => {
    setSelectedResident(e.target.value);
  };

  const handleCreateChatGroup = () => {
    onSelectResidents([selectedResident!]);
    onCancel();
  };

  return (
    <Modal
      title="Select Resident"
      visible={true} // Set this to true or false based on your logic
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="create"
          type="primary"
          onClick={handleCreateChatGroup}
          disabled={!selectedResident}
          style={{
            background: selectedResident ? "#4CAF50" : "#d9d9d9",
            borderColor: selectedResident ? "#4CAF50" : "#d9d9d9",
            color: selectedResident ? "white" : "rgba(0, 0, 0, 0.25)",
          }}
        >
          Create Chat Group
        </Button>,
      ]}
    >
      <Radio.Group onChange={handleRadioChange} value={selectedResident}>
        <List
          dataSource={residents}
          itemLayout="horizontal"
          renderItem={(resident) => (
            <List.Item>
              <Radio value={resident.resident_id}>
                {resident.resident_fName} {resident.resident_lName}
              </Radio>
            </List.Item>
          )}
        />
      </Radio.Group>
    </Modal>
  );
};

export default ResidentsList;
