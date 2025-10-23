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
        <Box sx={{ 
            height: "100%", 
            display: "flex", 
            flexDirection: "column",
            backgroundColor: "background.paper",
        }}>
            {/* Sidebar Header */}
            <Box sx={{
                minHeight: 64,
                display: "flex",
                alignItems: "center",
                px: 3,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 700, 
                        color: "primary.main",
                        letterSpacing: '-0.01em',
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {/* Navigation Menu */}
            <List sx={{ 
                flexGrow: 1, 
                p: 2,
                pt: 3,
            }}>
                {menuItems.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return (
                        <ListItem 
                            key={item.text} 
                            disablePadding 
                            sx={{ mb: 0.5 }}
                        >
                            <ListItemButton
                                selected={isSelected}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    minHeight: 48,
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1.5,
                                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                    position: "relative",
                                    overflow: "hidden",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: 3,
                                        backgroundColor: "primary.main",
                                        transform: isSelected ? "scaleY(1)" : "scaleY(0)",
                                        transition: "transform 0.2s ease-in-out",
                                        borderRadius: "0 4px 4px 0",
                                    },
                                    "&.Mui-selected": {
                                        backgroundColor: "rgba(37, 99, 235, 0.08)",
                                        "& .MuiListItemIcon-root": {
                                            color: "primary.main",
                                        },
                                        "& .MuiListItemText-primary": {
                                            color: "primary.main",
                                            fontWeight: 600,
                                        },
                                        "&:hover": {
                                            backgroundColor: "rgba(37, 99, 235, 0.12)",
                                        },
                                    },
                                    "&:hover": {
                                        backgroundColor: isSelected 
                                            ? "rgba(37, 99, 235, 0.12)" 
                                            : "rgba(37, 99, 235, 0.04)",
                                        "& .MuiListItemIcon-root": {
                                            color: "primary.main",
                                            transform: "scale(1.1)",
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: isSelected ? "primary.main" : "text.secondary",
                                        transition: "all 0.2s ease-in-out",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        sx: {
                                            fontSize: "0.875rem",
                                            fontWeight: isSelected ? 600 : 500,
                                            color: isSelected ? "primary.main" : "text.primary",
                                            transition: "all 0.2s ease-in-out",
                                            letterSpacing: '0.01em',
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