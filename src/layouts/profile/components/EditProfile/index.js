import React, { useState } from "react";
import { Grid, Card } from "@mui/material";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSoftUIController } from "context";
import { EMAIL_REGEX } from "helper/constant";
import { CountryPhoneNumberDigit } from "helper/phonenumberdigit";
import { capitalizeValue } from "helper/constant";

const EditProfile = ({ profileData, setProfileData, onSave, onCancel }) => {
  const [controller] = useSoftUIController();
  const { sidenavColor } = controller;
  const [errors, setErrors] = useState({});

  const validateField = (name, value, countryCode) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) error = "Name is required.";
        break;
      case "address":
        if (!value) error = "Address is required.";
        break;
      case "phone":
        const selectedCountry = CountryPhoneNumberDigit?.find((item) => {
          if (item?.code?.toLowerCase() == countryCode?.toLowerCase()) {
            return item;
          }
        });
        const maxPhoneLength = selectedCountry ? selectedCountry?.phoneNumberLength : null;
        if (!value) {
          error = "Phone number is required.";
        } else if (
          maxPhoneLength &&
          value?.length <
            selectedCountry?.phoneNumberLength +
              selectedCountry?.countryCode?.replace("+", "")?.length
        ) {
          error = `Please enter a maximum of ${maxPhoneLength} digits.`;
        }
        break;
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!EMAIL_REGEX.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "administratorName":
        if (!value) error = "Administrator name is required.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handlePhoneChange = (value, country) => {
    const countryCode = country?.countryCode;
    setProfileData({ ...profileData, phone: value, countryCode: countryCode });
    setErrors((prevErrors) => ({
      ...prevErrors,
      phone: validateField("phone", value, countryCode),
    }));
  };

  const handleSave = () => {
    const validationErrors = Object.keys(profileData)?.reduce((acc, key) => {
      const countryCode = profileData?.countryCode;
      const error = validateField(key, profileData[key], countryCode);
      if (error) acc[key] = error;
      return acc;
    }, {});
    setErrors(validationErrors);
    if (Object.keys(validationErrors)?.length === 0) {
      onSave(profileData);
    }
  };

  return (
    <SoftBox mt={5} mb={3}>
      <Card>
        <SoftBox p={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <label>
                Name <span>* {errors.name && errors.name}</span>
              </label>
              <SoftInput
                label="Name"
                name="name"
                value={profileData.name}
                onChange={(e) => {
                  e.target.value = capitalizeValue(e.target.value?.trimStart());
                  handleChange(e);
                }}
                fullWidth
                placeholder="Please enter name"
                error={!!errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>
                Administrator Name{" "}
                <span>* {errors.administratorName && errors.administratorName}</span>
              </label>
              <SoftInput
                label="Administrator Name"
                name="administratorName"
                value={profileData.administratorName}
                onChange={(e) => {
                  e.target.value = capitalizeValue(e.target.value?.trimStart());
                  handleChange(e);
                }}
                fullWidth
                placeholder="Please enter administrator name"
                error={!!errors.administratorName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>
                Phone Number <span>* {errors.phone && errors.phone}</span>
              </label>
              <PhoneInput
                country={profileData?.countryCode}
                value={profileData.phone}
                onChange={handlePhoneChange}
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                containerStyle={{ width: "100%" }}
                placeholder="Please enter phone number"
                inputStyle={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>
                Email <span>* {errors.email && errors.email}</span>
              </label>
              <SoftInput
                label="Email"
                name="email"
                value={profileData.email}
                onChange={(e) => {
                  e.target.value = e.target.value?.trim()?.toLowerCase();
                  handleChange(e);
                }}
                fullWidth
                error={!!errors.email}
                placeholder="Please enter email"
                helperText={errors.email}
              />
            </Grid>{" "}
            <Grid item xs={12}>
              <label>
                Address <span>* {errors.address && errors.address}</span>
              </label>
              <SoftInput
                name="address"
                value={profileData.address}
                onChange={(e) => {
                  e.target.value = e.target.value?.trimStart();
                  handleChange(e);
                }}
                fullWidth
                error={!!errors.address}
                placeholder="Write address here..."
                multiline
                rows={4}
              />
            </Grid>
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
  setProfileData: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditProfile;
