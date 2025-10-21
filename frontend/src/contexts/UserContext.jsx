import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const decodedToken = decodeToken(token);
        if (!decodedToken) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        // Fetch complete user profile from API
        try {
          const response = await fetch("http://localhost:5000/api/dashboard/profile", {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const profileData = await response.json();
            setUser(profileData);
          } else {
            // Fallback to token data if API fails
            const userData = {
              id: decodedToken.id,
              name: decodedToken.name,
              email: decodedToken.email,
              role: decodedToken.role,
              initials: decodedToken.name ? decodedToken.name.split(' ').map(n => n[0]).join('').toUpperCase() : ""
            };
            setUser(userData);
          }
        } catch (apiError) {
          console.error("Error fetching user profile:", apiError);
          // Fallback to token data
          const userData = {
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role,
            initials: decodedToken.name ? decodedToken.name.split(' ').map(n => n[0]).join('').toUpperCase() : ""
          };
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user from token:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;