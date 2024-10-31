import React from "react";
import { Close } from "@mui/icons-material";
import { Box, FormControlLabel, Grid, Icon, Modal, Radio, RadioGroup } from "@mui/material";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { relations } from "helper/constant";
import { isEmpty } from "helper/constant";
import { useSoftUIController } from "context";
import colors from "assets/theme/base/colors";
import { capitalizeValue } from "helper/constant";
const FamilyMemberModal = ({
  familyMemberModalOpen,
  currentFamilyMember,
  setCurrentFamilyMember,
  familyErrors,
  setFamilyErrors,
  clearMember,
  saveFamilyMember,validateField
}) => {
  const todays = new Date();
  const minDate = new Date(todays.getFullYear() - 150, 0, 1);
  const [controller] = useSoftUIController();
  const { sidenavColor } = controller;
  const { dark, primary } = colors;

  return (
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
          bgcolor: dark.main,
          borderRadius: 3,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.7)", // Dark-themed box shadow
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
              color: "#fff",
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
                  [name]: capitalizeValue(value)?.trimStart(),
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
              <FormControlLabel
                value="Male"
                control={
                  <Radio
                    sx={{
                      color: "#ffffff", // Default border color when unselected
                      "&.Mui-checked": {
                        color: "#e8078d", // Primary color when checked
                      },
                    }}
                  />
                }
                label="Male"
                sx={{ "& .MuiFormControlLabel-label": { color: "#ffffff" } }}
              />
              <FormControlLabel
                value="Female"
                control={
                  <Radio
                    sx={{
                      color: "#ffffff", // Default border color when unselected
                      "&.Mui-checked": {
                        color: "#e8078d", // Primary color when checked
                      },
                    }}
                  />
                }
                label="Female"
                sx={{ "& .MuiFormControlLabel-label": { color: "#ffffff" } }}
              />
              <FormControlLabel
                value="Other"
                control={
                  <Radio
                    sx={{
                      color: "#ffffff", // Default border color when unselected
                      "&.Mui-checked": {
                        color: "#e8078d", // Primary color when checked
                      },
                    }}
                  />
                }
                label="Other"
                sx={{ "& .MuiFormControlLabel-label": { color: "#ffffff" } }}
              />
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
  );
};
FamilyMemberModal.propTypes = {
  familyMemberModalOpen: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool,
  }).isRequired,
  currentFamilyMember: PropTypes.shape({
    relation: PropTypes.string,
    otherRelation: PropTypes.string,
    name: PropTypes.string,
    birth_date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    email: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  setCurrentFamilyMember: PropTypes.func.isRequired,
  familyErrors: PropTypes.shape({
    relation: PropTypes.string,
    otherRelation: PropTypes.string,
    name: PropTypes.string,
    birth_date: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  setFamilyErrors: PropTypes.func.isRequired,
  clearMember: PropTypes.func.isRequired,
  saveFamilyMember: PropTypes.func.isRequired,
  validateField: PropTypes.func.isRequired,
};
export default FamilyMemberModal;
