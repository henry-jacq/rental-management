import express from "express";
import { requireRole } from "../middleware/auth.js";
import Agreement from "../models/Agreement.js";
import {
  uploadAgreementDocuments,
  processUploadedFiles,
  handleUploadError,
  cleanupOnError,
  deleteFile,
  fileExists,
  getFileStats
} from "../middleware/agreementUpload.js";

import fs from "fs";

const router = express.Router();

router.get("/", requireRole(["landlord"]), async (req, res) => {
  try {
    console.log("Fetching agreements for landlord:", req.userData._id);
    
    const { search, status, property, tenant, page = 1, limit = 20, sort = 'createdAt' } = req.query;

    const filters = {};
    if (search) filters.search = search;
    if (status) filters.status = status;
    if (property) filters.property = property;
    if (tenant) filters.tenant = tenant;
    
    console.log("Applied filters:", filters);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = Agreement.findByLandlord(req.userData._id, filters);
    
    const sortOptions = {};
    switch (sort) {
      case 'title':
        sortOptions.title = 1;
        break;
      case 'status':
        sortOptions.status = 1;
        break;
      case 'updatedAt':
        sortOptions.updatedAt = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }
    
    query = query.sort(sortOptions);
    
    const baseQuery = { landlord: req.userData._id };
    if (filters.status) baseQuery.status = filters.status;
    if (filters.property) baseQuery.property = filters.property;
    if (filters.tenant) baseQuery.tenant = filters.tenant;
    if (filters.search) baseQuery.$text = { $search: filters.search };
    
    const total = await Agreement.countDocuments(baseQuery);
    
    const agreements = await query.skip(skip).limit(parseInt(limit));
    
    console.log("Found agreements:", agreements.length);
    
    res.json({
      agreements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching agreements:", error);
    res.status(500).json({ 
      error: "Failed to fetch agreements",
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get("/stats/summary", requireRole(["landlord"]), async (req, res) => {
  try {
    const landlordId = req.userData._id;
    
    const stats = await Agreement.aggregate([
      { $match: { landlord: landlordId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
          draft: { $sum: { $cond: [{ $eq: ["$status", "Draft"] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ["$status", "Expired"] }, 1, 0] } },
          terminated: { $sum: { $cond: [{ $eq: ["$status", "Terminated"] }, 1, 0] } }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      active: 0,
      draft: 0,
      expired: 0,
      terminated: 0
    };

    const recentAgreements = await Agreement.find({ landlord: landlordId })
      .populate('property', 'title')
      .populate('tenant', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt property tenant');

    res.json({
      stats: result,
      recentAgreements
    });
  } catch (error) {
    console.error("Error fetching agreement stats:", error);
    res.status(500).json({ 
      error: "Failed to fetch agreement statistics",
      message: error.message 
    });
  }
});

router.get("/:id", requireRole(["landlord"]), async (req, res) => {
  try {
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      landlord: req.userData._id
    })
    .populate('property', 'title location address rent')
    .populate('tenant', 'name email phone');

    if (!agreement) {
      return res.status(404).json({ 
        error: "Agreement not found",
        message: "Agreement not found or you don't have permission to access it"
      });
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error fetching agreement:", error);
    res.status(500).json({ 
      error: "Failed to fetch agreement",
      message: error.message 
    });
  }
});

router.post("/", 
  requireRole(["landlord"]),
  cleanupOnError,
  uploadAgreementDocuments,
  handleUploadError,
  processUploadedFiles,
  async (req, res) => {
    try {
      const {
        title,
        description,
        terms,
        property,
        status = 'Draft',
        expiresAt
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          error: "Validation error",
          message: "Title is required"
        });
      }

      if (!terms || !terms.trim()) {
        return res.status(400).json({
          error: "Validation error",
          message: "Terms and conditions are required"
        });
      }

      if (property) {
        const Property = (await import("../models/Property.js")).default;
        const propertyExists = await Property.findOne({ 
          _id: property, 
          landlord: req.userData._id 
        });
        if (!propertyExists) {
          return res.status(400).json({
            error: "Validation error",
            message: "Selected property not found or you don't have permission to use it"
          });
        }
      }

      const agreement = new Agreement({
        title: title.trim(),
        description: description?.trim(),
        terms: terms.trim(),
        landlord: req.userData._id,
        property: property || null,
        tenant: null,
        status,
        documents: req.uploadedDocuments || [],
        expiresAt: expiresAt ? new Date(expiresAt) : null
      });

      const savedAgreement = await agreement.save();
      
      await savedAgreement.populate('property', 'title location address');
      await savedAgreement.populate('tenant', 'name email phone');

      res.status(201).json({
        message: "Agreement created successfully",
        agreement: savedAgreement
      });
    } catch (error) {
      console.error("Error creating agreement:", error);
      res.status(500).json({ 
        error: "Failed to create agreement",
        message: error.message 
      });
    }
  }
);

router.put("/:id",
  requireRole(["landlord"]),
  cleanupOnError,
  uploadAgreementDocuments,
  handleUploadError,
  processUploadedFiles,
  async (req, res) => {
    try {
      const agreement = await Agreement.findOne({
        _id: req.params.id,
        landlord: req.userData._id
      });

      if (!agreement) {
        return res.status(404).json({ 
          error: "Agreement not found",
          message: "Agreement not found or you don't have permission to modify it"
        });
      }

      if (!agreement.isEditable()) {
        return res.status(400).json({
          error: "Agreement not editable",
          message: "This agreement cannot be edited in its current status"
        });
      }

      const {
        title,
        description,
        terms,
        property,
        tenant,
        status,
        expiresAt,
        removeDocuments = []
      } = req.body;

      if (tenant !== undefined && tenant !== null && tenant !== "") {
        const User = (await import("../models/User.js")).default;
        const tenantExists = await User.findOne({ 
          _id: tenant, 
          role: 'tenant' 
        });
        if (!tenantExists) {
          return res.status(400).json({
            error: "Validation error",
            message: "Selected tenant not found"
          });
        }
      }

      if (title !== undefined) agreement.title = title.trim();
      if (description !== undefined) agreement.description = description?.trim();
      if (terms !== undefined) agreement.terms = terms.trim();
      if (property !== undefined) agreement.property = property || null;
      if (tenant !== undefined) agreement.tenant = tenant || null;
      if (status !== undefined) agreement.status = status;
      if (expiresAt !== undefined) agreement.expiresAt = expiresAt ? new Date(expiresAt) : null;

      let documentsToRemoveArray = [];
      if (removeDocuments) {
        try {
          documentsToRemoveArray = typeof removeDocuments === 'string' 
            ? JSON.parse(removeDocuments) 
            : removeDocuments;
        } catch (error) {
          console.error("Error parsing removeDocuments:", error);
          documentsToRemoveArray = [];
        }
      }

      if (documentsToRemoveArray.length > 0) {
        documentsToRemoveArray.forEach(docId => {
          const document = agreement.documents.id(docId);
          if (document) {
            try {
              deleteFile(document.path);
            } catch (error) {
              console.error("Error deleting file:", error);
            }
            document.remove();
          }
        });
      }

      if (req.uploadedDocuments && req.uploadedDocuments.length > 0) {
        agreement.documents.push(...req.uploadedDocuments);
      }

      const updatedAgreement = await agreement.save();
      
      await updatedAgreement.populate('property', 'title location address');
      await updatedAgreement.populate('tenant', 'name email phone');

      res.json({
        message: "Agreement updated successfully",
        agreement: updatedAgreement
      });
    } catch (error) {
      console.error("Error updating agreement:", error);
      res.status(500).json({ 
        error: "Failed to update agreement",
        message: error.message 
      });
    }
  }
);

router.delete("/:id", requireRole(["landlord"]), async (req, res) => {
  try {
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      landlord: req.userData._id
    });

    if (!agreement) {
      return res.status(404).json({ 
        error: "Agreement not found",
        message: "Agreement not found or you don't have permission to delete it"
      });
    }

    if (agreement.documents && agreement.documents.length > 0) {
      agreement.documents.forEach(document => {
        if (document.path && fileExists(document.path)) {
          deleteFile(document.path);
        }
      });
    }

    await Agreement.findByIdAndDelete(req.params.id);

    res.json({
      message: "Agreement deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting agreement:", error);
    res.status(500).json({ 
      error: "Failed to delete agreement",
      message: error.message 
    });
  }
});


router.get("/:id/download/:documentId", requireRole(["landlord"]), async (req, res) => {
  try {
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      landlord: req.userData._id
    });

    if (!agreement) {
      return res.status(404).json({ 
        error: "Agreement not found",
        message: "Agreement not found or you don't have permission to access it"
      });
    }

    const document = agreement.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ 
        error: "Document not found",
        message: "Document not found in this agreement"
      });
    }

    const filePath = document.path;
    if (!fileExists(filePath)) {
      return res.status(404).json({ 
        error: "File not found",
        message: "The requested file no longer exists on the server"
      });
    }

    const stats = getFileStats(filePath);
    if (!stats) {
      return res.status(500).json({ 
        error: "File access error",
        message: "Unable to access the requested file"
      });
    }

    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: "File streaming error",
          message: "Error occurred while downloading the file"
        });
      }
    });

  } catch (error) {
    console.error("Error downloading document:", error);
    res.status(500).json({ 
      error: "Failed to download document",
      message: error.message 
    });
  }
});



export default router;