import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Home as HomeIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

const PropertyContactDialog = ({
  open,
  onClose,
  property,
  onSubmit
}) => {
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      await onSubmit(property.id, query);
      setQuery("");
      onClose();
    } catch (error) {
      setError("Failed to send request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuery("");
    setError("");
    onClose();
  };

  if (!property) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { minHeight: '400px' }
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Contact Property Owner</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Property Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Property Details
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HomeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">{property.title}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {property.location}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>₹{property.rent?.toLocaleString()}/month</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {property.bedrooms} Bed • {property.bathrooms} Bath • {property.area} sqft
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Landlord Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Property Owner
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              {property.landlord?.name?.charAt(0) || 'L'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {property.landlord?.name || 'Property Owner'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <EmailIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Contact via platform
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Contact Form */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Send Request
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message (Optional)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary">
            Your contact information will be shared with the property owner so they can respond to your request.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? 'Sending...' : 'Send Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyContactDialog;