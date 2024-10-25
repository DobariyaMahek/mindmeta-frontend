import React, { useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SoftInput from "components/SoftInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useSoftUIController } from "context";
import { EMAIL_REGEX } from "helper/constant";
import { Close, Delete, Edit } from "@mui/icons-material";
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SoftTypography from "components/SoftTypography";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  createFamilyMember,
  createPatient,
  deleteMember,
  getPatientById,
  updatePatient,
} from "../../../redux/ApiSlice/patientSlice";
import "./createPatient.css";
import {
  Box,
  FormControlLabel,
  Icon,
  Modal,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  capitalizeValue,
  CREATE_PATIENT,
  FAMILY_MEMBER_INFO,
  FAMILY_MODAL,
  GENERAL_INFO_PATIENT,
  isEmpty,
  ONE_FAMILY_REQUIRED,
  PatientTypes,
  relations,
  SOMETHING_WRONG,
  UPDATE_PATIENT,
} from "../../../helper/constant";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function CreatePatient() {
  const [controller] = useSoftUIController();
  const { sidenavColor } = controller;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [familyMemberModalOpen, setFamilyMemberModalOpen] = useState(FAMILY_MODAL);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [generalInfo, setGeneralInfo] = useState(GENERAL_INFO_PATIENT);
  const [familyInfo, setFamilyInfo] = useState([]);
  const [oldDate, setOldDate] = useState("");
  const [currentFamilyMember, setCurrentFamilyMember] = useState(FAMILY_MEMBER_INFO);
  const [medicalHistory, setMedicalHistory] = useState({ description: "" });
  const [errors, setErrors] = useState({});
  const [familyErrors, setFamilyErrors] = useState({});
  const [medicalErrors, setMedicalErrors] = useState({});
  const [deleteMemberIndex, setDeleteMemberIndex] = useState(null);
  const { id } = useParams();
  const isUpdate = pathname.startsWith("/update-patient");
  const today = new Date().toISOString().split("T")[0];
  const todays = new Date();
  const minDate = new Date(todays.getFullYear() - 150, 0, 1);
  const validateField = (fieldName, value, countryCode = "in", relation) => {
    let error = "";
    const existingEmails = [...familyInfo.map((info) => info.email?.trim().toLowerCase())];
    const patientEmails = [generalInfo.patientEmail?.trim().toLowerCase()];
    const valueDate = new Date(value);
    const todayDate = new Date();
    switch (fieldName) {
      case "firstName":
        if (!value) {
          error = `First name is required`;
        }
        break;
      case "lastName":
        if (!value) {
          error = `Last name is required`;
        }
        break;
      case "description":
      case "name":
      case "relation":
        if (!value) {
          error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        break;
      case "otherRelation":
        error = relation === "Other" && !value && "Other relation is required";
        break;
      case "birthdate":
        error = !value
          ? "Birth date is required"
          : valueDate > todayDate
          ? "Selected date cannot be in the future"
          : "";
        break;
      case "birth_date":
        error = !value
          ? "Birth date is required"
          : valueDate > todayDate
          ? "Selected date cannot be in the future"
          : "";
        break;
      case "patientEmail":
        const patientEmailTrimmed = value?.trim().toLowerCase();
        error = !patientEmailTrimmed
          ? "Email is required"
          : !EMAIL_REGEX.test(patientEmailTrimmed)
          ? "Email is not valid"
          : "";
        // existingEmails.includes(patientEmailTrimmed) && !isUpdate
        //   ? "Email already exists"
        //   :

        break;
      case "email":
        const emailTrimmed = value?.trim().toLowerCase();
        error = !emailTrimmed
          ? "Email is required"
          : !EMAIL_REGEX.test(emailTrimmed)
          ? "Email is not valid"
          : "";
        // (existingEmails.includes(emailTrimmed) || patientEmails.includes(emailTrimmed)) &&
        //     !familyMemberModalOpen?.isEdit &&
        //     familyMemberModalOpen?.isOpen
        //   ? "Email already exists"
        //   :

        break;

      default:
        break;
    }
    return error;
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, name == "birthdate" ? value : value?.trim());
    setGeneralInfo((prev) => ({
      ...prev,
      [name]:
        name == "email" || name == "patientEmail"
          ? value?.trim()?.toLowerCase()
          : name == "birthdate"
          ? value
          : name == "firstName" || name == "lastName"
          ? capitalizeValue(value?.trimStart())
          : name == "patientType"
          ? value?.value
          : value?.trimStart(),
    }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const handleMedicalHistoryChange = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value?.trim());
    setMedicalHistory((prev) => ({ ...prev, [name]: value?.trimStart() }));
    setMedicalErrors((prev) => ({ ...prev, [name]: error }));
  };
  const addFamilyMember = () => {
    setFamilyMemberModalOpen({
      isOpen: true,
      isEdit: false,
      memberInfo: {},
      memberIndex: null,
    });
    setCurrentFamilyMember(FAMILY_MEMBER_INFO);
    setFamilyErrors({});
  };
  const clearMember = () => {
    setCurrentFamilyMember(FAMILY_MEMBER_INFO);
    setFamilyErrors({});
    setFamilyMemberModalOpen(FAMILY_MODAL);
  };
  const addMember = () => {
    const updatedFamilyMember = {
      ...currentFamilyMember,
      id: familyInfo.length, // This sets the index based on the current length of the array
    };
    setFamilyInfo([...familyInfo, updatedFamilyMember]);
    clearMember();
    toast.success("Family member added successfully");
  };
  const getFamilyInfo = () => {
    dispatch(getPatientById({ id })).then((res) => {
      if (res?.payload?.success) {
        const data = res?.payload?.data;
        const family =
          data?.family_members &&
          data?.family_members?.map((item) => {
            return {
              relation: relations?.find((el) => el?.value == item?.relation)?.value || "Other",
              otherRelation: relations?.find((el) => el?.value == item?.relation)?.value
                ? ""
                : item?.relation,
              name: item?.name,
              email: item?.email,
              birth_date: item?.birth_date,
              gender: item?.gender || "Male",
              id: item?.id,
            };
          });
        setFamilyInfo(family || []);
        setFamilyErrors({});
      } else {
        toast.error(res?.payload?.message);
        navigate("/patients");
      }
    });
  };
  const saveFamilyMember = () => {
    const newFamilyErrors = {};
    Object.keys(currentFamilyMember).forEach((key) => {
      newFamilyErrors[key] = validateField(
        key,
        currentFamilyMember[key],
        currentFamilyMember.country,
        currentFamilyMember.relation
      );
    });

    setFamilyErrors(newFamilyErrors);

    const body = {
      relation:
        currentFamilyMember?.relation == "Other"
          ? currentFamilyMember?.otherRelation
          : currentFamilyMember?.relation,

      name: currentFamilyMember?.name,
      email: currentFamilyMember?.email,
      birth_date: moment(new Date(currentFamilyMember?.birth_date)).format("YYYY-MM-DD"),
      gender: currentFamilyMember?.gender,
    };
    if (!Object.values(newFamilyErrors).some((error) => error)) {
      if (isUpdate && !familyMemberModalOpen?.isEdit) {
        dispatch(createFamilyMember({ id, body })).then((res) => {
          if (res?.payload?.success) {
            toast.success(res?.payload?.message);

            getFamilyInfo();
            clearMember();
          } else {
            toast.error(res?.payload?.message);
          }
        });
      } else if (familyMemberModalOpen?.isEdit) {
        const updatedArray = familyInfo.map((item) =>
          item.id === currentFamilyMember.id ? currentFamilyMember : item
        );
        setFamilyInfo(updatedArray);
        clearMember();
        toast.success("Family member updated successfully");
      } else {
        addMember();
      }
    }
  };
  const deleteFamilyMember = () => {
    if (isUpdate) {
      dispatch(deleteMember({ memberId: deleteMemberIndex?.memberId })).then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          setDeleteConfirmation(false);
          setDeleteMemberIndex(null);
          getFamilyInfo();
        } else {
          toast.error(res?.payload?.message);
        }
      });
    } else {
      const updatedFamilyInfo = [...familyInfo];
      updatedFamilyInfo.splice(deleteMemberIndex?.index, 1);
      setFamilyInfo(updatedFamilyInfo);
      setDeleteConfirmation(false);
      toast.success("Family member deleted successfully");
      setDeleteMemberIndex(null);
    }
  };
  const handleSubmit = () => {
    const newErrors = {};
    Object.keys(generalInfo).forEach((key) => {
      newErrors[key] = validateField(key, generalInfo[key], generalInfo.country);
    });

    const newFamilyErrors = familyInfo.map((member) => {
      const memberErrors = {};
      Object.keys(member).forEach((key) => {
        if (key !== "country") {
          memberErrors[key] = validateField(key, member[key], member.country, member.relation);
        }
      });
      return memberErrors;
    });

    const newMedicalErrors = {};
    Object.keys(medicalHistory).forEach((key) => {
      newMedicalErrors[key] = validateField(key, medicalHistory[key]);
    });

    setErrors(newErrors);
    setFamilyErrors(newFamilyErrors);
    setMedicalErrors(newMedicalErrors);
    const newFamily = familyInfo?.map((item) => {
      return {
        relation: item?.relation == "Other" ? item?.otherRelation : item?.relation,
        name: item?.name,
        email: item?.email,
        gender: item?.gender,
        birth_date: moment(new Date(item?.birth_date)).format("YYYY-MM-DD"),
      };
    });

    if (
      !Object.values(newErrors).some((error) => error) &&
      !newFamilyErrors.some((memberErrors) => Object.values(memberErrors).some((error) => error)) &&
      !Object.values(newMedicalErrors).some((error) => error)
    ) {
      if (familyInfo?.length < 1) {
        return toast.error(ONE_FAMILY_REQUIRED);
      }
      let body = {
        last_name: generalInfo.lastName?.trim(),
        first_name: generalInfo.firstName?.trim(),

        email: generalInfo.patientEmail?.trim(),
        family_members: newFamily,
        gender: generalInfo?.gender,
        medical_history: medicalHistory.description?.trim(),
      };
      if (isUpdate) {
        if (oldDate != generalInfo?.birthdate) {
          body = {
            ...body,
            birthdate: moment(new Date(generalInfo?.birthdate))?.format("YYYY-MM-DD"),
          };
        }
        dispatch(updatePatient({ id, body })).then((res) => {
          if (res?.payload?.success) {
            toast.success(UPDATE_PATIENT);
            navigate("/patients");
            clearState();
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
      } else {
        body = {
          ...body,
          birthdate: moment(new Date(generalInfo?.birthdate))?.format("YYYY-MM-DD"),
        };
        dispatch(createPatient(body)).then((res) => {
          if (res?.payload?.success) {
            toast.success(CREATE_PATIENT);

            clearState();
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
    }
  };
  const clearState = () => {
    setGeneralInfo(GENERAL_INFO_PATIENT);
    setMedicalHistory({ description: "" });
    setFamilyInfo([]);
    setCurrentFamilyMember(FAMILY_MEMBER_INFO);
    setErrors({});
    setFamilyErrors({});
    setMedicalErrors({});
  };
  const getUserInfo = () => {
    dispatch(getPatientById({ id })).then((res) => {
      if (res?.payload?.success) {
        const data = res?.payload?.data;
        const family =
          data?.family_members &&
          data?.family_members?.map((item) => {
            return {
              relation: relations?.find((el) => el?.value == item?.relation)?.value || "Other",
              otherRelation: relations?.find((el) => el?.value == item?.relation)?.value
                ? ""
                : item?.relation,
              name: item?.name,
              email: item?.email,
              gender: item?.gender || "Male",
              birth_date: moment(item?.birth_date, "YYYY-MM-DD").format("YYYY/MM/DD"),
              id: item?.id,
            };
          });
        setFamilyInfo(family || []);
        setFamilyErrors({});

        setGeneralInfo((prev) => ({
          ...prev,
          lastName: data?.last_name || "",
          firstName: data?.first_name || "",
          gender: data?.gender || "Male",
          patientEmail: data?.email || "",
          birthdate: moment(data?.birthdate, "YYYY-MM-DD").format("YYYY/MM/DD"),
        }));
        setOldDate(moment(data?.birthdate, "YYYY-MM-DD").format("YYYY/MM/DD"));
        setMedicalHistory({
          description: data?.medical_history,
        });
      } else {
        toast.error(res?.payload?.message);
        navigate("/patients");
      }
    });
  };
  useEffect(() => {
    if (isUpdate) {
      getUserInfo();
    } else {
      clearState();
    }
  }, [isUpdate]);
  return (
    <DashboardLayout>
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" gutterBottom>
                  General Information
                </SoftTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <label>
                      First Name <span>* </span>
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
                    <span className="error">{errors.firstName && errors.firstName}</span>
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
                    />{" "}
                    <span className="error"> {errors.lastName && errors.lastName}</span>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <label>
                      Date of Birth <span>*</span>
                    </label>
                    <DatePicker
                      selected={generalInfo?.birthdate}
                      onChange={(date) => {
                        // Reset time to 00:00:00
                        const selectedDate = new Date(date);
                        selectedDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

                        handleInputChange({
                          target: {
                            name: "birthdate",
                            value: moment(selectedDate, "YYYY-MM-DD").format("YYYY/MM/DD"), // Use the date with the time reset
                          },
                        });
                      }}
                      placeholderText="Please select date of birth"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd-MM-yyyy"
                      minDate={minDate}
                      maxDate={new Date()} // Allow display of all years, but disable dates from the past 40 years
                      filterDate={(date) => {
                        // Disable all dates within the last 40 years
                        const cutoffDate = new Date(
                          new Date().setFullYear(new Date().getFullYear() - 40)
                        );
                        return date <= cutoffDate; // Disable dates greater than 40 years ago
                      }}
                      className={!errors.birthdate ? "input" : "input errorInput"}
                      onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
                      customInput={<input style={{ cursor: "pointer" }} />}
                    />

                    <span className="error"> {errors.birthdate && errors.birthdate}</span>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <label>
                      Email <span>*</span>
                    </label>
                    <SoftInput
                      fullWidth
                      label="Email"
                      name="patientEmail"
                      placeholder="Please enter email"
                      value={generalInfo.patientEmail}
                      onChange={handleInputChange}
                      error={Boolean(errors.patientEmail)}
                      disabled={isUpdate}
                    />
                    <span className="error"> {errors.patientEmail && errors.patientEmail}</span>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <label htmlFor={`patient-type`}>Patient Type</label>
                    <select
                      id={`patient-type`}
                      name="patientType"
                      className="relation-dropdown"
                      value={generalInfo.patientType}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {PatientTypes?.map((item) => {
                        return (
                          <option value={item} key={item?.value} style={{ cursor: "pointer" }}>
                            {item?.label}
                          </option>
                        );
                      })}
                    </select>
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
              </SoftBox>
            </Card>
            <Card sx={{ marginTop: "20px" }}>
              <SoftBox p={3}>
                <SoftTypography variant="h6" gutterBottom>
                  Medical History
                </SoftTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <label>
                      Description <span>* </span>
                    </label>
                    <SoftInput
                      fullWidth
                      multiline
                      rows={10}
                      error={Boolean(medicalErrors?.description)}
                      name="description"
                      placeholder="Write description here"
                      value={medicalHistory.description}
                      onChange={handleMedicalHistoryChange}
                    />
                    <span className="error">
                      {medicalErrors?.description && medicalErrors?.description}
                    </span>
                  </Grid>
                </Grid>
              </SoftBox>
            </Card>
            <Card sx={{ marginTop: "20px" }}>
              <SoftBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <SoftTypography variant="h6" gutterBottom>
                      Family Information
                    </SoftTypography>
                  </Grid>
                  <Grid item xs={6} textAlign="end">
                    <SoftButton variant="gradient" color={sidenavColor} onClick={addFamilyMember}>
                      Add Family Member
                    </SoftButton>
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{
                    borderTop: "0.0625rem solid #d2d6da",
                    marginTop: "10px",
                  }}
                >
                  {familyInfo?.length && Array.isArray(familyInfo) ? (
                    familyInfo?.map((member, index) => (
                      <Grid
                        item
                        xs={11}
                        sm={8}
                        md={6}
                        lg={4}
                        xl={3}
                        key={index}
                        style={{
                          position: "relative",

                          marginTop: "15px",
                        }}
                      >
                        <Box
                          sx={{
                            border: "0.0625rem solid #d2d6da",
                            borderRadius: "0.5rem",
                            padding: "10px 20px 20px 20px",
                            margin: "10px",
                            marginBottom: 0,
                          }}
                        >
                          {" "}
                          <Tooltip title="Edit member" placement="top">
                            <Icon
                              sx={{
                                cursor: "pointer",
                                position: "absolute",
                                top: 0,
                                right: 22,
                              }}
                              onClick={() => {
                                setFamilyMemberModalOpen({
                                  isOpen: true,
                                  isEdit: true,
                                  memberInfo: member,
                                  memberIndex: index,
                                });

                                setCurrentFamilyMember({
                                  relation:
                                    relations?.find(
                                      (el) =>
                                        el?.value?.toLowerCase() == member?.relation?.toLowerCase()
                                    )?.value || "Other",
                                  otherRelation: member?.otherRelation,
                                  name: member.name,
                                  email: member?.email,
                                  gender: member?.gender || "Male",
                                  birth_date: !isEmpty(member?.birth_date)
                                    ? new Date(member?.birth_date)
                                    : "",
                                  id: member?.id || index,
                                });
                              }}
                            >
                              <Edit />
                            </Icon>
                          </Tooltip>
                          <Tooltip title="Delete member" placement="top">
                            <Icon
                              sx={{
                                cursor: "pointer",
                                position: "absolute",
                                top: 0,
                                right: 0,
                              }}
                              onClick={() => {
                                setDeleteMemberIndex({ index: index, memberId: member?.id || "" });
                                setDeleteConfirmation(true);
                              }}
                            >
                              <Delete />
                            </Icon>
                          </Tooltip>
                          {/* Display family member information here */}{" "}
                          <SoftTypography
                            variant="body2"
                            color="text"
                            fontWeight="bold"
                            fontSize="13px"
                          >
                            Relation :
                            <SoftTypography variant="p" sx={{ color: "gray", Padding: "0" }}>
                              {" "}
                              {member?.relation?.toLowerCase() === "other"
                                ? member?.otherRelation
                                : member?.relation}
                            </SoftTypography>
                          </SoftTypography>
                          <SoftTypography
                            variant="body2"
                            color="text"
                            fontWeight="bold"
                            fontSize="13px"
                          >
                            Name :
                            <SoftTypography variant="p" sx={{ color: "gray", Padding: "0" }}>
                              {" "}
                              {member?.name}
                            </SoftTypography>
                          </SoftTypography>{" "}
                          <SoftTypography
                            variant="body2"
                            color="text"
                            fontWeight="bold"
                            fontSize="13px"
                          >
                            Email :
                            <SoftTypography variant="p" sx={{ color: "gray", Padding: "0" }}>
                              {" "}
                              {member?.email}
                            </SoftTypography>
                          </SoftTypography>{" "}
                          <SoftTypography
                            variant="body2"
                            color="text"
                            fontWeight="bold"
                            fontSize="13px"
                          >
                            Date of Birth :
                            <SoftTypography variant="p" sx={{ color: "gray", Padding: "0" }}>
                              {" "}
                              {!isEmpty(member?.birth_date)
                                ? moment(member?.birth_date)?.format("DD-MM-YYYY")
                                : "-"}
                            </SoftTypography>
                          </SoftTypography>{" "}
                          <SoftTypography
                            variant="body2"
                            color="text"
                            fontWeight="bold"
                            fontSize="13px"
                          >
                            Gender :
                            <SoftTypography variant="p" sx={{ color: "gray", Padding: "0" }}>
                              {" "}
                              {member?.gender}
                            </SoftTypography>
                          </SoftTypography>
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <SoftBox textAlign="center" p={4}>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          width="100%"
                        >
                          <Typography variant="h6" color="#66b5a3" style={{ fontSize: "14px" }}>
                            To proceed, ensure the inclusion of at least one family member
                          </Typography>
                        </Box>
                      </SoftBox>
                    </Grid>
                  )}
                </Grid>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={12} marginTop={"20px"} display="flex" justifyContent="start" gap="10px">
          <SoftButton variant="gradient" color={sidenavColor} onClick={handleSubmit}>
            {isUpdate ? "Update" : "Add"}
          </SoftButton>
          {!isUpdate && (
            <SoftButton
              variant="gradient"
              color={"secondary"}
              onClick={() => {
                clearState();
              }}
            >
              Clear
            </SoftButton>
          )}
        </Grid>
      </SoftBox>

      {/* Modal for Adding Family Member */}
      <Modal
        open={familyMemberModalOpen?.isOpen}
        onClose={() => {
          clearMember();
        }}
        aria-labelledby="add-family-member-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 1,
            pt: 2,
            pb: 2,
            outline: "none",
          }}
        >
          <Grid
            item
            sx={{
              borderBottom: "0.0625rem solid #d2d6da",
              paddingBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
            <SoftTypography variant="h6" gutterBottom sx={{}}>
              {familyMemberModalOpen?.isEdit ? "Edit" : "Add"} Family Member
            </SoftTypography>{" "}
            <Icon
              onClick={() => {
                clearMember();
              }}
              sx={{
                cursor: "pointer",
              }}
            >
              <Close size="10px" />
            </Icon>{" "}
          </Grid>
          <Grid container spacing={2} px={2}>
            {/* Relation Dropdown */}
            <Grid item xs={12}>
              <label>Relation</label>
              <select
                name="relation"
                className="relation-dropdown"
                value={currentFamilyMember.relation}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setCurrentFamilyMember((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                  setFamilyErrors({
                    ...familyErrors,
                    [name]: "",
                  });
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: familyErrors.relation ? "1px solid red" : "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                <option value="">Select Relation</option>
                {relations &&
                  relations?.map((item, i) => (
                    <option value={item?.value} key={i}>
                      {item?.label}
                    </option>
                  ))}
              </select>
              <span className="error">{familyErrors?.relation}</span>
            </Grid>
            {/* Other Relation Field */}
            {currentFamilyMember.relation === "Other" && (
              <Grid item xs={12}>
                <label>Other Relation</label>
                <SoftInput
                  fullWidth
                  label="Specify Relation"
                  name="otherRelation"
                  placeholder="Please enter other relation"
                  value={currentFamilyMember.otherRelation}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setCurrentFamilyMember((prev) => ({
                      ...prev,
                      [name]: capitalizeValue(value),
                    }));
                    const error = validateField(name, value);
                    setFamilyErrors({
                      ...familyErrors,
                      [name]: error,
                    });
                  }}
                  style={{ textTransform: "capitalize" }}
                  error={Boolean(familyErrors.otherRelation)}
                />
                <span className="error">{familyErrors?.otherRelation}</span>
              </Grid>
            )}
            {/* Name Input */}
            <Grid item xs={12}>
              <label>Name</label>
              <SoftInput
                fullWidth
                label="Name"
                placeholder="Please enter name"
                name="name"
                value={currentFamilyMember.name}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setCurrentFamilyMember((prev) => ({
                    ...prev,
                    [name]: capitalizeValue(value)?.trim(),
                  }));
                  const error = validateField(name, value?.trim());
                  setFamilyErrors({
                    ...familyErrors,
                    [name]: error,
                  });
                }}
                error={Boolean(familyErrors.name)}
                style={{ textTransform: "capitalize" }}
              />
              <span className="error">{familyErrors?.name}</span>
            </Grid>
            <Grid item xs={12}>
              <label>Date of Birth</label>
              <DatePicker
                selected={
                  !isEmpty(currentFamilyMember?.birth_date) ? currentFamilyMember?.birth_date : ""
                }
                onChange={(date) => {
                  const selectedDate = new Date(date);
                  selectedDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
                  setCurrentFamilyMember((prev) => ({
                    ...prev,
                    birth_date: selectedDate,
                  }));
                  const error = validateField("birth_date", selectedDate);
                  setFamilyErrors({
                    ...familyErrors,
                    birth_date: error,
                  });
                }}
                placeholderText="Please select date of birth"
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="dd-MM-yyyy"
                minDate={minDate}
                maxDate={new Date()}
                className={!familyErrors.birth_date ? "input" : "input errorInput"}
                onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
                customInput={<input style={{ cursor: "pointer" }} />}
              />
              {familyErrors.birth_date && <span className="error">{familyErrors.birth_date}</span>}
            </Grid>
            <Grid item xs={12}>
              <label>Email</label>
              <SoftInput
                fullWidth
                label="Email"
                placeholder="Please enter email"
                name="email"
                value={currentFamilyMember.email}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setCurrentFamilyMember((prev) => ({
                    ...prev,
                    [name]: value?.trim()?.toLowerCase(),
                  }));
                  const error = validateField(name, value);
                  setFamilyErrors({
                    ...familyErrors,
                    [name]: error,
                  });
                }}
                error={Boolean(familyErrors.email)}
                disabled={familyMemberModalOpen?.isEdit}
              />
              <span className="error">{familyErrors?.email}</span>
            </Grid>

            <Grid item xs={12}>
              <label>Gender</label>
              <RadioGroup
                aria-label="gender"
                name="gender"
                value={currentFamilyMember.gender}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setCurrentFamilyMember((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  paddingLeft: "10px",
                }}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
            </Grid>
            {/* Save and Cancel Buttons */}
            <Grid item xs={12} display="flex" justifyContent="end" gap="10px">
              <SoftButton
                variant="outlined"
                color={"secondary"}
                onClick={() => {
                  clearMember();
                }}
              >
                Cancel
              </SoftButton>
              <SoftButton
                variant="gradient"
                color={sidenavColor}
                onClick={() => {
                  saveFamilyMember();
                }}
              >
                {familyMemberModalOpen?.isEdit ? "Update" : "Add"}
              </SoftButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        sx={{ outline: "none" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            outline: "none",
          }}
        >
          <Icon
            aria-label="close"
            onClick={() => setDeleteConfirmation(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "text.secondary",
              cursor: "pointer",
            }}
          >
            <Close />
          </Icon>

          <Typography id="confirm-modal-title" variant="h4" component="h2" gutterBottom>
            Are you sure?
          </Typography>
          <Typography id="confirm-modal-description" variant="body2" color="text.secondary" mb={3}>
            Do you really want to delete this member?
          </Typography>
          <SoftButton
            variant="outlined"
            color="secondary"
            onClick={() => setDeleteConfirmation(false)}
            sx={{ mr: 1 }}
          >
            Cancel
          </SoftButton>
          <SoftButton variant="gradient" color="error" onClick={deleteFamilyMember}>
            Delete
          </SoftButton>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default CreatePatient;
