import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Grid, Typography } from "@mui/material";
import { useSoftUIController } from "context";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import "./calender.css";
import Icon from "@mui/material/Icon";
import { Close } from "@mui/icons-material";
import { capitalizeValue } from "helper/constant";
import { GetActivePatientInfo } from "../../../redux/ApiSlice/patientSlice";
import { useDispatch } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import SoftBox from "components/SoftBox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CALL_DURATION } from "helper/constant";
import colors from "assets/theme/base/colors";
const EventModal = ({ open, handleClose, handleSave }) => {
  const [controller] = useSoftUIController();
  const { sidenavColor } = controller;
  const { dark, primary } = colors;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    patient: null,
    callTime: new Date(),
    callDuration: 5,
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const loadOptions = useCallback(
    async (searchQuery, loadedOptions, { page }) => {
      try {
        // Fetch data from API
        const response = await dispatch(
          GetActivePatientInfo({ search: searchQuery, page, limit: 100 })
        );

        // Map and sort data
        const data =
          response?.payload?.data?.map((item) => ({
            value: item?.id, // Ensure item.id or a unique identifier is correctly set here
            label: `${item.first_name} ${item.last_name}`,
          })) || [];

        // Sort options alphabetically by label
        const sortedOptions = data.sort((a, b) => a.label.localeCompare(b.label));
        return {
          options: sortedOptions,
          hasMore:
            response?.payload?.count > 100 && loadedOptions.length < response?.payload?.count,
          additional: {
            page: page + 1,
          },
        };
      } catch (error) {
        return {
          options: [],
          hasMore: false,
          additional: {
            page: 1,
          },
        };
      }
    },
    [dispatch]
  );

  const validate = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.patient) newErrors.patient = "Patient is required.";
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.callTime) newErrors.callTime = "Call Time is required.";
    else {
      // Ensure callTime is not in the past
      const now = new Date();
      if (formData.callTime < now) {
        newErrors.callTime = "Selected time should be later";
      }
    }

    return newErrors;
  };
  const handleDateChange = (selectedDate) => {
    if (selectedDate) {
      const now = new Date(); // Get the current date and time

      if (new Date(selectedDate) < now) {
        setErrors((prev) => ({
          ...prev,
          callTime: "Selected time should be later",
        }));
      } else {
        setFormData({
          ...formData,
          callTime: selectedDate,
        });
        setErrors((prev) => ({
          ...prev,
          callTime: "",
        })); // Clear the error
      }
    }
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      handleSave(formData);
      handleClose();
      setFormData({
        title: "",
        description: "",
        patient: null,
        callTime: new Date(),
        callDuration: 5,
      });
      setErrors({});
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setFormData({
          title: "",
          description: "",
          patient: null,
          callTime: new Date(),
          callDuration: 5,
        });
        setErrors({});
      }}
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
          boxShadow: 24,
          p: 2,
          outline: "none",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.7)", // Dark-themed box shadow
        }}
      >
        {" "}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography id="logout-modal-title" variant="h6" component="h2" gutterBottom color="#fff">
            Schedule call
          </Typography>
          <Icon
            aria-label="close"
            onClick={() => {
              handleClose();
              setFormData({
                title: "",
                description: "",
                patient: null,
                callTime: new Date(),
                callDuration: 5,
              });
              setErrors({});
            }}
            sx={{
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Close />
          </Icon>
        </div>
        <Grid item xs={12}>
          <label>
            Title <span>*</span>
          </label>
          <SoftInput
            placeholder="Please enter title"
            fullWidth
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: capitalizeValue(e.target.value?.trimStart()) });
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            error={!!errors.title}
          />
          <span className="error">{errors.title && errors.title}</span>{" "}
          <label>
            Patient <span>*</span>
          </label>
          <AsyncPaginate
            id="related-category"
            isMulti={false}
            placeholder="Select patient name"
            loadOptions={loadOptions}
            additional={{
              page: 1,
            }}
            defaultValue={formData?.patient}
            value={formData?.patient}
            onChange={(e) => {
              setFormData({
                ...formData,
                patient: e,
              });
            }}
            styles={{
              control: (base, state) => ({
                ...base,
                fontFamily: "Roboto, Helvetica, Arial, sans-serif !important",
                fontSize: "0.875rem !important",
                fontWeight: "400 !important",
                color: "#ffffff !important",
                width: "100%",
                backgroundColor: "#110c17 !important",
                borderColor: errors.patient ? "red" : "#544a5d",
                cursor: "pointer",
                "&:hover": {
                  borderColor: errors.patient ? "red" : "#544a5d",
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: "#ffffff !important", // Ensures the selected text is white
              }),
              placeholder: (base) => ({
                ...base,
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                color: "#908f92",
                fontSize: "13px",
                padding: "0 3px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#ffffff !important", // Dropdown indicator color
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#110c17 !important", // Dropdown menu background color
              }),
              option: (base, state) => ({
                ...base,
                fontFamily: "Roboto, Helvetica, Arial, sans-serif !important",
                fontSize: "0.875rem !important",
                fontWeight: "400 !important",
                color: state.isSelected ? "#ffffff" : "#ffffff", // Option text color
                backgroundColor: state.isSelected ? "#544a5d" : "#110c17", // Background color for selected and unselected options
                "&:hover": {
                  backgroundColor: "#544a5d", // Hover background color
                },
              }),
              noOptionsMessage: (base) => ({
                ...base,
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontSize: "0.8rem", // Customize font size for "No Options" text
                color: "#ffffff",
              }),
              loadingMessage: (base) => ({
                ...base,
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontSize: "0.8rem", // Customize font size for "Loading..." text
                color: "#ffffff",
              }),
            }}
          />
          <span className="error">{errors.patient && errors.patient}</span>
          <label>
            Description <span>*</span>
          </label>
          <SoftInput
            placeholder="Write description here..."
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
            }}
            error={!!errors.description}
          />
          <span className="error">{errors.description && errors.description}</span>
          <Grid item xs={12}>
            <label className="form-label" htmlFor="call-time">
              Call Time <span>*</span>
            </label>
            <SoftBox>
              <DatePicker
                selected={formData?.callTime}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="hh:mm a"
                timeIntervals={1}
                dateFormat="dd-MM-yyyy hh:mm a"
                minDate={new Date()}
                className="input"
                dropdownMode="select"
                onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
                customInput={<input style={{ cursor: "pointer" }} />}
              />
              <span className="error"> {errors.callTime && errors.callTime}</span>
            </SoftBox>
          </Grid>{" "}
          <Grid item xs={12}>
            <label className="form-label" htmlFor="call-time">
              Call Duration <span>*</span>
            </label>
            <SoftBox>
              <select
                name="callDuration"
                className="relation-dropdown"
                value={formData?.callDuration}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData({
                    ...formData,
                    callDuration: value,
                  });
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                {CALL_DURATION &&
                  CALL_DURATION?.map((item, i) => (
                    <option value={item?.value} key={i}>
                      {item?.label}
                    </option>
                  ))}
              </select>
            </SoftBox>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <SoftButton
            onClick={() => {
              // handleClose();
              setFormData({
                title: "",
                description: "",
                patient: null,
                callTime: new Date(),
                callDuration: 5,
              });
              setErrors({});
            }}
            variant="outlined"
            color="secondary"
            sx={{ marginRight: 1 }}
          >
            Clear
          </SoftButton>
          <SoftButton onClick={handleSubmit} variant="outlined" color={sidenavColor}>
            Save
          </SoftButton>
        </Box>
      </Box>
    </Modal>
  );
};

EventModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default EventModal;
