import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreditPurchase from "./pages/CreditPurchase";
import Agents from "./pages/Agents";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with backend
      setAuth(true);
    }
    setLoading(false);
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>; // Or a loading spinner
    }
    return auth ? children : <Navigate to="/login" replace />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/signup" element={<Signup setAuth={setAuth} />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home setAuth={setAuth} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase-credits"
          element={
            <ProtectedRoute>
              <CreditPurchase />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <Agents />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;