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
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "X-Requested-With": "XTMLHttpRequest",
    "Content-Type": "application/json",
  }, // Replace with your Laravel API URL
  withCredentials: true, // Enable CORS credentials to include cookies
});

export { getXXsrfToken }; // Export the getXXsrfToken function
export default axiosInstance;
