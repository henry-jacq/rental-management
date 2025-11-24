import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Home as HomeIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";

const AgreementCard = ({ 
  agreement, 
  onEdit, 
  onDelete, 
  onPreview,
  onDownload 
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(agreement);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(agreement._id);
    handleMenuClose();
  };

  const handlePreview = () => {
    onPreview(agreement);
    handleMenuClose();
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(agreement);
    }
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "success";
      case "Draft": return "info";
      case "Expired": return "error";
      case "Terminated": return "warning";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <CheckCircleIcon fontSize="small" />;
      case "Draft": return <DescriptionIcon fontSize="small" />;
      case "Expired": return <CancelIcon fontSize="small" />;
      case "Terminated": return <ScheduleIcon fontSize="small" />;
      default: return <DescriptionIcon fontSize="small" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isEditable = () => {
    return agreement.status === 'Draft' || agreement.status === 'Active';
  };

  return (
    <Card 
      sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) => theme.shadows[4],
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with title and menu */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              flexGrow: 1, 
              pr: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical"
            }}
          >
            {agreement.title}
          </Typography>

        </Box>

        {/* Property Information */}
        {agreement.property && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <HomeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {agreement.property.title}
            </Typography>
          </Box>
        )}

        {/* Tenant Information */}
        {agreement.tenant && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {agreement.tenant.name}
            </Typography>
          </Box>
        )}

        {/* Description */}
        {agreement.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical"
            }}
          >
            {agreement.description}
          </Typography>
        )}

        {/* Footer Information */}
        <Box sx={{ mt: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Created: {formatDate(agreement.createdAt)}
            </Typography>
            {agreement.documentCount > 0 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AttachFileIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {agreement.documentCount} file{agreement.documentCount !== 1 ? 's' : ''}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Expiry Date if exists */}
          {agreement.expiresAt && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Expires: {formatDate(agreement.expiresAt)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Action Buttons */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon fontSize="small" />}
              onClick={handlePreview}
            >
              Preview
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<EditIcon fontSize="small" />}
              onClick={handleEdit}
              disabled={!isEditable()}
            >
              Edit
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon fontSize="small" />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 180,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
      >
        <MenuItem onClick={handlePreview}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Preview Agreement</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleEdit} disabled={!isEditable()}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Agreement</ListItemText>
        </MenuItem>

        {agreement.documentCount > 0 && (
          <MenuItem onClick={handleDownload}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download Documents</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Agreement</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default AgreementCard;