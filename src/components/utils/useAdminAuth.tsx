import axiosInstance from "./axiosInstance";
import router from "next/router";

const useAdminAuth = () => {
  const login = async ({ username, password }) => {
    try {
      const dataToSend = {
        email: username,
        password: password,
      };

      const response = await axiosInstance.post("/admin/Login", dataToSend, {
        headers: {},
      });

      const token = response.data.token;
      const role = response.data.role;

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("userRole", role); // Save the role in the session

      router.push("/");
      return "success";
    } catch (error) {
      console.error("Admin login error:", error);
      return "failure";

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
