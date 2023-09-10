import React, { useState, useEffect } from "react";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { List, Button, Modal, message } from "antd";
import { FileOutlined } from "@ant-design/icons";

const FileViewer = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [fileContentURL, setFileContentURL] = useState();

  // Function to fetch files from the API
  const fetchFiles = () => {
    const token = sessionStorage.getItem("authToken");
    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axiosInstance.get("/fileUpload").then((response) => {
      setFiles(response.data);
    });
  };

  useEffect(() => {
    fetchFiles();

    // Poll for file updates every 10 seconds (adjust the interval as needed)
    const pollingInterval = setInterval(() => {
      fetchFiles();
    }, 10000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  const handleFileClick = (file, fileId) => {
    setSelectedFile(file);
    setViewerVisible(true);
    const token = sessionStorage.getItem("authToken");
    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // Use the new endpoint for viewing files
    axiosInstance.get(`/fileUpload/viewFile/${fileId}`).then((response) => {
      // Assuming the response contains the file URL
      const fileURL = response.data;
      console.log(fileURL);
      // Set the file URL to state
      setFileContentURL(fileURL);
    });
  };

  const handleCloseFileViewer = () => {
    setSelectedFile(null);
    setViewerVisible(false);
  };

  const handleDownloadFile = (fileId) => {
    const token = sessionStorage.getItem("authToken");
    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axiosInstance
      .get(`/fileUpload/download/${fileId}`, {
        responseType: "blob", // Set responseType to blob for downloading
      })
      .then((response) => {
        // Create a URL for the blob data and trigger a download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = selectedFile.file_name;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        message.error("Failed to download file.");
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
                  <Button
                    type="link"
                    onClick={() => handleFileClick(file, file.file_id)}
                  >
                    View
                  </Button>
                  <Button
                    type="link"
                    onClick={() => handleDownloadFile(file.file_id)}
                  >
                    Download
                  </Button>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={`Viewing File: ${selectedFile?.file_name || "No file selected"}`}
        visible={isViewerVisible}
        onCancel={handleCloseFileViewer}
        footer={[
          <Button key="close" onClick={handleCloseFileViewer}>
            Close Viewer
          </Button>,
          <Button
            key="download"
            type="primary"
            onClick={() => handleDownloadFile(selectedFile?.file_id)}
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
              src={`http://192.168.1.7:8000/api/fileUpload/viewFile/${selectedFile.file_id}`}
              className="iframe-content w-full h-auto max-h-screen"
              style={{ aspectRatio: "16/9" }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FileViewer;
