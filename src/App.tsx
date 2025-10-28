import React from "react";
import AddCapability from "./pages/admin/AddCapability";
import AdminRegister from "./pages/admin/AdminRegister";
import Login from "./pages/auth/Login";
import SelectCompany from "./pages/auth/SelectCompany";
import AddUser from "./pages/admin/AddUser";
import AddFeature from "./pages/admin/AddFeature";
import RoleMapping from "./pages/admin/RoleMapping";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const theme = createTheme();

function getSlugsFromPathname(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return { company: parts[0], app: parts[1] };
  }
  return { company: null, app: null } as any;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { company, app } = getSlugsFromPathname(location.pathname);

  if (!isAuthenticated) {
    const redirectTo =
      company && app ? `/${company}/${app}/login` : `/`;
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes with slugs */}
            <Route path="/:company/:app/login" element={<Login />} />
            <Route
              path="/:company/:app/admin/register"
              element={<AdminRegister />}
            />

            {/* Protected admin routes with slugs */}
            <Route
              path="/:company/:app/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/:company/:app/admin/dashboard/capabilities-add" element={<AddCapability />} />
              <Route path="/:company/:app/admin/dashboard/add-feature" element={<AddFeature />} />
              <Route path="/:company/:app/admin/dashboard/add-user" element={<AddUser />} />
              <Route path="/:company/:app/admin/dashboard/roles-mapping" element={<RoleMapping />} />
            </Route>

            {/* Company/App Selection */}
            <Route path="/select-company" element={<SelectCompany />} />

            {/* Root redirect to company selection */}
            <Route
              path="/"
              element={<Navigate to="/select-company" replace />}
            />

            {/* 404 catch-all */}
            {/* <Route
              path="*"
              element={
                <div style={{ padding: "2rem" }}>
                  <h1>404 - Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </div>
              }
            /> */}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
