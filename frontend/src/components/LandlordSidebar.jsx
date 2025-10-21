import React from "react";
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Build as BuildIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import Sidebar from "./Sidebar";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/landlord" },
  { text: "Properties", icon: <HomeIcon />, path: "/landlord/properties" },
  { text: "Tenants", icon: <PeopleIcon />, path: "/landlord/tenants" },
  { text: "Agreements", icon: <DescriptionIcon />, path: "/landlord/agreements" },
  { text: "Payments", icon: <PaymentIcon />, path: "/landlord/payments" },
  { text: "Maintenance", icon: <BuildIcon />, path: "/landlord/maintenance" },
  { text: "Settings", icon: <SettingsIcon />, path: "/landlord/settings" },
];

const LandlordSidebar = ({ onMobileClose, isMobile }) => {
  return (
    <Sidebar
      title="Landlord Portal"
      menuItems={menuItems}
      onMobileClose={onMobileClose}
      isMobile={isMobile}
    />
  );
};

export default LandlordSidebar;