import { useState } from "react";
import {
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Box,
    Tooltip,
} from "@mui/material";
import {
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProfileDropdown = ({ userRole }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, loading, clearUser } = useUser();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    // Don't render if user data is still loading
    if (loading) {
        return (
            <Avatar sx={{ width: 32, height: 32, bgcolor: "action.disabled" }}>
                {userRole === "landlord" ? "L" : "T"}
            </Avatar>
        );
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        const profilePath = userRole === "landlord" ? "/landlord/profile" : "/tenant/profile";
        navigate(profilePath);
        handleClose();
    };

    const handleSettings = () => {
        const settingsPath = userRole === "landlord" ? "/landlord/settings" : "/tenant/settings";
        navigate(settingsPath);
        handleClose();
    };

    const handleLogout = () => {
        clearUser();
        navigate("/");
        handleClose();
    };

    const avatarColor = userRole === "landlord" ? "primary.main" : "secondary.main";

    return (
        <>
            <Tooltip title={user?.name ? `${user.name} (${user.email})` : `${userRole} Account`}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: "0.875rem" }}>
                        {user?.initials || (userRole === "landlord" ? "L" : "T")}
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="profile-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        minWidth: 240,
                        maxWidth: 280,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderBottom: 'none',
                            borderRight: 'none',
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: avatarColor, fontSize: "1rem" }}>
                            {user?.initials || (userRole === "landlord" ? "L" : "T")}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    fontWeight: 600, 
                                    lineHeight: 1.2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {user?.name || `${userRole === "landlord" ? "Landlord" : "Tenant"} User`}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                    fontSize: "0.75rem", 
                                    lineHeight: 1.2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {user?.email || "No email available"}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                        textTransform: "capitalize",
                        backgroundColor: "action.hover",
                        px: 1,
                        py: 0.25,
                        borderRadius: 0.5,
                        fontSize: "0.6875rem"
                    }}>
                        {userRole}
                    </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleSettings}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ProfileDropdown;