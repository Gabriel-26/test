import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";
import { IoChatbubbles } from "react-icons/io5";
import { uniqueId } from "lodash";
import { BiSolidDashboard } from "react-icons/bi";
import { MdAssignment } from "react-icons/md";
import { MdAssignmentAdd } from "react-icons/md";
import { BsFillFilePersonFill } from "react-icons/bs";
import { RiMedicineBottleFill } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";

// Define your menu items with a "role" property
const Menuitems = [
  {
    navlabel: true,
    id: uniqueId(),
    title: "Home",
    subheader: "Home",
    role: "all", // This item is visible to all roles
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: BiSolidDashboard,
    href: "/",
    role: "all", // This item is visible to all roles
  },

  {
    id: uniqueId(),
    title: "Chat",
    icon: IoChatbubbles,
    href: "/chat",
    role: ["chiefResident", "resident"],
  },

  {
    navlabel: true,
    id: uniqueId(),
    title: "Home",
    subheader: "Doctors",
    role: ["chiefResident", "admin", "resident"], // This item is visible to both "chiefResident" and "admin"
  },
  {
    id: uniqueId(),
    title: "Residents",
    icon: FaUserDoctor,
    href: "/doctors/residents",
    role: "admin", // This item is visible to residents and admin
  },
  {
    id: uniqueId(),
    title: "Chief Resident",
    icon: FaUserDoctor,
    href: "/doctors/chiefresident",
    role: "admin", // This item is visible to residents and admin
  },
  {
    id: uniqueId(),
    title: "Assign Residents",
    icon: MdAssignmentAdd,
    href: "/doctors/chiefresident/assignResident",
    role: ["chiefResident"], // This item is visible to residents and admin
  },

  {
    id: uniqueId(),
    title: "Assigned Rooms",
    icon: MdAssignment,
    href: "/doctors/residents/assignedRooms",
    role: "resident", // This item is visible to all roles
  },
  {
    navlabel: true,
    id: uniqueId(),
    title: "Patients",
    subheader: "Patients",
    role: ["chiefResident", "resident"],
  },
  {
    id: uniqueId(),
    title: "Patients",
    icon: BsFillFilePersonFill,
    href: "/patients",
    role: ["chiefResident", "resident"], // This item is visible to residents and admin
  },
  {
    navlabel: true,
    id: uniqueId(),
    title: "Home",
    type: "expandable-card", // Add the type property for the expandable-card
    children: [],
    role: ["chiefResident", "admin"], // This item is visible to residents and admin
  },
  // {
  //   navlabel: true,
  //   id: uniqueId(),
  //   title: "Home",

  //   subheader: "Auth",
  //   role: "all", // This item is visible to all roles
  // },
  // {
  //   id: uniqueId(),
  //   title: "Login",
  //   icon: IconLogin,
  //   href: "/authentication/login",
  //   role: "all", // This item is visible to all roles
  // },
  // {
  //   id: uniqueId(),
  //   title: "Room/PatientView",
  //   icon: IconLogin,
  //   href: "/utilities/patientroom",
  //   role: "resident", // This item is visible to residents
  // },
  {
    navlabel: true,
    id: uniqueId(),
    title: "Home",

    subheader: "Medicine",
    role: "all", // This item is visible to all roles
  },
  // {
  //   id: uniqueId(),
  //   title: "EHR Form",
  //   icon: IconMoodHappy,
  //   href: "/EHR",
  //   role: "all", // This item is visible to all roles
  // },
  {
    id: uniqueId(),
    title: "Medicines",
    icon: RiMedicineBottleFill,
    href: "/medicine",
    role: "all", // This item is visible to all roles
  },
];

export default Menuitems;
