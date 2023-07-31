import React, { useEffect, useState } from "react";
import { Box, List } from "@mui/material";
import { useRouter } from "next/router";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import ExpandableCard from "../../../../pages/utilities/floors/ExpandableCard";
import axios from "../../../components/utils/axiosInstance"; // Import your Axios instance
import { IconTypography } from "@tabler/icons-react";
import { uniqueId } from "lodash";
import Menuitems from "./MenuItems";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const { pathname } = useRouter();
  const pathDirect = pathname;

  // State to store the fetched floor names
  const [floorNames, setFloorNames] = useState([]);

  // Fetch floor names from the Laravel API
  useEffect(() => {
    async function fetchFloorNames() {
      try {
        const token = sessionStorage.getItem("authToken");

        // Set the token in Axios headers for this request
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios.get("/floors"); // Replace '/api/floors' with the actual endpoint of your Laravel API that returns floor names
        setFloorNames(response.data);
      } catch (error) {
        console.error("Error fetching floor names:", error);
      }
    }

    fetchFloorNames();
  }, []);

  // Use the fetched floor names to create the updatedMenuitems array
  const updatedMenuitems = Menuitems.map((item) => {
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
