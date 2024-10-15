import React, { useRef, useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { EMAIL_REGEX } from "helper/constant";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import { CardContent, CardHeader, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { capitalizeValue } from "helper/constant";
import { uploadPatientInfo } from "../../../redux/ApiSlice/patientSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { SOMETHING_WRONG } from "helper/constant";
import moment from "moment";

function PatientInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [generalInfo, setGeneralInfo] = useState({
    lastName: "",
    firstName: "",
    description: "",
    birthdate: "",
    email: "",
    gender: "Male",
  });
  const todays = new Date();
  const minDate = new Date(todays.getFullYear() - 150, todays.getMonth(), todays.getDate());
  const [errors, setErrors] = useState({});
  const flatpickrRef = useRef(null);
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = `${
        name == "firstName"
          ? "First name"
          : name == "lastName"
          ? "Last name"
          : name == "birthdate"
          ? "Birth date"
          : name == "email"
          ? "Email"
          : name == "description"
          ? "Description"
          : ""
      } is required`;
    } else if (name === "email" && !EMAIL_REGEX.test(value.trim().toLowerCase())) {
      error = "Email is not valid";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };
  const handleOpen = () => {
    if (flatpickrRef.current) {
      // Set the current month when reopening
      flatpickrRef.current.flatpickr.setDate(generalInfo.birthdate, false);
    }
  };
  const handleClose = () => {
    // Optionally clear the selected date when closing (or you can leave the selected date as is)
    // setSelectedDate(null);
    setGeneralInfo({
      ...generalInfo,
      birthdate: generalInfo.birthdate,
    });
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGeneralInfo((prev) => ({
      ...prev,
      [name]:
        name == "email"
          ? value?.trim()?.toLowerCase()
          : name == "birthdate"
          ? value
          : name == "firstName" || name == "lastName"
          ? capitalizeValue(value?.trimStart())
          : value?.trimStart(),
    }));
    validateField(name, value);
  };

  const validateGeneralInfo = () => {
    let isValid = true;
    Object.keys(generalInfo).forEach((key) => {
      if (!validateField(key, generalInfo[key])) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = () => {
    if (validateGeneralInfo()) {
      let body = {
        last_name: generalInfo.lastName?.trim(),
        first_name: generalInfo.firstName?.trim(),
        birthdate: moment(generalInfo?.birthdate, "DD-MM-YYYY", true).format("YYYY-MM-DD"),
        email: generalInfo.email?.trim(),
        gender: generalInfo?.gender,
        medical_history: generalInfo.description?.trim(),
      };
      dispatch(uploadPatientInfo({ body })).then((res) => {
        if (res?.payload?.success) {
          setGeneralInfo({
            lastName: "",
            firstName: "",
            description: "",
            birthdate: "",
            email: "",
            gender: "Male",
          });
          setErrors({});
          toast.success("Bot train successfully!");
        } else {
          toast.error(
            res?.payload?.detail && !Array.isArray(res?.payload?.detail)
              ? res?.payload?.detail
              : res?.payload?.message
              ? res?.payload?.message
              : SOMETHING_WRONG
          );
        }
      });

      // Handle form submission logic
    }
  };

  return (
    <Grid container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<SoftTypography variant="h6">Patient Information</SoftTypography>} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <label>
                    First Name <span>*</span>
                  </label>
                  <SoftInput
                    fullWidth
                    label="First name"
                    name="firstName"
                    type="text"
                    placeholder="Please enter first name"
                    value={generalInfo.firstName}
                    onChange={handleInputChange}
                    error={Boolean(errors.firstName)}
                    style={{ textTransform: "capitalize" }}
                  />
                  <span className="error">{errors.firstName}</span>
                </Grid>
                <Grid item xs={12} md={6}>
                  <label>
                    Last Name <span>*</span>
                  </label>
                  <SoftInput
                    fullWidth
                    label="Last name"
                    name="lastName"
                    type="text"
                    placeholder="Please enter last name"
                    value={generalInfo.lastName}
                    onChange={handleInputChange}
                    error={Boolean(errors.lastName)}
                    style={{ textTransform: "capitalize" }}
                  />
                  <span className="error">{errors.lastName}</span>
                </Grid>
                <Grid item xs={12} md={6}>
                  <label>
                    Date of Birth <span>*</span>
                  </label>
                  <Flatpickr
                    ref={flatpickrRef}
                    name="birthdate"
                    value={generalInfo.birthdate}
                    onChange={(date) => {
                      const formatDate = (date) => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
                        const day = String(date.getDate()).padStart(2, "0");
                        return `${day}-${month}-${year}`; // Format as YYYY-MM-DD
                      };

                      handleInputChange({
                        target: {
                          name: "birthdate",
                          value: formatDate(date[0]),
                        },
                      });
                    }}
                    placeholder="Please select date of birth"
                    options={{
                      dateFormat: "d-m-Y",
                      minDate: minDate,
                      maxDate: todays,
                      onOpen: handleOpen,
                      onClose: handleClose,
                    }}
                    style={{
                      width: "100%",
                      // height: '2rem',
                      padding: " 0.75rem",
                      border: errors.birthdate ? "0.0625rem solid red" : "0.0625rem solid #d2d6da",
                      borderRadius: "0.5rem",
                      outline: "none",
                    }}
                  />
                  <span className="error">{errors.birthdate}</span>
                </Grid>
                <Grid item xs={12} md={6}>
                  <label>
                    Email <span>*</span>
                  </label>
                  <SoftInput
                    fullWidth
                    label="Email"
                    name="email"
                    placeholder="Please enter email"
                    value={generalInfo.email}
                    onChange={handleInputChange}
                    error={Boolean(errors.email)}
                  />
                  <span className="error">{errors.email}</span>
                </Grid>
                <Grid item xs={12} md={6}>
                  <label>Gender</label>
                  <RadioGroup
                    aria-label="gender"
                    name="gender"
                    value={generalInfo.gender}
                    onChange={handleInputChange}
                    sx={{
                      marginLeft: "10px",
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                    }}
                  >
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                  </RadioGroup>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card sx={{ marginTop: "20px" }}>
            <SoftBox p={3}>
              <SoftTypography variant="h6" gutterBottom>
                Medical History
              </SoftTypography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <label>
                    Description <span>*</span>
                  </label>
                  <SoftInput
                    fullWidth
                    multiline
                    rows={10}
                    error={Boolean(errors?.description)}
                    name="description"
                    placeholder="Write description here"
                    value={generalInfo.description}
                    onChange={handleInputChange}
                  />
                  <span className="error">{errors.description}</span>
                </Grid>
              </Grid>
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12} mt={2}>
        <SoftButton variant="gradient" color="info" onClick={handleSubmit}>
          Submit
        </SoftButton>
      </Grid>
    </Grid>
  );
}

export default PatientInfo;
