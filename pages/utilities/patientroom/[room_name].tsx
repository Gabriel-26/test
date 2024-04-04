import React, { useState, useEffect, ReactElement } from "react";
import { Paper, Box, Grid } from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import FullLayout from "../../../src/layouts/full/FullLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import PatientInfo from "./PatientInfo";
import { useRouter } from "next/router";
import PatientHistory from "./PatientHistory";
import { uploadFile } from "../../../src/components/utils/fileUpload";
import { Modal, Button, message } from "antd";
import Medication from "./Medications";
import HumanFigureEvaluation from "./PhysicalExam";
import FileViewer from "./FileViewer";
import LabResultsPage from "./LabResults";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: "60px",
}));

const darkTheme = createTheme({ palette: { mode: "dark" } });
const lightTheme = createTheme({ palette: { mode: "light" } });

const RoomView = () => {
  const router = useRouter();
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { room_name: queryRoomName, room_id: queryRoomId } = router.query;
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState(false); // Add transferSuccess state
  const [isFilePickerOpen, setFilePickerOpen] = useState(false);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);

  const showCheckoutConfirmation = () => {
    setIsCheckoutModalVisible(true);
  };

  // Function to handle the checkout when the user confirms

  // Function to handle cancellation of the confirmation
  const handleCheckoutCancel = () => {
    // Close the confirmation dialog
    setIsCheckoutModalVisible(false);
  };
  const updatePatientData = (updatedPatientData) => {
    setPatientData(updatedPatientData);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleOpenFilePicker = () => {
    setFilePickerOpen(true);
  };

  const handleCloseFilePicker = () => {
    setFilePickerOpen(false);
    setSelectedFile(null); // Clear the selectedFile state
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      message.error("Please select a file to upload.");
      return;
    }
    console.log("Selected Room ID:", selectedRoomId); // Add this log statement

    const token = localStorage.getItem("authToken");
    const residentID = localStorage.getItem("resID");

    if (!residentID) {
      console.error("Resident ID not found in session storage");
      message.error("Resident ID not found");
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      // Get the patient data for the current room
      const roomResponse = await axiosInstance.get(
        `patAssRooms/getPatientbyRoom/${queryRoomId}`
      );
      const patientData = roomResponse.data;

      // Check if patient data is available
      if (patientData && patientData.length > 0) {
        const patientID = patientData[0].patient_id;

        if (patientID) {
          // Upload the file with patientID and residentID
          uploadFile(selectedFile, patientID, residentID)
            .then((uploadResponse) => {
              console.log("File uploaded successfully", uploadResponse.data);
              message.success("File uploaded successfully!");
              setSelectedFile(null);
              setTimeout(() => {
                setUploadSuccess(false);
              }, 3000);
            })

            .catch((error) => {
              console.error("File upload error", error);
              message.error("File upload failed");
            });
        } else {
          console.error("Patient ID not found in patient data");
          message.error("Patient ID not found");
        }
      } else {
        console.error("No patient data available");
        message.error("Patient data not found");
      }
    } catch (error) {
      console.error("Error fetching patient data", error);
      message.error("Failed to fetch patient data");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const apiUrl = "/patAssRooms/get/AvailableRooms"; // Updated API route

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms", error);
        message.error("Failed to fetch available rooms. Please try again.");
      });
  }, []);

  const handleTransferPatient = () => {
    if (!selectedRoomId || patientData.length === 0) {
      setTransferError("No patients available to transfer");

      return;
    }

    const token = localStorage.getItem("authToken");
    const apiUrl = `/patAssRooms/transferPatient/${patientData[0].patient_id}`;

    const requestBody = {
      room_id: selectedRoomId, // Corrected to 'room_id'
      patientIds: patientData.map((patient) => patient.patient_id),
    };

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axiosInstance
      .post(apiUrl, requestBody)
      .then((response) => {
        console.log("Patients transferred successfully");
        console.log(response.data);

        setTransferError("");
        setTransferSuccess(true); // Set transferSuccess to true

        // Clear patientData and selectedRoomId after successful transfer
        setPatientData([]);
        setSelectedRoomId("");
      })
      .catch((error) => {
        console.error("Patient transfer error", error);
        setTransferError("Error transferring patients");
      });
  };

  const handleCheckoutPatient = () => {
    if (patientData.length === 0) {
      setTransferError("No patients available to check out");
      return;
    }

    const token = localStorage.getItem("authToken");
    const apiUrl = `/patAssRooms/checkout/${patientData[0].patient_id}`;

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axiosInstance
      .get(apiUrl)
      .then((response) => {
        console.log("Patient checked out successfully");
        console.log(response.data);

        setTransferError("");
        setIsCheckoutModalVisible(false)
        setPatientData([]); // Clear patientData after successful checkout
      })
      .catch((error) => {
        console.error("Patient checkout error", error);
        setTransferError("Error checking out the patient");
      });
  };

  return (
    <PageContainer
      //@ts-ignore
      title={queryRoomName || "(Room Name)"}
      description="this is Shadow"
    >
      <DashboardCard
        title={
          (Array.isArray(queryRoomName) ? queryRoomName[0] : queryRoomName) ||
          "(Room Name)"
        }
      >
        <Tabs defaultValue="pninfo" className="min-w-[600px] w-full md:w-[90%]">
          <TabsList className="flex">
            <TabsTrigger
              value="pninfo"
              className="tab-trigger relative group cursor-pointer"
            >
              <span className="inline-block py-2 px-4">Patient Info</span>
              <span
                className="absolute bottom-0 left-0 h-1 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 group-active:scale-x-100 bg-blue-500"
                style={{ width: "100%" }}
              />
            </TabsTrigger>
            <TabsTrigger
              value="phistory"
              className="tab-trigger relative group cursor-pointer"
            >
              <span className="inline-block py-2 px-4">Patient History</span>
              <span
                className="absolute bottom-0 left-0 h-1 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 group-active:scale-x-100 bg-blue-500"
                style={{ width: "100%" }}
              />
            </TabsTrigger>
            <TabsTrigger
              value="fileviewer"
              className="tab-trigger relative group cursor-pointer"
            >
              <span className="inline-block py-2 px-4">File Viewer</span>
              <span
                className="absolute bottom-0 left-0 h-1 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 group-active:scale-x-100 bg-blue-500"
                style={{ width: "100%" }}
              />
            </TabsTrigger>
            <TabsTrigger
              value="evaluation"
              className="tab-trigger relative group cursor-pointer"
            >
              <span className="inline-block py-2 px-4">Evaluation</span>
              <span
                className="absolute bottom-0 left-0 h-1 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 group-active:scale-x-100 bg-blue-500"
                style={{ width: "100%" }}
              />
            </TabsTrigger>
            <TabsTrigger
              value="medication"
              className="tab-trigger relative group cursor-pointer"
            >
              <span className="inline-block py-2 px-4">Medication</span>
              <span
                className="absolute bottom-0 left-0 h-1 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 group-active:scale-x-100 bg-blue-500"
                style={{ width: "100%" }}
              />
            </TabsTrigger>
            <TabsTrigger
              value="labresults"
              className="tab-trigger relative group cursor-pointer"
            >
              <span className="inline-block py-2 px-4">Lab Results</span>
              <span
                className="absolute bottom-0 left-0 h-1 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 group-active:scale-x-100 bg-blue-500"
                style={{ width: "100%" }}
              />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pninfo">
            <PatientInfo
              patientData={patientData}
              updatePatientData={updatePatientData}
            />
          </TabsContent>
          <TabsContent value="phistory">
            <PatientHistory
              patientData={{ patient_id: patientData[0]?.patient_id }}
            />
          </TabsContent>
          <TabsContent value="fileviewer">
            <FileViewer
              patientData={{ patient_id: patientData[0]?.patient_id }}
            />
          </TabsContent>
          <TabsContent value="evaluation">
            <HumanFigureEvaluation
              patientData={patientData}
              updatePatientData={updatePatientData}
              patientId={patientData[0]?.patient_id}
            />
          </TabsContent>
          <TabsContent value="medication">
            <Medication patientId={patientData[0]?.patient_id} />
          </TabsContent>
          <TabsContent value="labresults">
            <LabResultsPage
              patientData={{ patient_id: patientData[0]?.patient_id }}
            />
          </TabsContent>
        </Tabs>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <Button
            // variant="outlined"
            onClick={showCheckoutConfirmation} // Add the checkout handler
            disabled={patientData.length === 0}
            style={{ flex: 1 }}
          >
            Discharge Patient
          </Button>

          <Button
            // variant="outlined"
            onClick={() => setTransferModalOpen(true)}
            disabled={patientData.length === 0}
            style={{ flex: 1 }}
          >
            Transfer Patient
          </Button>
          <Button
            // variant="outlined"
            disabled={patientData.length === 0}
            onClick={handleOpenFilePicker} // Open the file picker dialog
            style={{ flex: 1 }}
          >
            Choose File
          </Button>
        </div>
        {uploadSuccess && (
          <div style={{ color: "green", margin: "8px" }}>
            File uploaded successfully!
          </div>
        )}
        {transferSuccess && ( // Display success message
          <div style={{ color: "green", margin: "8px" }}>
            Patient transferred successfully!
          </div>
        )}
      </DashboardCard>
      <Modal
        open={isTransferModalOpen}
        onCancel={() => setTransferModalOpen(false)}
        footer={null} // Remove the default footer
      >
        <h3>Select a room to transfer the patient:</h3>
        <label>Select a room: </label>
        <select
          onChange={(e) => setSelectedRoomId(e.target.value)}
          defaultValue={queryRoomId}
        >
          {/* Default option is the current room */}
          <option value="">Select a room</option>

          {/* Other room options */}
          {rooms.map((room) => (
            <option key={room.room_id} value={room.room_id}>
              {room.room_name}
            </option>
          ))}
        </select>

        {/* Customized OK button */}
        <Button
          key="ok"
          onClick={() => {
            handleTransferPatient();
            setTransferModalOpen(false);
          }}
          disabled={!selectedRoomId}
          style={{
            backgroundColor: !selectedRoomId ? "#d9d9d9" : "#1890ff",
            color: !selectedRoomId ? "rgba(0, 0, 0, 0.25)" : "white",
            borderColor: !selectedRoomId ? "#d9d9d9" : "#1890ff",
            marginLeft: "146px", // Add margin to match the layout
          }}
        >
          Transfer Patient
        </Button>
      </Modal>

      <Modal
        title="Upload a File"
        open={isFilePickerOpen}
        onCancel={handleCloseFilePicker}
        footer={null}
        maskClosable={true}
      >
        {/* ... input for selecting a file ... */}
        <input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
        <Button
          key="upload"
          type="primary"
          onClick={handleFileUpload}
          disabled={!selectedFile}
          style={{
            backgroundColor: !selectedFile ? "#d9d9d9" : "#1890ff", // Background color
            color: !selectedFile ? "rgba(0, 0, 0, 0.25)" : "white", // Text color
            borderColor: !selectedFile ? "#d9d9d9" : "#1890ff", // Border color
          }}
        >
          Upload File
        </Button>
        <Button
          key="cancel"
          onClick={handleCloseFilePicker}
          style={{ marginLeft: "8px" }}
        >
          Cancel
        </Button>
      </Modal>
      <Modal
        title="Confirm Checkout"
        open={isCheckoutModalVisible}
        onOk={handleCheckoutPatient}
        onCancel={handleCheckoutCancel}
        okButtonProps={{
          style: { backgroundColor: "#1890ff", color: "white" },
        }}
        cancelButtonProps={{ style: { marginLeft: "8px" } }}
        okText="Confirm"
        cancelText="Cancel"
      >
        Are you sure you want to discharge this patient from the room?
      </Modal>
    </PageContainer>
  );
};

export default RoomView;
RoomView.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
