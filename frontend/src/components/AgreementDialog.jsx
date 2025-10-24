import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const AgreementDialog = ({
  open,
  onClose,
  mode, // 'create', 'edit', 'preview'
  agreement,
  properties = [],
  tenants = [],
  onSave,
  loading = false
}) => {
  // Debug logging
  console.log('AgreementDialog render:', {
    open,
    mode,
    agreementTitle: agreement?.title,
    propertiesCount: properties?.length,
    tenantsCount: tenants?.length
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    terms: "",
    property: "",
    tenant: "",
    status: "Draft",
    expiresAt: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize form data when dialog opens or agreement changes
  useEffect(() => {
    console.log('AgreementDialog useEffect triggered:', { open, mode, agreement: agreement?.title });
    if (open) {
      try {
        if (mode === 'create') {
          console.log('Setting up create mode');
          setFormData({
            title: "",
            description: "",
            terms: "",
            property: "",
            tenant: "",
            status: "Draft",
            expiresAt: "",
          });
        } else if (agreement && (mode === 'edit' || mode === 'preview')) {
          console.log('Setting up edit/preview mode with agreement:', agreement);
          setFormData({
            title: agreement.title || "",
            description: agreement.description || "",
            terms: agreement.terms || "",
            property: agreement.property?._id || "",
            tenant: agreement.tenant?._id || "",
            status: agreement.status || "Draft",
            expiresAt: agreement.expiresAt ? agreement.expiresAt.split('T')[0] : "",
          });
        }
        setErrors({});
      } catch (error) {
        console.error('Error initializing dialog:', error);
      }
    }
  }, [open, mode, agreement]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };



  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.terms.trim()) {
      newErrors.terms = "Terms are required";
    }

    if (formData.expiresAt && new Date(formData.expiresAt) <= new Date()) {
      newErrors.expiresAt = "Expiry date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      await onSave(formDataToSend, mode);
      handleClose();
    } catch (error) {
      console.error('Error saving agreement:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      terms: "",
      property: "",
      tenant: "",
      status: "Draft",
      expiresAt: "",
    });
    setErrors({});
    onClose();
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Agreement';
      case 'edit': return 'Edit Agreement';
      case 'preview': return 'Agreement Details';
      default: return 'Agreement';
    }
  };

  const isReadOnly = mode === 'preview';
  const canEdit = mode === 'edit' && (agreement?.status === 'Draft' || agreement?.status === 'Active');

  console.log('AgreementDialog rendering:', { open, mode, formData });

  // If dialog is not open, don't render anything
  if (!open) {
    console.log('Dialog not open, returning null');
    return null;
  }

  try {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '70vh',
            '& .MuiDialogContent-root': {
              padding: '20px',
            }
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{getDialogTitle()}</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ minHeight: '400px', padding: '24px' }}>
          {/* Header info */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" color="primary">
              {mode === 'create' ? 'Create New Agreement' :
                mode === 'edit' ? 'Edit Agreement' : 'Agreement Preview'}
            </Typography>
            {agreement && (
              <Typography variant="body2" color="text.secondary">
                {agreement.title}
              </Typography>
            )}
          </Box>

          {/* Form Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Agreement Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isReadOnly}
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={3}
              disabled={isReadOnly}
            />

            <TextField
              fullWidth
              label="Terms & Conditions"
              value={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              multiline
              rows={4}
              disabled={isReadOnly}
              placeholder="Enter agreement terms..."
            />

            {mode !== 'create' && agreement && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Status: {agreement.status || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(agreement.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={submitting}>
            {mode === 'preview' ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={submitting || (mode === 'edit' && !canEdit)}
              startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {submitting ? 'Saving...' : (mode === 'create' ? 'Create Agreement' : 'Update Agreement')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  } catch (error) {
    console.error('Error rendering AgreementDialog:', error);
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Failed to load dialog: {error.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default AgreementDialog;