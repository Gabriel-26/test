export function getUserRole() {
  if (typeof localStorage !== "undefined") {
    const role = localStorage.getItem("userRole");
    return role;
  } else {
    // Handle the case where localStorage is not available (e.g., in a server-side context)
    return null; // or return a default role or handle the error as needed
  }
}
