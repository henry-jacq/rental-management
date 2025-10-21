import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Build as BuildIcon,
  Description as DocumentIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import Sidebar from "./Sidebar";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/tenant" },
  { text: "Properties", icon: <HomeIcon />, path: "/tenant/properties" },
  { text: "Payments", icon: <PaymentIcon />, path: "/tenant/payments" },
  { text: "Maintenance", icon: <BuildIcon />, path: "/tenant/maintenance" },
  { text: "Documents", icon: <DocumentIcon />, path: "/tenant/documents" },
  { text: "Notifications", icon: <NotificationsIcon />, path: "/tenant/notifications" },
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