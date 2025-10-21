import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const AppBarComponent = ({
    drawerWidth,
    onDrawerToggle,
    actions
}) => {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                backgroundColor: "background.paper",
                color: "text.primary",
                borderBottom: "1px solid",
                borderColor: "divider",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onDrawerToggle}
                        sx={{ mr: 2, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                {actions && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {actions}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default AppBarComponent;