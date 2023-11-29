import axiosInstance from "./axiosInstance";
import router from "next/router";
import { message } from "antd";

const useAdminAuth = () => {
  const login = async ({ username, password }) => {
    try {
      const dataToSend = {
        email: username,
        password: password,
      };
      // console.log("Sending data:", dataToSend);

      const response = await axiosInstance.post("/admin/Login", dataToSend, {
        headers: {},
      });
      // console.log("Received response:", response.data);

      if (response.data.token) {
        const token = response.data.token;
        const role = response.data.role;

        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userRole", role); // Save the role in the session

        // Redirect to the desired route (e.g., '/')
        router.push("/");
        return "success";
      } else {
        // Handle authentication error here and show an error message to the user
        // message.error("Invalid credentials. Please try again.");
        return "failure";
      }
    } catch (error) {
      console.error("Admin login error:", error);
      // Handle other errors here and show an error message
      message.error("An error occurred during login. Please try again later.");
      return "failure";
    }
  };

  const logout = async () => {
    const token = sessionStorage.getItem("authToken");
    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    await axiosInstance.get("/admin/Logout");
    router.push("/authentication/login");
  };

  return {
    login,
    logout,
  };
};

export default useAdminAuth;
