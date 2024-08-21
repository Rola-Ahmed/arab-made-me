// src/roles/factorydashRoles.js
import { Navigate } from "react-router-dom";
import ErrorToast from "../components/ErrorToast"; // Adjusted import path

// Function to determine the appropriate navigation path based on user data
const getNavigationPath = (userRole, importerId) => {
  if (importerId) return "/importerdashboard/403?refresh";
  if (userRole === "admin") return "/adminDashboard/403?refresh";
  return "/403";
};

// Authorization check function
export const checkFactorydashAuthorization = (isLogin, currentUserData) => {
  // Check if the user is logged in
  if (!isLogin) {
    ErrorToast(
      "You are not authorized to access this page. Please sign in first."
    );
    return <Navigate to="/signIn" />;
  }

  // If the user is logged in, check user data
  if (currentUserData) {
    const { factoryId, importerId, userRole } = currentUserData;

    // Log user data for debugging purposes
    console.log("User Data:", { factoryId, importerId, userRole });

    if (!factoryId) {
      return;
    } else if (importerId) {
      ErrorToast("You are not authorized to access");
      return <Navigate to="/importerdashboard/403?refresh" />;
    } else if (userRole == "admin") {
      ErrorToast("You are not authorized to access");
      return <Navigate to="/adminDashboard/403?refresh" />;
    } else if (userRole == "user") {
      ErrorToast("You are not authorized to access");
      return <Navigate to="/403" />;
    }
  }

  // Return null if no redirection is needed
  return null;
};
