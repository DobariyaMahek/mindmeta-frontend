import React, { useState, useCallback } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import curved6 from "assets/images/curved-images/curved14.jpg";
import toast from "react-hot-toast";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SendOTP } from "../../../redux/ApiSlice/authSlice";
import { useDispatch } from "react-redux";
import { EMAIL_REGEX } from "helper/constant";
import { SOMETHING_WRONG } from "helper/constant";

const validateEmail = (email) => {
  if (!email?.trim()) {
    return "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email";
  }
  return "";
};

function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value?.trim()?.toLowerCase();
    setEmail(value);
    setError(validateEmail(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateEmail(email?.trim()?.toLowerCase());
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await dispatch(SendOTP({ email: email.trim() }));
      if (
        res?.payload?.status === "success" ||
        res?.payload?.detail == "OTP has been sent to your email."
      ) {
        localStorage.setItem(
          "forgotPasswordEmail",
          JSON.stringify({
            email: email.trim(),
            time:
              res?.payload?.detail !== "OTP has been sent to your email."
                ? new Date()
                : JSON.parse(localStorage.getItem("forgotPasswordEmail"))?.time || new Date(),
          })
        );
        toast.success(
          res?.payload?.detail && !Array.isArray(res?.payload?.detail)
            ? res?.payload?.detail
            : res?.payload?.message
            ? res?.payload?.message
            : SOMETHING_WRONG
        );
        navigate("/authentication/verify-otp");
      } else {
        toast.error(
          res?.payload?.detail && !Array.isArray(res?.payload?.detail)
            ? res?.payload?.detail
            : res?.payload?.message
            ? res?.payload?.message
            : SOMETHING_WRONG
        );
      }
    } catch (error) {
      toast.error(SOMETHING_WRONG);
    }
  };
  return (
    <BasicLayout
      title="Forgot Password?"
      description="We'll send you an email to reset your password."
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Forgot Password
          </SoftTypography>
        </SoftBox>
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            <SoftBox mb={2}>
              <label>Email</label>
              <SoftInput
                placeholder="Enter email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                error={!!error}
                onKeyDown={(e) => {
                  if (e?.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              />{" "}
              <span className="error">{error && error}</span>
            </SoftBox>

            <SoftBox mb={1} mt={4}>
              <SoftButton variant="gradient" color="primary" fullWidth onClick={handleSubmit}>
                Send
              </SoftButton>
            </SoftBox>
            <SoftBox display="flex" alignItems="center" justifyContent="center">
              <SoftTypography
                variant="button"
                fontWeight="bold"
                onClick={() => navigate("/authentication/sign-in")}
                userSelect="none"
                textAlign="center"
                marginTop="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ cursor: "pointer" }}
              >
                <ArrowBack /> &nbsp; Back to Sign In
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default ForgotPassword;
