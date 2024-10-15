//------------------------------------regex------------------------------------------------//
export const EMAIL_REGEX =
  /^(?!.*[@]{2})(?!.*[._%+-]{2})[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//-------------------------------------Array list-------------------------------------//
export const PATIENT_LIST_COLUMNS = [
  { name: "sr", align: "center" },
  { name: "patient name", align: "left" },
  { name: "email", align: "left" },
  { name: "birthDate", align: "left" },
  { name: "created date", align: "left" },
  { name: "status", align: "center" },
  { name: "action", align: "center" },
];
export const TRAINING_LOGS_COLUMNS = [
  { name: "sr", align: "center" },
  { name: "family member name", align: "left" },
  { name: "email", align: "left" },
  { name: "created date", align: "left" },
  { name: "action", align: "center" },
];

export const mainRelations = [
  "Family",
  "Guardian",
  "Social Worker",
  "Healthcare Provider",
  "Educational",
  "Friend",
  "Professional",
  "Other",
];

export const PatientTypes = [
  {
    value: "NewPatient",
    label: "New patient",
  },
  {
    value: "ExistingResidentPatient",
    label: "Existing resident patient",
  },
  {
    value: "LocalCouncilNewPatient",
    label: "Local council new patient",
  },
  {
    value: "LocalCouncilReferredPatientWithoutFamily",
    label: "Local council referred patient without family",
  },
];

export const relations = [
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Siblings", label: "Siblings" },
  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
  { value: "Spouse", label: "Spouse" },
  { value: "Other", label: "Other" },
];

//------------------------------------default value--------------------------------------//
export const GENERAL_INFO_PATIENT = {
  lastName: "",
  firstName: "",
  birthdate: "",
  patientEmail: "",
  patientType: "NewPatient",
  gender: "Male",
};

export const FAMILY_MEMBER_INFO = {
  relation: "",
  otherRelation: "",
  name: "",
  email: "",
  gender: "Male",
  id: null,
  birth_date: "",
};

export const FAMILY_MODAL = {
  isOpen: false,
  isEdit: false,
  memberInfo: {},
  memberIndex: null,
};

export const FILE_TYPE = ["image", "video", "audio"];

//----------------------------validation function------------------------------------//
export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push(PASSWORD_VALIDATION_MESSAGES.minLength);
  if (!/[A-Z]/.test(password)) errors.push(PASSWORD_VALIDATION_MESSAGES.uppercase);
  if (!/[a-z]/.test(password)) errors.push(PASSWORD_VALIDATION_MESSAGES.lowercase);
  if (!/[0-9]/.test(password)) errors.push(PASSWORD_VALIDATION_MESSAGES.digit);
  if (!/[^A-Za-z0-9]/.test(password)) errors.push(PASSWORD_VALIDATION_MESSAGES.specialChar);

  if (errors.length > 0) {
    return PASSWORD_VALIDATION_MESSAGES.summary;
  }

  return "";
};
export function isEmpty(value) {
  return (
    value == null ||
    value == undefined ||
    value == 0 ||
    (typeof value === "string" && !value?.trim()) ||
    (Array?.isArray(value) && !value?.length)
  );
}
export const capitalizeValue = (value) => {
  return value?.charAt(0)?.toUpperCase() + value?.slice(1);
};
export const functionGetTime = (time) => {
  const date = new Date(time);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure two-digit minutes
  const seconds = date.getSeconds().toString().padStart(2, "0"); // Ensure two-digit seconds
  const day = date.getDate().toString().padStart(2, "0"); // Ensure two-digit day
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two-digit month
  const year = date.getFullYear();

  // Determine AM or PM and convert to 12-hour format
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds} ${ampm}`;
};

//----------------------------validation message --------------------------------------//
export const PASSWORD_VALIDATION_MESSAGES = {
  minLength: "at least 8 characters",
  uppercase: "one uppercase letter",
  lowercase: "one lowercase letter",
  digit: "one number",
  specialChar: "one special character",
  summary:
    "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character!",
};

//----------------------------message --------------------------------------//
export const SOMETHING_WRONG = "Oops! Something went wrong";
export const SUCCESSFULLY_LOGIN = "You have successfully logged in.";
export const DELETE_PATIENT = "Patient has been deleted successfully";
export const UPDATE_PATIENT = "Patient and family members updated successfully";
export const CREATE_PATIENT = "Patient and family members created successfully";
export const ONE_FAMILY_REQUIRED = "At least one family member must be included.";
export const SESSION_EXPIRED = "Session expired. Sign in again.";

export const apiKey = "9OgS1MSc6ydaxs7vHSXh7QrK6tH0JpCj1KDXAGQplMpQVrGz";
export const configId = "1079d22e-679c-4880-aac1-a43349c1a70a";
export const secretKey = "eUyU45kjzd03936AZUPc853brBQR3Qqw7AGXuVfe1HtR3YN1xF2QjN77cudc8xrA";

export const VIEW_OPTIONS = [
  { id: "month", label: "Month" },
  { id: "agenda", label: "Agenda" },
];
