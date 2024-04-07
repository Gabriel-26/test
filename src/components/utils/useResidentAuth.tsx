import axiosInstance from "./axiosInstance";
import router from "next/router";
import { useState, useEffect } from "react";

const useResidentAuth = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  let clearLocalStorageTimer;

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

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role); // Save the role in the session
      localStorage.setItem("resID", resident_id);
      localStorage.setItem("resFirstName", resident_fName);
      localStorage.setItem("resLastname", resident_lName);
      localStorage.setItem("depID", depId);
      localStorage.setItem("depName", depName);
      localStorage.setItem("userN", username);
      localStorage.setItem("userGender", resident_gender);

      startInactivityTimer();

      router.push("/");
      return "success";
    } catch (error) {
      console.error("Resident login error:", error);
      return "failure";
    }
  };

  const startInactivityTimer = () => {
    clearLocalStorageTimer = setTimeout(() => {
      setShowLogoutModal(true); // Show the logout modal
    }, 28800 * 1000); // 8 hours
  };

  const logout = async () => {
    const token = localStorage.getItem("authToken");
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    localStorage.clear();
    clearTimeout(clearLocalStorageTimer);

    await axiosInstance.get("/logout");
    router.push("/authentication/login");
  };

  return {
    login,
    logout,
    showLogoutModal,
    setShowLogoutModal,
  };
};

export default useResidentAuth;
