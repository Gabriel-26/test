// components/Navigation.js
import React from "react";
import { useSelector } from "react-redux"; // Or any other state management solution
import { useRouter } from "next/router";
import { Url } from "next/dist/shared/lib/router/router";

const Navigation = () => {
  const router = useRouter();

  // Get the user's isChief value from your state management (Redux) or context
  const isChief = useSelector((state) => state.user.isChief);

  // Function to handle navigation to a specific link
  const handleNavigation = (href: Url) => {
    router.push(href);
  };

  return (
    <div>
      {/* Other navigation links */}
      {/* <button onClick={() => handleNavigation('/')}>Home</button> */}
      <button onClick={() => handleNavigation("/doctors/residents")}>
        Residents
      </button>
      {/* Show the "Chief Resident" link only if isChief is not true (false or any other value) */}
      {!isChief && (
        <button onClick={() => handleNavigation("/doctors/chiefresident")}>
          Chief Resident
        </button>
      )}
    </div>
  );
};

export default Navigation;
