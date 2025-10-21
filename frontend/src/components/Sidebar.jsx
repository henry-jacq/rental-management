import {
    Box,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ title, menuItems, onMobileClose, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile && onMobileClose) {
            onMobileClose();
        }
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{
                minHeight: 64,
                display: "flex",
                alignItems: "center",
                px: 3,
                borderBottom: "1px solid",
                borderColor: "divider"
            }}>
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
        </Box>
    );
};

export default Sidebar;