import { AsyncPaginate } from "react-select-async-paginate";
import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // MUI
import { handleSpaceKeyPress } from "@/utils";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; // MUI ICON COMPONENT

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"; // CUSTOM COMPONENTS

import { H6 } from "@/components/typography";
import DropZone from "@/components/dropzone";
import FlexBox from "@/components/flexbox/FlexBox";
import IconWrapper from "@/components/icon-wrapper"; // CUSTOM ICON COMPONENT

import ShoppingBasket from "@/icons/ShoppingBasket";
import { capitalizeValue } from "../../../helper/constant";
import { fetchUserData } from "../../../api/axiosApis/get";
import moment from "moment";
import zIndex from "@mui/material/styles/zIndex";
import { createScheduleCall } from "../../../api/axiosApis/post";
import { useNavigate } from "react-router-dom";
export default function CreateProductPageView() {
  const [files, setFiles] = useState([]);

  const handleChangeDescription = (value) => {
    console.log(value);
  };

  const loadOptions = useCallback(
    async (searchQuery, loadedOptions, { page }) => {
      try {
        // Fetch data from API
        // GetActivePatientInfo({
        //   search: searchQuery,
        //   page,
        //   limit: 100,
        // });

        const response = await fetchUserData(page, 100, searchQuery);

        // Map and sort data
        const data =
          response?.data?.map((item) => ({
            value: item?.id, // Ensure item.id or a unique identifier is correctly set here
            label: `${item.first_name} ${item.last_name}`,
          })) || [];

        // Sort options alphabetically by label
        const sortedOptions = data.sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        return {
          options: sortedOptions,
          hasMore:
            response?.payload?.count > 100 &&
            loadedOptions.length < response?.payload?.count,
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
    []
  );
  const asyncPaginateStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#ffffff", // Match the call_duration dropdown background
      borderRadius: "4px", // Match Material-UI's border radius
      borderColor: "#c4c4c4", // Match the border color
      // fontSize: "0.875rem",
      // height: "56px", // Same height as the Material-UI dropdown
      boxShadow: "none",
      "&:hover": {
        borderColor: "#c4c4c4",
      },
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "0.875rem", // Same font size as call_duration
      color: "#333333", // Match the text color
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: "0.875rem",
      color: "#757575", // Match placeholder color
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#ffffff", // Match the dropdown menu background
      borderRadius: "4px", // Match Material-UI dropdown menu
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.875rem",
      color: "#333333",

      backgroundColor: state.isSelected ? "#e0e0e0" : "#ffffff",
      "&:hover": {
        backgroundColor: "#f5f5f5", // Match hover state
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#333333", // Match dropdown indicator color
      "&:hover": {
        color: "#333333",
      },
    }),
    indicatorSeparator: () => ({
      display: "none", // Remove the separator
    }),
  };
  // const validationSchema = Yup.object({
  //   call_duration: Yup.string().required("title is Required!"),
  //   call_time: Yup.string().required("Model is Required!"),
  //   description: Yup.string().required("ID Number is Required!"),
  //   patient_id: Yup.string().min(9).required("Prority is required!"),
  //   title: Yup.string().required("Name is Required!"),
  // });

  // const validationSchema = Yup.object({
  //   call_time: Yup.string()
  //     .required("Appointment date and time is required!")
  //     .test(
  //       "is-future-date",
  //       "Appointment date and time must be in the future!",
  //       (value) => {
  //         return value && moment(value).isAfter(moment());
  //       }
  //     ),
  //   description: Yup.string().required("Description is required!"),
  //   patient_id: Yup.number().required("Please select a patient!"),
  //   title: Yup.string().required("Title is required!"),
  // });
  const validationSchema = Yup.object({
    call_time: Yup.string()
      .required("Appointment date and time is required!")
      .test(
        "is-future-date",
        "Appointment date and time must be in the future!",
        (value) => value && moment(value).isAfter(moment())
      ),
    description: Yup.string().required("Description is required!"),
    patient_id: Yup.object()
      .shape({
        value: Yup.string().required("Please select a patient!"),
        label: Yup.string().required(),
      })
      .nullable()
      .required("Please select a patient!"), // Top-level error message
    title: Yup.string().required("Title is required!"),
  });

  const initialValues = {
    description: "",
    call_duration: "",
    call_time: "",
    patient_id: null, // Initial value
    title: "",
  };
  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const body = { ...values };
      body.patient_id = body.patient_id.value;
      console.log(body, "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

      try {
        await createScheduleCall(body).then((res) => {
          if (res?.data?.success) {
            resetForm();
            navigate("/dashboard/schedule-call-list");
          }
        });
      } catch (error) {
        console.log("error", error);
      }
    },
  });
  console.log(`patient_id`, values.patient_id);
  useEffect(() => {
    setFieldValue("call_duration", 300);
    setFieldValue(
      "call_time",
      moment().add(2, "minutes").format("YYYY-MM-DDTHH:mm")
    );
  }, []);
  return (
    <div className="pt-2 pb-4">
      <form onSubmit={handleSubmit}>
        <Card className="p-3">
          <Grid container spacing={3} alignItems="start">
            <Grid size={12}>
              <FlexBox gap={0.5} alignItems="center">
                <H6 fontSize={16}>Schedule call</H6>
              </FlexBox>
            </Grid>

            <Grid
              container
              spacing={2}
              size={{
                md: 12,
                xs: 12,
              }}
            >
              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  onKeyDown={handleSpaceKeyPress}
                  fullWidth
                  name="title"
                  label="Title"
                  onBlur={handleBlur}
                  value={values.title}
                  onChange={(e) => {
                    const sendValue = e.target.value?.trimStart();
                    setFieldValue("title", capitalizeValue(sendValue));
                  }}
                  helperText={touched.title && errors.title}
                  error={Boolean(touched.title && errors.title)}
                />
              </Grid>

              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <AsyncPaginate
                  id="related-category"
                  isMulti={false}
                  placeholder="Select patient name"
                  loadOptions={loadOptions}
                  additional={{
                    page: 1,
                  }}
                  value={values.patient_id} // Controlled value
                  onChange={(selectedOption) => {
                    setFieldValue("patient_id", selectedOption); // Update Formik's value
                  }}
                  styles={asyncPaginateStyles}
                />

{touched.patient_id && errors.patient_id && (
  <span style={{ color: "red" }}>{errors.patient_id}</span>
)}


              </Grid>

              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  name="call_time"
                  type="datetime-local"
                  label="Appointment Date and Time"
                  InputLabelProps={{
                    shrink: true, // Keeps the label above the input
                  }}
                  value={values.call_time}
                  onChange={handleChange}
                  helperText={touched.call_time && errors.call_time}
                  error={Boolean(touched.call_time && errors.call_time)}
                  inputProps={{
                    min: moment().add(1, "minutes").format("YYYY-MM-DDTHH:mm"), // Restrict to future dates and times
                  }}
                />
              </Grid>

              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  select
                  fullWidth
                  label="Call Duration"
                  slotProps={{
                    select: {
                      native: true,
                      IconComponent: KeyboardArrowDown,
                    },
                  }}
                >
                  <option value={300}>5 Minutes</option>
                  <option value={600}>10 Minutes</option>
                  <option value={900}>15 Minutes</option>
                  <option value={1200}>20 Minutes</option>
                </TextField>
              </Grid>

              <Grid size={12}>
                <TextField
                  onBlur={handleBlur}
                  value={values.description}
                  onChange={handleChange}
                  helperText={touched.description && errors.description}
                  error={Boolean(touched.description && errors.description)}
                  onKeyDown={handleSpaceKeyPress}
                  name={"description"}
                  fullWidth
                  label="Description"
                  multiline
                  rows={9}
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>

        <FlexBox
          flexWrap="wrap"
          gap={2}
          sx={{
            my: 3,
          }}
        >
          <Button type="submit" variant="contained">
            Save
          </Button>

          <Button variant="outlined" color="secondary">
            Clear
          </Button>
        </FlexBox>
      </form>
    </div>
  );
}
