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
import ImageDisplay from "./FileViewer";
import PatientEvaluation from "./PhysicalExam";
import Medication from "./Medications";
import HumanFigureEvaluationPage from "./HumanFigureEvaluationPage";
import HumanFigureEvaluation from "./PhysicalExam";

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
  const { room_name: queryRoomName } = router.query;
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
  const handleCheckoutConfirmed = () => {
    // Perform the checkout logic here
    // ...

    // Close the confirmation dialog
    setIsCheckoutModalVisible(false);
  };

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
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const token = sessionStorage.getItem("authToken");
    const residentID = sessionStorage.getItem("resID"); // Retrieve resident_id from session storage

    if (!residentID) {
      console.error("Resident ID not found in session storage");
      message.error("Resident ID not found");
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      // Make an API request to retrieve patient data
      const response = await axiosInstance.get("/patAssRooms");
      const patientData = response.data;

      // Check if patient data is available
      if (patientData && patientData.length > 0) {
        const patientID = patientData[0].patient_id;

        if (patientID) {
          // Upload the file with patientID and residentID
          uploadFile(selectedFile, patientID, residentID)
            .then((uploadResponse) => {
              console.log("File uploaded successfully", uploadResponse.data);
              setUploadSuccess(true);
              setSelectedFile(null);
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
    const token = sessionStorage.getItem("authToken");
    const apiUrl = "/patAssRooms/get/AvailableRooms"; // Updated API route

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms", error);
      });
  }, []);

  const handleTransferPatient = () => {
    if (!selectedRoomId || patientData.length === 0) {
      setTransferError("No patients available to transfer");
      return;
    }

    const token = sessionStorage.getItem("authToken");
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

    const token = sessionStorage.getItem("authToken");
    const apiUrl = `/patAssRooms/checkout/${patientData[0].patient_id}`;

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axiosInstance
      .get(apiUrl)
      .then((response) => {
        console.log("Patient checked out successfully");
        console.log(response.data);

        setTransferError("");
        setPatientData([]); // Clear patientData after successful checkout
      })
      .catch((error) => {
        console.error("Patient checkout error", error);
        setTransferError("Error checking out the patient");
      });
  };

  return (
    <PageContainer
      title={queryRoomName || "(Room Name)"}
      description="this is Shadow"
    >
      <DashboardCard title={queryRoomName || "(Room Name)"}>
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
            <ImageDisplay />
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
        </Tabs>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <Button
            variant="outlined"
            onClick={showCheckoutConfirmation} // Add the checkout handler
            disabled={patientData.length === 0}
            style={{ flex: 1 }}
          >
            Checkout Patient
          </Button>

          <Button
            variant="outlined"
            onClick={() => setTransferModalOpen(true)}
            disabled={patientData.length === 0}
            style={{ flex: 1 }}
          >
            Transfer Patient
          </Button>
          <Button
            variant="outlined"
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
        onOk={() => {
          handleTransferPatient(); // Removed 'selectedRoomId' parameter
          setTransferModalOpen(false);
        }}
        okButtonProps={{ disabled: !selectedRoomId }}
      >
        <h3>Select a room to transfer the patient:</h3>
        <label>Select a room:</label>
        <select onChange={(e) => setSelectedRoomId(e.target.value)}>
          <option value="">Select a room</option>
          {rooms.map((room) => (
            <option key={room.room_id} value={room.room_id}>
              {room.room_name}
            </option>
          ))}
        </select>
      </Modal>
      <Modal
        title="Choose a File"
        open={isFilePickerOpen}
        onCancel={handleCloseFilePicker}
        footer={null} // Remove the footer to customize your own buttons
        maskClosable={false} // Prevent closing when clicking outside the modal
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
      >
        Are you sure you want to checkout/remove this patient from the room?
      </Modal>
    </PageContainer>
  );
};

export default RoomView;
RoomView.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
