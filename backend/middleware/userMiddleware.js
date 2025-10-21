import User from "../models/User.js";

export const attachUserData = async (req, res, next) => {
  try {
    // Only proceed if user is authenticated (req.user exists from auth middleware)
    if (!req.user || !req.user.id) {
      return next();
    }

    // Fetch complete user data from database
    const userData = await User.findById(req.user.id)
      .select('-password') // Exclude password field
      .populate('propertiesOwned', 'name address') // Populate landlord properties
      .populate('propertyRented', 'name address') // Populate tenant property
      .lean(); // Convert to plain object for better performance

    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Attach complete user data to request object
    req.userData = {
      ...userData,
      initials: userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : ""
    };

    next();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ msg: "Error fetching user data" });
  }
};