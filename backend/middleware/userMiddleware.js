import User from "../models/User.js";

export const attachUserData = async (req, res, next) => {
  try {
    // Only proceed if user is authenticated (req.user exists from auth middleware)
    if (!req.user || !req.user.id) {
      console.log("No user found in request, skipping user data attachment");
      return next();
    }

    console.log("Fetching user data for user ID:", req.user.id);

    // Fetch complete user data from database
    const userData = await User.findById(req.user.id)
      .select('-password') // Exclude password field
      .populate('propertiesOwned', 'name address') // Populate landlord properties
      .populate('propertyRented', 'name address') // Populate tenant property
      .lean(); // Convert to plain object for better performance

    if (!userData) {
      console.log("User not found in database:", req.user.id);
      return res.status(404).json({ msg: "User not found" });
    }

    // Attach complete user data to request object
    req.userData = {
      ...userData,
      initials: userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : ""
    };

    console.log("User data attached successfully for:", userData.name, "Role:", userData.role);
    next();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      msg: "Error fetching user data",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};