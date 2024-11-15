import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import * as Yup from "yup";
import { useFormik } from "formik";

import Block from "@/components/block";
import { Paragraph, Small } from "@/components/typography";
import { isDark } from "@/utils/constants";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import FlexBox from "@/components/flexbox/FlexBox";

import AddFamilyMember from "./add-family-member";
import { useState } from "react";
import {
  Modal,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from "@mui/material";
import UserTableHead from "../UserTableHead";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM DUMMY DATA
import Scrollbar from "@/components/scrollbar";
import { USER_LIST } from "@/__fakeData__/users";
import UserTableRow from "../UserTableRow";
import { FAMILY_HEAD_LIST } from "../../../helper/constant";

const SwitchWrapper = styled("div")({
  width: "100%",
  marginTop: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const StyledCard = styled(Card)({
  padding: 24,
  // minHeight: 400,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
});

const ButtonWrapper = styled("div")(({ theme }) => ({
  width: 100,
  height: 100,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
}));

const UploadButton = styled("div")(({ theme }) => ({
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.grey[isDark(theme) ? 600 : 200],
  border: `1px solid ${theme.palette.background.paper}`,
}));

export default function AddNewUserPageView() {
  const initialValues = {
    firstName: "",
    lastName: "",
    dob: "",
    fullName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    address: "",
    zip: "",
    about: "",
  };
  const {
    page,
    order,
    orderBy,
    selected,
    isSelected,
    rowsPerPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "name",
  });

  const handleDeleteUser = (id) => {
    setUsers((state) => state.filter((item) => item.id !== id));
  };
  const [users, setUsers] = useState([...USER_LIST]);
  const [userFilter, setUserFilter] = useState({
    role: "",
    search: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => setOpenModal(false);
  const handleOpenModal = () => setOpenModal(true);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is Required!"),
    lastName: Yup.string().required("Last Name is Required!"),
    dob: Yup.date().required("Date of Birth is Required!"),
    fullName: Yup.string().required("Name is Required!"),
    email: Yup.string().email().required("Email is Required!"),
    phone: Yup.number().min(8).required("Phone is Required!"),
    country: Yup.string().required("Country is Required!"),
    state: Yup.string().required("State is Required!"),
    city: Yup.string().required("City is Required!"),
    address: Yup.string().required("Address is Required!"),
    zip: Yup.string().required("Zip is Required!"),
    about: Yup.string().required("About is Required!"),
  });

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {},
  });
  const filteredUsers = stableSort(users, getComparator(order, orderBy));
  console.log(filteredUsers, users);
  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        <Grid size={{ md: 4, xs: 12 }}>
          <StyledCard style={{ height: "100%", justifyContent: "center" }}>
            <ButtonWrapper>
              <UploadButton>
                <label htmlFor="upload-btn">
                  <input
                    accept="image/*"
                    id="upload-btn"
                    type="file"
                    style={{ display: "none" }}
                  />
                  <IconButton component="span">
                    <PhotoCamera sx={{ fontSize: 26, color: "grey.400" }} />
                  </IconButton>
                </label>
              </UploadButton>
            </ButtonWrapper>

            <Paragraph
              marginTop={2}
              maxWidth={200}
              display="block"
              textAlign="center"
              color="text.secondary"
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB
            </Paragraph>

            {/* <Box maxWidth={250} marginTop={5} marginBottom={1}>
              <SwitchWrapper>
                <Paragraph display="block" fontWeight={600}>
                  Public Profile
                </Paragraph>
                <Switch defaultChecked />
              </SwitchWrapper>

              <SwitchWrapper>
                <Paragraph display="block" fontWeight={600}>
                  Banned
                </Paragraph>
                <Switch defaultChecked />
              </SwitchWrapper>

              <Small display="block" color="text.secondary">
                Apply disable account
              </Small>

              <SwitchWrapper>
                <Paragraph display="block" fontWeight={600}>
                  Email Verified
                </Paragraph>
                <Switch defaultChecked />
              </SwitchWrapper>

              <Small display="block" color="text.secondary">
                Disabling this will automatically send the user a verification
                email
              </Small>
            </Box> */}
          </StyledCard>
        </Grid>

        <Grid size={{ md: 8, xs: 12 }}>
          <Card className="p-3">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="firstName"
                    label="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    helperText={touched.firstName && errors.firstName}
                    error={Boolean(touched.firstName && errors.firstName)}
                  />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    helperText={touched.lastName && errors.lastName}
                    error={Boolean(touched.lastName && errors.lastName)}
                  />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="dob"
                    label="Date of Birth"
                    value={values.dob}
                    onChange={handleChange}
                    helperText={touched.dob && errors.dob}
                    error={Boolean(touched.dob && errors.dob)}
                  />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    helperText={touched.email && errors.email}
                    error={Boolean(touched.email && errors.email)}
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
                    name="country"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.country}
                    helperText={touched.country && errors.country}
                    error={Boolean(touched.country && errors.country)}
                    slotProps={{
                      select: {
                        native: true,
                        IconComponent: KeyboardArrowDown,
                      },
                    }}
                  >
                    <option value="usa">New patient</option>
                    <option value="uk">Existing resident patient</option>
                    <option value="uae">Local Council new patient</option>
                  </TextField>
                </Grid>

                <Grid
                  size={{
                    sm: 6,
                    xs: 12,
                  }}
                >
                  <RadioGroup
                    row
                    defaultValue="female"
                    name="radio-buttons-group"
                    sx={{
                      justifyContent: "start",
                    }}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                </Grid>

                {/* <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={values.phone}
                    onChange={handleChange}
                    helperText={touched.phone && errors.phone}
                    error={Boolean(touched.phone && errors.phone)}
                  />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="country"
                    label="Country"
                    value={values.country}
                    onChange={handleChange}
                    helperText={touched.country && errors.country}
                    error={Boolean(touched.country && errors.country)}
                  />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="state"
                    label="State/Region"
                    value={values.state}
                    onChange={handleChange}
                    helperText={touched.state && errors.state}
                    error={Boolean(touched.state && errors.state)}
                  />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="city"
                    label="City"
                    value={values.city}
                    onChange={handleChange}
                    helperText={touched.city && errors.city}
                    error={Boolean(touched.city && errors.city)}
                  />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="address"
                    label="Address"
                    value={values.address}
                    onChange={handleChange}
                    helperText={touched.address && errors.address}
                    error={Boolean(touched.address && errors.address)}
                  />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    name="zip"
                    label="Zip/Code"
                    value={values.zip}
                    onChange={handleChange}
                    helperText={touched.zip && errors.zip}
                    error={Boolean(touched.zip && errors.zip)}
                  />
                </Grid> */}

                <Grid size={12}>
                  <TextField
                    multiline
                    fullWidth
                    rows={10}
                    name="about"
                    label="Write description here "
                    value={values.about}
                    onChange={handleChange}
                    helperText={touched.about && errors.about}
                    error={Boolean(touched.about && errors.about)}
                    sx={{
                      "& .MuiOutlinedInput-root textarea": {
                        padding: 0,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </Card>
          {/* <Card className="p-3" sx={{ mt: 3 }}>
            <Grid
              size={12}
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ pb: 2 }}
            >
              <span>Family Information</span>
              <Button type="submit" variant="contained">
                Add Family Member
              </Button>
            </Grid>
            <Divider />

            <div className="family-information">
              <div className="family-info-box">
                <p>
                  Relation: <span>Father</span>
                </p>
                <p>
                  Name: <span></span>
                </p>
                <p>
                  Email: <span></span>
                </p>
                <p>
                  Date of Birth: <span></span>
                </p>
                <p>
                  Gender: <span></span>
                </p>
              </div>
            </div>
          </Card> */}

          {/* add family member modal */}
          {/* <AddFamilyMember /> */}

          {/* <FlexBox
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
          </FlexBox> */}
        </Grid>
        <Grid size={{ md: 12, xs: 12 }}>
          <Card className="p-3">
            <Grid
              size={12}
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ pb: 2 }}
            >
              <span>Family Information</span>
              <Button variant="contained" onClick={handleOpenModal}>
                Add Family Member
              </Button>
            </Grid>
            <Divider />
            <AddFamilyMember open={openModal} onClose={handleClose} />

            <TableContainer>
              <Scrollbar autoHide={false}>
                <Table>
                  <UserTableHead
                    order={order}
                    orderBy={orderBy}
                    numSelected={selected.length}
                    rowCount={filteredUsers.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllRows={handleSelectAllRows(
                      filteredUsers.map((row) => row.id)
                    )}
                    headList={FAMILY_HEAD_LIST}
                    keys="family"
                  />

                  <TableBody>
                    {filteredUsers.map((user) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                        isSelected={isSelected(user.id)}
                        handleSelectRow={handleSelectRow}
                        handleDeleteUser={handleDeleteUser}
                        keys="family"
                        openModal={openModal}
                      />
                    ))}

                    {filteredUsers.length === 0 && <TableDataNotFound />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
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
        </Grid>
      </Grid>
    </div>
  );
}
