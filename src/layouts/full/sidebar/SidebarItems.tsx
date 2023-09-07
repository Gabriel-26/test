import React, { useEffect, useState } from "react";
import { Box, List } from "@mui/material";
import { useRouter } from "next/router";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import ExpandableCard from "../../../../pages/utilities/floors/ExpandableCard";
import { IconTypography } from "@tabler/icons-react";
import { uniqueId } from "lodash";
import Menuitems from "./MenuItems"; // Import your menu items
import { getUserRole } from "../../../components/utils/roles"; // Import the getUserRole function
import useFloorStore from "../../../components/utils/zustandStore";
import axiosInstance from "../../../components/utils/axiosInstance";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const { pathname } = useRouter();
  const pathDirect = pathname;
  const userRole = getUserRole(); // Get the user's role

  // Filter menu items based on the user's role
  const filteredMenuItems = Menuitems.filter((item) => {
    if (item.role.includes("all")) {
      return true; // This item is visible to all roles
    }

    if (item.role.includes(userRole)) {
      return true; // This item is visible to the current user's role
    }

    if (
      (userRole === "chiefResident" || userRole === "admin") &&
      item.subheader === "Doctors"
    ) {
      return true; // This subHeader is visible to "chiefResident" or "admin"
    }

    return false;
  });

  // State to store the fetched floor names
  // const [floorNames, setFloorNames] = useState([]);
  const floorNames = useFloorStore((state) => state.floors);
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const role = sessionStorage.getItem("userRole"); // Assuming user role is stored in sessionStorage

    // Set the token in Axios headers for this request
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    let endpoint = "/floors"; // Default endpoint

    // Check the user's role and update the endpoint if it's "admin"
    if (role === "admin") {
      endpoint = "/admin/floors";
    }

    // Fetch floor names using axiosInstance or your preferred method
    axiosInstance
      .get(endpoint)
      .then((response) => {
        const floorNames = response.data;
        useFloorStore.setState({ floors: floorNames });
      })
      .catch((error) => {
        console.error("Request Error:", error); // Log the error
        // Handle the error as needed
      });
  }, []);

  // Use the fetched floor names to create the updatedMenuitems array
  const updatedMenuitems = filteredMenuItems.map((item) => {
    if (item.type === "expandable-card") {
      return {
        ...item,
        children: floorNames.map((floorName) => ({
          id: uniqueId(),
          title: floorName.floor_name,
          icon: IconTypography,
          href: `/utilities/floors/${floorName.floor_name}?floor_id=${floorName.floor_id}`,
        })),
      };
    } else {
      return item;
    }
  });

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {updatedMenuitems.map((item) => {
          // console.log("Item key:", item.id); // Add this line for debugging

          if (item.type === "expandable-card") {
            return (
              <div key={item.subheader}>
                <NavGroup item={item} />
                {/* Use the ExpandableCard component directly */}
                <ExpandableCard subheader="FLOORS">
                  <List>
                    {item.children.map((subItem) => (
                      <NavItem
                        item={subItem}
                        key={subItem.id}
                        pathDirect={pathDirect}
                        onClick={toggleMobileSidebar}
                      />
                    ))}
                  </List>
                </ExpandableCard>
              </div>
            );
          } else if (!item.navlabel) {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          } else {
            return (
              <NavGroup
                item={item}
                expanded={false}
                toggleExpanded={() => {}}
                key={item.subheader}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
