import React, { useState, useEffect } from "react";
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
import { SendOTP, VerifyForgotPasswordOTP } from "../../../redux/ApiSlice/authSlice";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import { SOMETHING_WRONG } from "helper/constant";

function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forgotPasswordInfo = JSON.parse(localStorage.getItem("forgotPasswordEmail"));

  useEffect(() => {
    const otpSentTime = new Date(forgotPasswordInfo?.time);
    const currentTime = new Date();
    const timeDiff = Math.floor((currentTime - otpSentTime) / 1000); // difference in seconds
    const remainingTime = 300 - timeDiff; // 5 minutes (300 seconds) minus the time elapsed

    if (remainingTime > 0) {
      setTimeLeft(remainingTime);
    } else {
      setIsVisible(true);
      setTimeLeft(0);
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timerInterval);
          setIsVisible(true);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [forgotPasswordInfo]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const validateOtp = (otpArray) => {
    const otpValue = otpArray.join("");
    if (!otpValue?.length) {
      setError("OTP is required");
      return false;
    } else if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return false;
    }
    setError("");
    return true;
  };

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
    validateOtp(newOtp);
  };

  const changeCodeAtFocus = (str) => {
    const updatedOTPValues = [...otp];
    updatedOTPValues[activeInput] = str[0] || "";
    setOtp(updatedOTPValues);
    handleOtpChange(updatedOTPValues);
  };

  const focusInput = (inputIndex) => {
    const selectedIndex = Math.max(Math.min(5, inputIndex), 0);
    setActiveInput(selectedIndex);
    document.getElementById(`otp-input-${selectedIndex}`).focus();
  };

  const handleOnChange = (e) => {
    const val = e.target.value;
    if (/^\d$/.test(val)) {
      changeCodeAtFocus(val);
      focusInput(activeInput + 1);
    }
  };

  const handleOnKeyDown = (e) => {
    const pressedKey = e.key;

    switch (pressedKey) {
      case "Backspace":
      case "Delete": {
        e.preventDefault();
        if (otp[activeInput]) {
          changeCodeAtFocus("");
        } else {
          focusInput(activeInput - 1);
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        focusInput(activeInput - 1);
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        focusInput(activeInput + 1);
        break;
      }
      case "Enter": {
        e.preventDefault();
        handleSubmit();
        break;
      }
      default: {
        if (pressedKey.match(/^[^a-zA-Z0-9]$/)) {
          e.preventDefault();
        }
        break;
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, 6 - activeInput)
      .split("");
    if (pastedData) {
      const updatedOTPValues = [...otp];
      pastedData.forEach((char, index) => {
        updatedOTPValues[activeInput + index] = char;
      });
      setOtp(updatedOTPValues);
      handleOtpChange(updatedOTPValues);

      const lastFilledInput = Math.min(activeInput + pastedData.length - 1, 5);
      setActiveInput(lastFilledInput);
      focusInput(lastFilledInput + 1);
    }
  };
  const resendOtp = async () => {
    const res = await dispatch(SendOTP({ email: forgotPasswordInfo?.email?.trim() }));
    if (
      res?.payload?.status === "success" ||
      res?.payload?.detail == "An OTP was already sent. Please check your email."
    ) {
      localStorage.setItem(
        "forgotPasswordEmail",
        JSON.stringify({
          email: forgotPasswordInfo?.email.trim(),
          time:
            res?.payload?.detail !== "An OTP was already sent. Please check your email."
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
      setIsVisible(false); // Hide "Resend OTP" and start timer again
      setTimeLeft(300); // Reset timer to 5 minutes
    } else {
      toast.error(
        res?.payload?.detail && !Array.isArray(res?.payload?.detail)
          ? res?.payload?.detail
          : res?.payload?.message
          ? res?.payload?.message
          : SOMETHING_WRONG
      );
    }
  };

  const handleSubmit = () => {
    if (validateOtp(otp)) {
      dispatch(
        VerifyForgotPasswordOTP({ email: forgotPasswordInfo?.email, otp_code: otp.join("") })
      ).then((res) => {
        if (res?.payload?.status === "success") {
          toast.success(res?.payload?.msg);
          setOtp(new Array(6).fill(""));
          focusInput(0);
          navigate("/authentication/reset-password");
        } else {
          setOtp(new Array(6).fill(""));
          focusInput(0);
          toast.error(
            res?.payload?.detail && !Array.isArray(res?.payload?.detail)
              ? res?.payload?.detail
              : res?.payload?.message
              ? res?.payload?.message
              : SOMETHING_WRONG
          );
        }
      });
    }
  };

  return (
    <BasicLayout
      title="Verify OTP"
      description="Please enter the OTP that was sent to your email. Once the OTP is verified, you will be able to change your password."
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Verify OTP
          </SoftTypography>
        </SoftBox>
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            <SoftBox mb={2}>
              <label>Enter OTP</label>
              <Grid container spacing={2} justifyContent="center" mb={1}>
                {otp.map((value, index) => (
                  <Grid item key={index} xs={2}>
                    <SoftInput
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center" },
                        id: `otp-input-${index}`,
                        onPaste: handlePaste,
                      }}
                      type={"text"}
                      value={value}
                      onChange={handleOnChange}
                      onKeyDown={(e) => handleOnKeyDown(e, index)}
                      onFocus={() => setActiveInput(index)}
                      error={!value && error}
                    />
                  </Grid>
                ))}
              </Grid>
              <span className="error"> {error && error}</span>
              <SoftBox
                sx={{
                  userSelect: "none",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                {formatTime(timeLeft) && formatTime(timeLeft) !== "00:00" && !isVisible ? (
                  <SoftTypography variant="h6"> {formatTime(timeLeft)}</SoftTypography>
                ) : isVisible ? (
                  <SoftTypography
                    variant="h6"
                    onClick={resendOtp}
                    mt={3}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    Resend OTP
                  </SoftTypography>
                ) : null}
              </SoftBox>
            </SoftBox>

            <SoftBox mb={1} mt={2}>
              <SoftButton variant="gradient" color="primary" fullWidth onClick={handleSubmit}>
                Verify OTP
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

export default VerifyOTP;
