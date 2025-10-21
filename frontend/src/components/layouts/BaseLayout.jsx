import React, { useState } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AppBarComponent from "../AppBarComponent";

const drawerWidth = 240;

const BaseLayout = ({ 
  children, 
  SidebarComponent,
  appBarActions 
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBarComponent
        drawerWidth={drawerWidth}
        onDrawerToggle={handleDrawerToggle}
        actions={appBarActions}
      />
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "background.paper",
            },
          }}
        >
          <SidebarComponent onMobileClose={handleMobileClose} isMobile={isMobile} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          <SidebarComponent onMobileClose={handleMobileClose} isMobile={false} />
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "background.default",
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default BaseLayout;