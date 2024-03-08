import React, { useState, useEffect } from "react";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { List, Button, Modal, message, Pagination } from "antd";
import { FileOutlined } from "@ant-design/icons";
import { MdOutlinePreview, MdDelete } from "react-icons/md";

const { confirm } = Modal;

const FileViewer = ({ patientData }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Number of items per page

  const { patient_id = "" } = patientData;

  // Function to fetch files from the API
  const fetchFiles = () => {
    const token = localStorage.getItem("authToken");
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axiosInstance
      .get(`/fileUpload/getFilesByPatient/${patient_id}`)
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        message.error("Failed to fetch files. Please try again.");
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
  }, [patient_id]); // Run useEffect when patient_id changes

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setViewerVisible(true);
  };

  const handleCloseFileViewer = () => {
    setSelectedFile(null);
    setViewerVisible(false);
  };

  const handleDeleteFile = (fileId) => {
    confirm({
      title: "Are you sure you want to delete this file?",
      content: "This action cannot be undone.",
      onOk() {
        axiosInstance
          .delete(`/fileUpload/delete/${fileId}`)
          .then((response) => {
            message.success("File deleted successfully!");
            fetchFiles(); // Refresh files after deletion
          })
          .catch((error) => {
            console.error("Error deleting file:", error);
            message.error("Failed to delete file. Please try again.");
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
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

  const renderFileViewer = () => {
    if (!selectedFile) return null;

    const { file_ext, file_id, file_name } = selectedFile;

    console.log("File type:", file_ext);

    if (
      file_ext &&
      (file_ext === "jpg" || file_ext === "jpeg" || file_ext === "png")
    ) {
      return (
        <img
          src={`https://ipimsbe.online/api/fileUpload/viewFile/${file_id}`}
          alt={file_name}
          className="max-w-full max-h-full"
        />
      );
    } else if (file_ext === "pdf") {
      return (
        <embed
          src={`https://ipimsbe.online/api/fileUpload/viewFile/${file_id}`}
          type="application/pdf"
          className="w-full h-full"
        />
      );
    } else {
      console.log("Unsupported file type:", file_id);
      return <p>This file type is not supported for preview.</p>;
    }
  };

  // Slice files based on pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const displayedFiles = files.slice(startIndex, endIndex);

  return (
    <div style={{ maxWidth: "800px", margin: "auto", height: "430px" }}>
      <h3 className="mb-4">Uploaded Files:</h3>
      <List
        itemLayout="horizontal"
        dataSource={displayedFiles}
        renderItem={(file) => (
          <List.Item
            key={file.file_id}
            className="border p-4 rounded-lg mb-2 flex justify-between items-center"
          >
            <div className="flex items-center">
              <FileOutlined className="text-blue-500 mr-2" />
              <span className="font-semibold">{file.file_name}</span>
            </div>
            <div>
              <Button
                type="link"
                onClick={() => handleFileClick(file)}
                className="mr-2"
              >
                <MdOutlinePreview style={{ fontSize: "24px" }} />
              </Button>
              <Button
                type="link"
                onClick={() => handleDeleteFile(file.file_id)}
                danger
              >
                <MdDelete style={{ fontSize: "24px" }} />
              </Button>
            </div>
          </List.Item>
        )}
      />

      {selectedFile && (
        <Modal
          title={selectedFile.file_name}
          open={isViewerVisible}
          onCancel={handleCloseFileViewer}
          footer={null}
          centered
          width="80%"
          bodyStyle={{ padding: 0 }}
          closeIcon={<></>}
          maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          zIndex={9999}
        >
          <div className="w-full h-screen flex items-center justify-center">
            {renderFileViewer()}
          </div>
          <div className="flex justify-between items-center p-4 bg-white">
            <Button
              onClick={handleCloseFileViewer}
              className="bg-red-500 text-white"
            >
              Close Viewer
            </Button>
            <Button
              onClick={() => handleDownloadFile(selectedFile.file_id)}
              className="bg-blue-500 text-white"
            >
              Download
            </Button>
          </div>
        </Modal>
      )}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={files.length}
        onChange={handlePageChange}
        style={{
          marginTop: "16px",
          position: "absolute",
          bottom: "300px",
          left: "54.3%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
};

export default FileViewer;
