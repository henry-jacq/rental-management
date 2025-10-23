import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import FileUpload from "./FileUpload";

const AgreementDialog = ({
  open,
  onClose,
  mode, // 'create', 'edit', 'preview'
  agreement,
  properties,
  tenants,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    terms: "",
    property: "",
    tenant: "",
    status: "Draft",
    expiresAt: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [documentsToRemove, setDocumentsToRemove] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize form data when dialog opens or agreement changes
  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        setFormData({
          title: "",
          description: "",
          terms: "",
          property: "",
          tenant: "", // Keep in state but won't be shown in create mode
          status: "Draft",
          expiresAt: "",
        });
        setSelectedFiles([]);
        setExistingDocuments([]);
        setDocumentsToRemove([]);
      } else if (agreement && (mode === 'edit' || mode === 'preview')) {
        setFormData({
          title: agreement.title || "",
          description: agreement.description || "",
          terms: agreement.terms || "",
          property: agreement.property?._id || "",
          tenant: agreement.tenant?._id || "",
          status: agreement.status || "Draft",
          expiresAt: agreement.expiresAt ? agreement.expiresAt.split('T')[0] : "",
        });
        setSelectedFiles([]);
        setExistingDocuments(agreement.documents || []);
        setDocumentsToRemove([]);
      }
      setErrors({});
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

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
  };

  const handleRemoveExistingDocument = (documentId) => {
    setDocumentsToRemove(prev => [...prev, documentId]);
    setExistingDocuments(prev => prev.filter(doc => doc._id !== documentId));
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/landlord-agreements/${agreement._id}/download/${doc._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download document');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
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

      console.log("Preparing form data for submission...");

      // Add form fields (exclude tenant for create mode)
      Object.keys(formData).forEach(key => {
        if (formData[key] !== "") {
          // Skip tenant field when creating new agreement
          if (mode === 'create' && key === 'tenant') {
            return;
          }
          formDataToSend.append(key, formData[key]);
          console.log(`Added field ${key}:`, formData[key]);
        }
      });

      // Add documents to remove (for edit mode)
      if (mode === 'edit' && documentsToRemove.length > 0) {
        formDataToSend.append('removeDocuments', JSON.stringify(documentsToRemove));
        console.log("Documents to remove:", documentsToRemove);
      }

      // Add new files
      selectedFiles.forEach((file, index) => {
        formDataToSend.append('documents', file);
        console.log(`Added file ${index}:`, file.name);
      });

      console.log("Submitting form data...");
      await onSave(formDataToSend, mode);
      handleClose();
    } catch (error) {
      console.error('Error saving agreement:', error);
      // Error is handled by parent component
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
    setSelectedFiles([]);
    setExistingDocuments([]);
    setDocumentsToRemove([]);
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
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

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Agreement Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              disabled={isReadOnly}
              required
            />
          </Grid>

          <Grid item xs={12} sm={mode === 'create' ? 12 : 6}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Property</InputLabel>
              <Select
                value={formData.property}
                label="Property"
                onChange={(e) => handleInputChange('property', e.target.value)}
              >
                <MenuItem value="">
                  <em>Select Property (Optional)</em>
                </MenuItem>
                {properties.map((property) => (
                  <MenuItem key={property._id} value={property._id}>
                    {property.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {mode === 'create' && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                You can assign a tenant to this agreement later by editing it.
              </Typography>
            )}
          </Grid>

          {/* Tenant field - only show in edit/preview mode */}
          {mode !== 'create' && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isReadOnly}>
                <InputLabel>Tenant</InputLabel>
                <Select
                  value={formData.tenant}
                  label="Tenant"
                  onChange={(e) => handleInputChange('tenant', e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select Tenant</em>
                  </MenuItem>
                  {tenants.map((tenant) => (
                    <MenuItem key={tenant._id} value={tenant._id}>
                      {tenant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={3}
              disabled={isReadOnly}
            />
          </Grid>

          {/* Terms and Conditions */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Terms & Conditions
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Terms & Conditions"
              value={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              multiline
              rows={6}
              error={!!errors.terms}
              helperText={errors.terms || "Enter the detailed terms and conditions of the agreement"}
              disabled={isReadOnly}
              required
            />
          </Grid>

          {/* Agreement Details */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Agreement Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
                <MenuItem value="Terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={formData.expiresAt}
              onChange={(e) => handleInputChange('expiresAt', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.expiresAt}
              helperText={errors.expiresAt}
              disabled={isReadOnly}
            />
          </Grid>

          {/* Documents Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Documents
            </Typography>
          </Grid>

          {/* Existing Documents */}
          {existingDocuments.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Existing Documents
              </Typography>
              <List dense>
                {existingDocuments.map((document) => (
                  <ListItem key={document._id} divider>
                    <ListItemIcon>
                      <AttachFileIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={document.originalName}
                      secondary={`${(document.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDownloadDocument(document)}
                        sx={{ mr: 1 }}
                      >
                        <DownloadIcon />
                      </IconButton>
                      {!isReadOnly && (
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveExistingDocument(document._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}

          {/* File Upload */}
          {!isReadOnly && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {mode === 'edit' ? 'Add New Documents' : 'Upload Documents'}
              </Typography>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                maxFiles={10}
                maxSize={10 * 1024 * 1024} // 10MB
                acceptedTypes={['.pdf', '.doc', '.docx', '.txt']}
              />
            </Grid>
          )}

          {/* Preview Mode Additional Info */}
          {mode === 'preview' && agreement && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Agreement Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(agreement.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated: {new Date(agreement.updatedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                {agreement.signedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Signed: {new Date(agreement.signedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
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
};

export default AgreementDialog;