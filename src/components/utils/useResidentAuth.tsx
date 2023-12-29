import axiosInstance from "./axiosInstance";
import router from "next/router";

const useResidentAuth = () => {
  const login = async ({ username, password }) => {
    try {
      const dataToSend = {
        resident_userName: username,
        resident_password: password,
      };

      const response = await axiosInstance.post("/login", dataToSend, {
        headers: {},
      });

      const token = response.data.token;
      const role = response.data.role; // Get the role from the response
      const resident_id = response.data.resident_id;
      const resident_fName = response.data.resident_fName;
      const resident_lName = response.data.resident_lName;
      const depId = response.data.department_id;

      console.log("Resident ID:", resident_id);

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("userRole", role); // Save the role in the session
      sessionStorage.setItem("resID", resident_id);
      sessionStorage.setItem("resFirstName", resident_fName);
      sessionStorage.setItem("resLastname", resident_lName);
      sessionStorage.setItem("depID", depId);
      sessionStorage.setItem("userN", username);
      router.push("/");
      return "success";
    } catch (error) {
      console.error("Resident login error:", error);
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
    sessionStorage.removeItem("resID");
    sessionStorage.removeItem("resFirstName");
    sessionStorage.removeItem("resLastname");
    sessionStorage.removeItem("depID");
    sessionStorage.removeItem("userN");

    await axiosInstance.get("/logout");
    router.push("/authentication/login");
  };

  return {
    login,
    logout,
  };
};

export default useResidentAuth;
