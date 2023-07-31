import useSWR from "swr";
import axiosInstance from "./axiosInstance";
import router from "next/router";

const useAuth = () => {
  const { data: resident, mutate } = useSWR("/residents", () =>
    axiosInstance.get("/residents").then((response) => response.data.data)
  );

  const getCSRFToken = async () => {
    try {
      const response = await axiosInstance.get(
        "http://127.0.0.1:8000/sanctum/csrf-cookie"
      );
      const csrfToken = response.headers["x-xsrf-token"]; // Change this to "X-XSRF-TOKEN"
      console.log("CSRF Token:", csrfToken);
      return csrfToken;
    } catch (error) {
      console.error("Error getting CSRF token:", error);
      return null;
    }
  };

  interface LoginCredentials {
    resident_userName: string;
    resident_password: string;
  }

  const login = async ({
    resident_userName,
    resident_password,
  }: LoginCredentials) => {
    try {
      const xsrfToken = await getCSRFToken();
      const response = await axiosInstance.post(
        "/login",
        {
          resident_userName,
          resident_password,
        },
        {
          headers: {
            "X-XSRF-TOKEN": xsrfToken,
          },
        }
      );

      // Assuming your API response contains a 'token' key
      const token = response.data.token;

      // Store the token securely in localStorage
      sessionStorage.setItem("authToken", token);

      await mutate();
      router.push("/");
    } catch (error) {
      console.error("Error occurred during login:", error);
      // Handle authentication error here, e.g., show an error message to the user
    }
  };

  const logout = async () => {
    // Clear the token from localStorage on logout
    sessionStorage.removeItem("authToken");
    await axiosInstance.get("/logout");
    mutate(null);
    router.push("/authentication/login");
  };

  return {
    resident,
    login,
    logout,
  };
};

export default useAuth;
