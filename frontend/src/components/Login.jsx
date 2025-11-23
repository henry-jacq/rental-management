import { useState, memo } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const Login = memo(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser, reloadUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validation
    if (!email || !email.trim()) {
      setMessage("Email is required");
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Invalid email format");
      setLoading(false);
      return;
    }
    if (!password) {
      setMessage("Password is required");
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, role } = res.data;
      localStorage.setItem("token", token);

      // Decode token to get user data
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decodedToken = JSON.parse(jsonPayload);

      // Update UserContext with basic data first (for immediate navigation)
      const userData = {
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
        initials: decodedToken.name ? decodedToken.name.split(' ').map(n => n[0]).join('').toUpperCase() : ""
      };
      updateUser(userData);

      // Navigate to appropriate dashboard
      if(role === "tenant") navigate("/tenant");
      else if(role === "landlord") navigate("/landlord");

      // Reload complete user profile in the background
      setTimeout(() => reloadUser(), 100);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your account
          </Typography>

          {message && (
            <Alert severity="error" sx={{ mt: 2, mb: 4 }}>
              {message}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <Grid spacing={2}>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 2, mb: 2 }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#667eea", textDecoration: "none" }}>
              Register here
            </Link>
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link to="/forgot-password" style={{ color: "#667eea", textDecoration: "none" }}>
              Forgot Password?
            </Link>
          </Typography>

        </Paper>
      </Container>
    </Box>
  );
});

export default Login;
