import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import Sidebar from "./Sidebar";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/tenant" },
  { text: "Properties", icon: <HomeIcon />, path: "/tenant/properties" },
  { text: "My Requests", icon: <AssignmentIcon />, path: "/tenant/requests" },
];

const TenantSidebar = ({ onMobileClose, isMobile }) => {
  return (
    <Sidebar
      title="Tenant Portal"
      menuItems={menuItems}
      onMobileClose={onMobileClose}
      isMobile={isMobile}
    />
  );
};

export default TenantSidebar;