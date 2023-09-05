import axios from "./axiosInstance";

export const uploadFile = (file, patientId, residentId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("patient_id", patientId);
  formData.append("resident_id", residentId);

  return axios.post("/fileUpload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
