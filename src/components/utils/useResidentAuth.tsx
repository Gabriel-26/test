import axiosInstance from "./axiosInstance";
import router from "next/router";

const useResidentAuth = () => {
  let clearLocalStorageTimer; // Declare the variable outside the login function

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
      const resident_gender = response.data.resident_gender;
      const depName = response.data.department_name;

      console.log("Resident ID:", resident_id);
      console.log("Gender:", resident_gender);
      console.log("Department Name:", response.data.department_name);

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role); // Save the role in the session
      localStorage.setItem("resID", resident_id);
      localStorage.setItem("resFirstName", resident_fName);
      localStorage.setItem("resLastname", resident_lName);
      localStorage.setItem("depID", depId);
      localStorage.setItem("depName", depName);
      localStorage.setItem("userN", username);
      localStorage.setItem("userGender", resident_gender);

      clearLocalStorageTimer = setTimeout(() => {
        logout(); // Call the logout function to clear local storage
      }, 10 * 60 * 60 * 1000); // 10 hours

      router.push("/");
      return "success";
    } catch (error) {
      console.error("Resident login error:", error);
      return "failure";

      // Handle authentication error here, e.g., show an error message to the user
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("authToken");
    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("resID");
    localStorage.removeItem("resFirstName");
    localStorage.removeItem("resLastname");
    localStorage.removeItem("depID");
    localStorage.removeItem("depName");
    localStorage.removeItem("userN");
    localStorage.removeItem("userGender");

    clearTimeout(clearLocalStorageTimer);

    await axiosInstance.get("/logout");
    router.push("/authentication/login");
  };

  return {
    login,
    logout,
  };
};

export default useResidentAuth;
