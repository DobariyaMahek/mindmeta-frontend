import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

export default function AddFamilyMember({ open, onClose }) {
  const initialValues = {
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    relation: "",
    otherRelation: "",
    gender: "female",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required!"),
    dob: Yup.date().required("Date of Birth is required!"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required!"),
    relation: Yup.string().required("Relation is required!"),
    otherRelation: Yup.string().when("relation", {
      is: "Other",
      then: Yup.string().required("Please specify the relation"),
    }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Form Data:", values); // Replace with actual submit logic
      resetForm();
      onClose();
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = formik;

  const handleRelationChange = (event) => {
    const selectedValue = event.target.value;
    setFieldValue("relation", selectedValue);
    if (selectedValue !== "Other") {
      setFieldValue("otherRelation", ""); // Clear otherRelation if not "Other"
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add Family Member
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                name="relation"
                variant="outlined"
                label="Relation"
                onChange={handleRelationChange}
                value={values.relation}
                helperText={touched.relation && errors.relation}
                error={Boolean(touched.relation && errors.relation)}
                InputLabelProps={{
                  shrink: true, // Ensures label stays visible above the field
                }}
                SelectProps={{
                  native: true,
                  IconComponent: KeyboardArrowDown,
                }}
              >
                <option value="" disabled></option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sibling">Sibling</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Spouse">Spouse</option>
                <option value="Other">Other</option>
              </TextField>
            </Grid>

            {values.relation === "Other" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="otherRelation"
                  label="Specify Relation"
                  value={values.otherRelation}
                  onChange={handleChange}
                  helperText={touched.otherRelation && errors.otherRelation}
                  error={Boolean(touched.otherRelation && errors.otherRelation)}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                value={values.firstName}
                onChange={handleChange}
                helperText={touched.firstName && errors.firstName}
                error={Boolean(touched.firstName && errors.firstName)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="dob"
                type="date"
                label="Date of Birth"
                InputLabelProps={{
                  shrink: true,
                }}
                value={values.dob}
                onChange={handleChange}
                helperText={touched.dob && errors.dob}
                error={Boolean(touched.dob && errors.dob)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                value={values.email}
                onChange={handleChange}
                helperText={touched.email && errors.email}
                error={Boolean(touched.email && errors.email)}
              />
            </Grid>

            <Grid item xs={12}>
              <RadioGroup
                row
                name="gender"
                value={values.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
