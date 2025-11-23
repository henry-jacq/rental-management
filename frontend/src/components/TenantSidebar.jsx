import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import Sidebar from "./Sidebar";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/tenant" },
  { text: "Properties", icon: <HomeIcon />, path: "/tenant/properties" },
  { text: "My Requests", icon: <AssignmentIcon />, path: "/tenant/requests" },
  { text: "Payments", icon: <PaymentIcon />, path: "/tenant/payments" },
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