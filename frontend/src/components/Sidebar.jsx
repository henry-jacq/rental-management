import {
    Box,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Sidebar = ({ title, menuItems, onMobileClose, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearUser } = useUser();

    const handleLogout = () => {
        clearUser();
        navigate("/");
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile && onMobileClose) {
            onMobileClose();
        }
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                    {title}
                </Typography>
            </Box>
            <List sx={{ flexGrow: 1, p: 2 }}>
                {menuItems.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                selected={isSelected}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 1,
                                    minHeight: 44,
                                    transition: "all 0.2s ease-in-out",
                                    "&.Mui-selected": {
                                        backgroundColor: "primary.main",
                                        color: "white",
                                        "& .MuiListItemIcon-root": {
                                            color: "white",
                                        },
                                        "& .MuiListItemText-primary": {
                                            color: "white",
                                            fontWeight: 600,
                                        },
                                        "&:hover": {
                                            backgroundColor: "primary.dark",
                                            transform: "translateX(2px)",
                                        },
                                    },
                                    "&:hover": {
                                        backgroundColor: isSelected ? "primary.dark" : "action.hover",
                                        transform: isSelected ? "translateX(2px)" : "translateX(1px)",
                                        "& .MuiListItemIcon-root": {
                                            color: isSelected ? "white" : "primary.main",
                                        },
                                        "& .MuiListItemText-primary": {
                                            color: isSelected ? "white" : "text.primary",
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 36,
                                        color: isSelected ? "white" : "text.secondary",
                                        transition: "color 0.2s ease-in-out",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                fontSize: "0.875rem",
                                                fontWeight: isSelected ? 600 : 500,
                                                color: isSelected ? "white" : "text.primary",
                                                transition: "all 0.2s ease-in-out",
                                            }
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 1,
                            minHeight: 44,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                backgroundColor: "error.light",
                                color: "error.contrastText",
                                transform: "translateX(1px)",
                                "& .MuiListItemIcon-root": {
                                    color: "error.main",
                                },
                                "& .MuiListItemText-primary": {
                                    color: "error.main",
                                    fontWeight: 600,
                                },
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 36,
                                color: "text.secondary",
                                transition: "color 0.2s ease-in-out",
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            slotProps={{
                                primary: {
                                    sx: {
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        transition: "all 0.2s ease-in-out",
                                    }
                                }
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );
};

export default Sidebar;