import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Doctors",
  },
  {
    id: uniqueId(),
    title: "Residents",
    icon: IconLogin,
    href: "/doctors/residents",
  },
  {
    id: uniqueId(),
    title: "Chief Resident",
    icon: IconLogin,
    href: "/doctors/chiefresident",
  },
  {
    navlabel: true,
    type: "expandable-card", // Add the type property for the expandable-card
    children: [],
  },
  {
    navlabel: true,
    subheader: "Auth",
  },
  {
    id: uniqueId(),
    title: "Login",
    icon: IconLogin,
    href: "/authentication/login",
  },
  {
    id: uniqueId(),
    title: "Room/PatientView",
    icon: IconLogin,
    href: "/utilities/patientroom",
  },
  {
    navlabel: true,
    subheader: "Extra",
  },
  {
    id: uniqueId(),
    title: "EHR Form",
    icon: IconMoodHappy,
    href: "/EHR",
  },
  {
    id: uniqueId(),
    title: "Medicines",
    icon: IconAperture,
    href: "/medicine",
  },
];

export default Menuitems;
