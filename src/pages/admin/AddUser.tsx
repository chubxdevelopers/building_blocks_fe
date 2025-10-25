import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "../../utils/axiosConfig";

interface Company {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  company: yup.string().required("Company is required"),
  role: yup.string().required("Role is required"),
  team: yup.string().required("Team is required"),
});

export default function AddUser() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [companiesRes, teamsRes, rolesRes] = await Promise.all([
          api.get<Company[]>("/admin/companies"),
          api.get<Team[]>("/admin/teams"),
          api.get<Role[]>("/admin/roles"),
        ]);
        setCompanies(companiesRes.data);
        setTeams(teamsRes.data);
        setRoles(rolesRes.data);
      } catch (err: any) {
        setError(
          "Failed to load companies, teams, or roles. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      company: "",
      role: "",
      team: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: {
      name: string;
      email: string;
      password: string;
      company: string;
      role: string;
      team: string;
    }) => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const response = await api.post("/admin/add-user", values);
        if (response.data) {
          setSuccess("User added successfully!");
          formik.resetForm();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to add user");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Typography component="h1" variant="h5" gutterBottom>
        Add New User
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={loading}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="company-label">Company</InputLabel>
            <Select
              labelId="company-label"
              id="company"
              name="company"
              value={formik.values.company}
              label="Company"
              onChange={formik.handleChange}
              error={formik.touched.company && Boolean(formik.errors.company)}
              disabled={loading}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.name}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            id="email"
            name="email"
            label="Email Address"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
          />
          <TextField
            fullWidth
            margin="normal"
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formik.values.role}
              label="Role"
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              disabled={loading}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="team-label">Team</InputLabel>
            <Select
              labelId="team-label"
              id="team"
              name="team"
              value={formik.values.team}
              label="Team"
              onChange={formik.handleChange}
              error={formik.touched.team && Boolean(formik.errors.team)}
              disabled={loading}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.name}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add User"
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
