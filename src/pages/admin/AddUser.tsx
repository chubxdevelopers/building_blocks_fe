import { useState } from "react";
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
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "../../utils/axiosConfig";

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
  role: yup.string().required("Role is required"),
  team: yup.string().required("Team is required"),
});

export default function AddUser() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      team: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: {
      name: string;
      email: string;
      password: string;
      role: string;
      team: string;
    }) => {
      try {
        // backend admin route expects /add-user under the admin mount
        const response = await api.post("/admin/add-user", values);
        if (response.data) {
          setSuccess("User added successfully!");
          setError("");
          formik.resetForm();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to add user");
        setSuccess("");
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
          />
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
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
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
            >
              <MenuItem value="development">Development</MenuItem>
              <MenuItem value="design">Design</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
              <MenuItem value="sales">Sales</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Add User
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
