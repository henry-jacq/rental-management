import React from "react";
import { IconButton, Avatar, Tooltip } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import BaseLayout from "./BaseLayout";
import TenantSidebar from "../TenantSidebar";
import { useUser } from "../../contexts/UserContext";

const TenantLayout = ({ children }) => {
  const { user } = useUser();
  
  const appBarActions = (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" size="small">
          <NotificationsIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={user?.name || "Account"}>
        <IconButton color="inherit" size="small">
          <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: "0.875rem" }}>
            {user?.initials || "T"}
          </Avatar>
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <BaseLayout
      SidebarComponent={TenantSidebar}
      title="Rental Management"
      appBarActions={appBarActions}
    >
      {children}
    </BaseLayout>
  );
};

export default TenantLayout;
