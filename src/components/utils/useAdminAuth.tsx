import axiosInstance from "./axiosInstance";
import router from "next/router";

const useAdminAuth = () => {
  const getCSRFToken = async () => {
    try {
      const response = await axiosInstance.get(
        "http://192.168.1.9:8000/sanctum/csrf-cookie"
      );
      const csrfToken = response.headers["x-xsrf-token"]; // Change this to "X-XSRF-TOKEN"
      console.log("Admin CSRF Token:", csrfToken);
      return csrfToken;
    } catch (error) {
      console.error("Error getting Admin CSRF token:", error);
      return null;
    }
  };

  const login = async ({ username, password }) => {
    try {
      const xsrfToken = await getCSRFToken();
      const dataToSend = {
        email: username,
        password: password,
      };

      const response = await axiosInstance.post("/admin/Login", dataToSend, {
        headers: {
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      const token = response.data.token;
      const role = response.data.role;

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("userRole", role); // Save the role in the session

      router.push("/");
    } catch (error) {
      console.error("Admin login error:", error);
      // Handle authentication error here, e.g., show an error message to the user
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
