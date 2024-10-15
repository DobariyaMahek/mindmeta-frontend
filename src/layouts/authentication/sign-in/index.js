import React, { useState, useCallback, useRef } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import curved6 from "assets/images/curved-images/curved14.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../../../redux/ApiSlice/authSlice";
import toast from "react-hot-toast";
import { EMAIL_REGEX } from "helper/constant";
import { Icon } from "@mui/material";
import { PASSWORD_VALIDATION_MESSAGES } from "helper/constant";
import { validatePassword } from "helper/constant";
import { SOMETHING_WRONG } from "helper/constant";
import { SUCCESSFULLY_LOGIN } from "helper/constant";

const validateField = (name, value) => {
  switch (name) {
    case "name":
      return !value?.trim() ? "User name is required" : "";
    case "email":
      return !value?.trim()
        ? "Email is required"
        : !EMAIL_REGEX.test(value?.trim()?.toLowerCase())
        ? "Please enter a valid email"
        : "";
    case "password":
      return !value?.trim() ? "Password is required" :''
        // validatePassword(value);
    default:
      return "";
  }
};

const validateForm = (form) => {
  return {
    name: validateField("name", form.name),
    email: validateField("email", form.email),
    password: validateField("password", form.password),
  };
};

function Index() {
  document.title = "Mind Meta AI | SignIn";
  const { authLoader } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]:
          name === "email"
            ? value?.trim()?.toLowerCase()
            : name === "password"
            ? value?.trim()
            : value?.trimStart(),
      }));

      // Update validation for the specific field
      setError((prevError) => ({
        ...prevError,
        [name]: validateField(name, value),
      }));
    },
    [setForm, setError]
  );

  const handleSubmit = useCallback(() => {
    const errors = validateForm(form);
    setError(errors);
    if (authLoader) {
      return;
    }

    const firstInvalidField = Object.keys(errors).find((key) => errors[key] !== "");

    if (firstInvalidField) {
      if (firstInvalidField === "name") nameRef.current.focus();
      if (firstInvalidField === "email") emailRef.current.focus();
      if (firstInvalidField === "password") passwordRef.current.focus();
    } else {
      const { name, email, password } = form;
      dispatch(
        logIn({
          name: name?.trim(),
          email: email?.trim(),
          password: password?.trim(),
        })
      ).then((res) => {
        if (res?.payload?.success) {
          toast.success(SUCCESSFULLY_LOGIN);
          localStorage.setItem("authUser", JSON.stringify({ ...res?.payload?.data }));
          navigate("/dashboard");
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
    }
  }, [form, dispatch, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <BasicLayout
      title="Welcome!"
      description="Securely manage your healthcare, stay informed, and connect with your care team. Log in to get started."
      image={curved6}
    >
      <Card>
        <SoftBox p={3} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Sign In
          </SoftTypography>
        </SoftBox>
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox
            component="form"
            role="form"
            onKeyDown={handleKeyDown} // Handle Enter key press
          >
            <SoftBox>
              <label>
                User Name <span>*</span>
              </label>
              <SoftInput
                placeholder="Enter user name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!error?.name}
                inputRef={nameRef} // Ref for focusing
              />
              <span className="error">{error?.name && error?.name}</span>
            </SoftBox>
            <SoftBox>
              <label>
                Email <span>*</span>
              </label>
              <SoftInput
                placeholder="Enter email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={!!error?.email}
                inputRef={emailRef} // Ref for focusing
              />
              <span className="error">{error?.email && error?.email}</span>
            </SoftBox>
            <SoftBox>
              <label>
                Password <span>*</span>
              </label>
              <SoftInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={!!error?.password}
                inputRef={passwordRef} // Ref for focusing
                endAdornment={
                  <Icon
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{
                      position: "absolute",
                      right: error?.password ? "33px" : "10px",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <Visibility size="10px" /> : <VisibilityOff size="10px" />}
                  </Icon>
                }
              />
              <span className="error">{error?.password && error?.password}</span>
            </SoftBox>

            <SoftBox display="flex" alignItems="center" justifyContent="end" mt={"10px"}>
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={() => navigate("/authentication/forgot-password")}
                sx={{ cursor: "pointer", userSelect: "none", textAlign: "end" }}
              >
                <strong>Forgot Password?</strong>
              </SoftTypography>
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth onClick={handleSubmit}>
                Sign In
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default Index;
