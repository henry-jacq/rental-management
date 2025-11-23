import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Grid,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validation
    if (!email || !email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validation
    if (!otp || !otp.trim()) {
      setError("OTP is required");
      setLoading(false);
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validation
    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }
    if (!confirmPassword) {
      setError("Please confirm your password");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password-otp", {
        email,
        otp,
        password,
      });
      
      // Auto login - Save token
      localStorage.setItem("token", res.data.token);
      
      // Decode token to get user data
      const token = res.data.token;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decodedToken = JSON.parse(jsonPayload);

      // Update UserContext
      const userData = {
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
        initials: decodedToken.name ? decodedToken.name.split(' ').map(n => n[0]).join('').toUpperCase() : ""
      };
      updateUser(userData);
      
      setMessage("Password reset successful! Logging you in...");
      
      setTimeout(() => {
        if (res.data.role === "tenant") navigate("/tenant");
        else if (res.data.role === "landlord") navigate("/landlord");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Enter Email", "Verify OTP", "Reset Password"];

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
        <Paper elevation={10} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Reset Password
            </Typography>
          </Box>


          {message && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <Box component="form" onSubmit={handleSendOTP}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Enter your email to receive OTP
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </Box>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <Box component="form" onSubmit={handleVerifyOTP}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Enter the 6-digit OTP sent to {email}
              </Typography>
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                fullWidth
                variant="text"
                size="small"
                onClick={() => setStep(1)}
                sx={{ mt: 1 }}
              >
                Resend OTP
              </Button>
            </Box>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <Box component="form" onSubmit={handleResetPassword}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Enter your new password
              </Typography>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Submit"}
              </Button>
            </Box>
          )}

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            Remember your password?{" "}
            <Link to="/" style={{ color: "#667eea", textDecoration: "none" }}>
              Login here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
