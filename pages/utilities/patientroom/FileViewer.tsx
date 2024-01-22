import React, { useState, useEffect } from "react";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { List, Button, Modal, message } from "antd";
import { FileOutlined } from "@ant-design/icons";

const FileViewer = ({ patientData }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isViewerVisible, setViewerVisible] = useState(false);

  const { patient_id = "" } = patientData;

  // Function to fetch files from the API
  const fetchFiles = (patientId) => {
    const token = localStorage.getItem("authToken");

    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch files based on patient_id
    axiosInstance
      .get(`/fileUpload/getFilesByPatient/${patientId}`)
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        message.error("Failed to fetch files. Please try again.");
      });
  };

  useEffect(() => {
    fetchFiles(patient_id);

    // Poll for file updates every 10 seconds (adjust the interval as needed)
    const pollingInterval = setInterval(() => {
      fetchFiles(patient_id);
    }, 10000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, [patient_id]); // Run useEffect when patient_id changes

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setViewerVisible(true);
  };

  const handleCloseFileViewer = () => {
    setSelectedFile(null);
    setViewerVisible(false);
  };

  const handleDownloadFile = (fileId) => {
    const token = localStorage.getItem("authToken");

    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (!selectedFile) {
      message.error("Selected file is null. Failed to download file.");
      return;
    }

    axiosInstance
      .get(`/fileUpload/download/${fileId}`, {
        responseType: "blob", // Set responseType to blob for downloading
      })
      .then((response) => {
        // Create a URL for the blob data and trigger a download
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const a = document.createElement("a");
        a.href = url;
        a.download = selectedFile.file_name || "downloaded_file"; // Use a default name if file_name is not available
        a.click();
        window.URL.revokeObjectURL(url);

        message.success("File downloaded successfully!");
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        message.error("Failed to download file. Please try again.");
      });
  };

  return (
    <div>
      <h3>Uploaded Files:</h3>
      <List
        itemLayout="horizontal"
        dataSource={files}
        renderItem={(file) => (
          <List.Item>
            <List.Item.Meta
              avatar={<FileOutlined />}
              title={<span>{file.file_name}</span>}
              description={
                <div>
                  <Button type="link" onClick={() => handleFileClick(file)}>
                    View
                  </Button>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={`Viewing File: ${selectedFile?.file_name || "No file selected"}`}
        open={isViewerVisible}
        onCancel={handleCloseFileViewer}
        footer={[
          <Button key="close" onClick={handleCloseFileViewer}>
            Close Viewer
          </Button>,
          <Button
            key="download"
            onClick={() => handleDownloadFile(selectedFile?.file_id)}
            style={{ backgroundColor: "#1890ff", color: "white" }}
          >
            Download
          </Button>,
        ]}
        width={1200} // Set the modal width to 1200px
      >
        {selectedFile && (
          <div className="iframe-container">
            <iframe
              title="File Viewer"
              src={`https://ipimsbe.online/api/fileUpload/viewFile/${selectedFile.file_id}`}
              className="iframe-content w-full h-auto max-h-screen"
              style={{ width: "100%", height: "100%", aspectRatio: "16/9" }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FileViewer;
