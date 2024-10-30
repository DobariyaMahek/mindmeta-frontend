import React, { useState, useRef } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import curved6 from "assets/images/curved-images/curved14.jpg";
import toast from "react-hot-toast";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Grid, Icon } from "@mui/material";
import { validatePassword } from "helper/constant";
import { ResetPassword as resetPasswordAction } from "../../../redux/ApiSlice/authSlice";
import { SOMETHING_WRONG } from "helper/constant";

function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forgotPasswordInfo = JSON.parse(localStorage.getItem("forgotPasswordEmail"));

  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  const validateForm = (field, value) => {
    let error = {};
    switch (field) {
      case "newPassword":
        if (!value?.trim()) {
          error.newPassword = "Password is required";
        } else if (validatePassword(value)) {
          error.newPassword = validatePassword(value);
        } else {
          error.newPassword = "";
        }
        break;
      case "confirmPassword":
        if (!value?.trim()) {
          error.confirmPassword = "Confirm password is required";
        } else if (validatePassword(value)) {
          error.confirmPassword = validatePassword(value);
        } else if (formData.newPassword && value !== formData.newPassword) {
          error.confirmPassword = "Passwords don't match";
        } else {
          error.confirmPassword = "";
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...error,
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value?.trimStart(),
    }));
    validateForm(name, value);
  };

  const handleSubmit = async () => {
    validateForm("newPassword", formData.newPassword);
    validateForm("confirmPassword", formData.confirmPassword);
    if (
      !errors.newPassword &&
      !errors.confirmPassword &&
      formData.newPassword &&
      formData.confirmPassword
    ) {
      const response = await dispatch(
        resetPasswordAction({
          email: forgotPasswordInfo?.email,
          new_password: formData.newPassword,
        })
      );
      const resPayload = response?.payload;
      if (resPayload?.status === "success") {
        toast.success(resPayload.message);
        navigate("/authentication/sign-in");
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
        localStorage.clear()
        setErrors({});
      } else {
        toast.error(!Array.isArray(resPayload?.detail) ? resPayload?.detail : SOMETHING_WRONG);
      }
    }
  };

  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateForm(fieldName, formData[fieldName]);
      if (!errors[fieldName]) {
        if (fieldName === "newPassword") {
          confirmPasswordRef.current.focus();
        } else if (fieldName === "confirmPassword") {
          handleSubmit();
        }
      }
    }
  };

  return (
    <BasicLayout
      title="Reset Password"
      description="We'll send you an email to reset your password"
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Reset Password
          </SoftTypography>
        </SoftBox>
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            <SoftBox mb={2}>
              <label>New Password</label>
              <SoftInput
                fullWidth
                name="newPassword"
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                variant="outlined"
                value={formData.newPassword}
                onChange={handleChange}
                error={!!errors?.newPassword}
                onKeyDown={(e) => handleKeyDown(e, "newPassword")}
                inputRef={newPasswordRef}
                endAdornment={
                  <Icon
                    aria-label="toggle new password visibility"
                    onClick={toggleNewPasswordVisibility}
                    edge="end"
                    sx={{
                      position: "absolute",
                      right: errors?.newPassword ? "33px" : "10px",
                      cursor: "pointer",
                    }}
                  >
                    {showNewPassword ? <Visibility size="10px" /> : <VisibilityOff size="10px" />}
                  </Icon>
                }
              />
              <span className="error"> {errors?.newPassword}</span>
              <label style={{ marginTop: "10px" }}>Confirm Password</label>
              <SoftInput
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors?.confirmPassword}
                onKeyDown={(e) => handleKeyDown(e, "confirmPassword")}
                inputRef={confirmPasswordRef}
                endAdornment={
                  <Icon
                    aria-label="toggle confirm password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    sx={{
                      position: "absolute",
                      right: errors?.confirmPassword ? "33px" : "10px",
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmPassword ? (
                      <Visibility size="10px" />
                    ) : (
                      <VisibilityOff size="10px" />
                    )}
                  </Icon>
                }
              />
              <span className="error">{errors?.confirmPassword}</span>
            </SoftBox>

            <SoftBox mb={1} mt={4}>
              <SoftButton variant="gradient" color="primary" fullWidth onClick={handleSubmit}>
                Reset Password
              </SoftButton>
            </SoftBox>
            <SoftBox display="flex" alignItems="center" justifyContent="center">
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={() => navigate("/authentication/sign-in")}
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                <strong
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowBack /> &nbsp; Back to Sign In
                </strong>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default ResetPassword;
