import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Function to get the XSRF token from the response headers
const getXXsrfToken = (config: AxiosRequestConfig) => {
  return decodeURIComponent(
    config.headers?.["set-cookie"]?.[0]
      ?.split(";")[0]
      ?.replace("XSRF-TOKEN=", "") || ""
  );
};

// Create Axios instance with default configurations
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://ipimsbe.online/api",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  }, // Replace with your Laravel API URL
  withCredentials: true, // Enable CORS credentials to include cookies
});

export { getXXsrfToken }; // Export the getXXsrfToken function
export default axiosInstance;
