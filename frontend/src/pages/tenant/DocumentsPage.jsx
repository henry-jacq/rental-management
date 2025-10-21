import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Lease Agreement",
      type: "Contract",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      status: "Active",
      fileType: "pdf",
    },
    {
      id: 2,
      name: "Rental Application",
      type: "Application",
      size: "1.8 MB",
      uploadDate: "2024-01-10",
      status: "Completed",
      fileType: "pdf",
    },
    {
      id: 3,
      name: "Property Photos",
      type: "Photos",
      size: "5.2 MB",
      uploadDate: "2024-01-20",
      status: "Active",
      fileType: "image",
    },
    {
      id: 4,
      name: "Insurance Certificate",
      type: "Insurance",
      size: "1.1 MB",
      uploadDate: "2024-02-01",
      status: "Active",
      fileType: "pdf",
    },
  ]);

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: "",
    type: "",
    file: null,
  });

  const documentTypes = [
    "Contract",
    "Application",
    "Insurance",
    "Photos",
    "Receipts",
    "Other",
  ];

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <PdfIcon color="error" />;
      case "image":
        return <ImageIcon color="primary" />;
      default:
        return <FileIcon color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Completed":
        return "info";
      case "Expired":
        return "error";
      default:
        return "default";
    }
  };

  const handleUploadDocument = () => {
    if (!uploadData.name || !uploadData.type) {
      alert("Please fill in all required fields");
      return;
    }

    const newDocument = {
      id: documents.length + 1,
      name: uploadData.name,
      type: uploadData.type,
      size: uploadData.file ? `${(uploadData.file.size / (1024 * 1024)).toFixed(2)} MB` : "Unknown",
      uploadDate: new Date().toISOString().split('T')[0],
      status: "Active",
      fileType: uploadData.file ? uploadData.file.type.split('/')[1] : "unknown"
    };

    setDocuments(prev => [...prev, newDocument]);
    setOpenUploadDialog(false);
    setUploadData({ name: "", type: "", file: null });
  };

  const handleDownload = (document) => {
    // Handle document download
    console.log("Downloading:", document.name);
  };

  const handleView = (document) => {
    // Handle document view
    console.log("Viewing:", document.name);
  };

  const handleDelete = (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Documents
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your rental documents and files
      </Typography>

      {/* Document Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DocumentIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {documents.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Documents
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PdfIcon color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="error">
                    {documents.filter(d => d.fileType === "pdf").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PDF Files
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ImageIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {documents.filter(d => d.fileType === "image").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Images
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FileIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    {documents.filter(d => d.status === "Active").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Documents
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Documents Table */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">
            My Documents
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setOpenUploadDialog(true)}
          >
            Upload Document
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getFileIcon(document.fileType)}
                      <Typography sx={{ ml: 1 }}>
                        {document.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.size}</TableCell>
                  <TableCell>{document.uploadDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={document.status}
                      color={getStatusColor(document.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => handleView(document)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(document)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(document.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Upload Document Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Document Name"
                value={uploadData.name}
                onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Document Type"
                value={uploadData.type}
                onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                {documentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadIcon />}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  onChange={(e) => setUploadData(prev => ({ ...prev, file: e.target.files[0] }))}
                />
              </Button>
              {uploadData.file && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Selected: {uploadData.file.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Supported formats: PDF, JPG, PNG, DOC, DOCX. Maximum file size: 10MB
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUploadDocument}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage;