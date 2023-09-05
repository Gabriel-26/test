export function getUserRole() {
  if (typeof sessionStorage !== "undefined") {
    const role = sessionStorage.getItem("userRole");
    return role;
  } else {
    // Handle the case where sessionStorage is not available (e.g., in a server-side context)
    return null; // or return a default role or handle the error as needed
  }
}
