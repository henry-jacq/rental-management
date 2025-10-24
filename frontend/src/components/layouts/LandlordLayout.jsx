import { IconButton, Tooltip } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import BaseLayout from "./BaseLayout";
import LandlordSidebar from "../LandlordSidebar";
import ProfileDropdown from "../ProfileDropdown";

const LandlordLayout = ({ children }) => {
  const appBarActions = (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" size="small">
        </IconButton>
      </Tooltip>
      <ProfileDropdown userRole="landlord" />
    </>
  );

  return (
    <BaseLayout
      SidebarComponent={LandlordSidebar}
      appBarActions={appBarActions}
    >
      {children}
    </BaseLayout>
  );
};

export default LandlordLayout;
