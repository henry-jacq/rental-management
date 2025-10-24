import { IconButton, Tooltip } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import BaseLayout from "./BaseLayout";
import TenantSidebar from "../TenantSidebar";
import ProfileDropdown from "../ProfileDropdown";

const TenantLayout = ({ children }) => {
  const appBarActions = (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" size="small">
        </IconButton>
      </Tooltip>
      <ProfileDropdown userRole="tenant" />
    </>
  );

  return (
    <BaseLayout
      SidebarComponent={TenantSidebar}
      appBarActions={appBarActions}
    >
      {children}
    </BaseLayout>
  );
};

export default TenantLayout;
