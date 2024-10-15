import React, { useState } from "react";
import { Button, TextField, Grid, Card } from "@mui/material";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { useSoftUIController } from "context";
import { EMAIL_REGEX } from "helper/constant";

const EditProfile = ({ profileData, onSave, onCancel }) => {
  const [controller] = useSoftUIController();
  const { sidenavColor } = controller;
  const [formData, setFormData] = useState(profileData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.email && !EMAIL_REGEX?.test(formData.email)) newErrors.email = "Email is invalid";
    // Add more validation as needed
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onSave(formData);
    }
  };

  return (
    <SoftBox mt={5} mb={3}>
      <Card>
        {" "}
        <SoftBox p={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <label>
                Name <span>* {errors.name && errors.name}</span>
              </label>
              <SoftInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                error={!!errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {" "}
              <label>
                Email <span>* {errors.email && errors.email}</span>
              </label>
              <SoftInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            {/* Add more fields as needed */}
            <Grid item xs={12}>
              <SoftButton variant="gradient" color={sidenavColor} onClick={handleSave}>
                Save
              </SoftButton>
              <SoftButton
                variant="outlined"
                color="secondary"
                onClick={onCancel}
                style={{ marginLeft: 8 }}
              >
                Cancel
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>
      </Card>
    </SoftBox>
  );
};

EditProfile.propTypes = {
  profileData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditProfile;
