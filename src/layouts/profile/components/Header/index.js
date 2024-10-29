/**
=========================================================
* Mind Meta AI React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Mind Meta AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// Mind Meta AI React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Mind Meta AI React icons
import Cube from "examples/Icons/Cube";
import Document from "examples/Icons/Document";
import Settings from "examples/Icons/Settings";

// Mind Meta AI React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import curved0 from "assets/images/curved-images/curved0.jpg";
import { Edit } from "@mui/icons-material";
import { Icon, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
function Header({ setEdit, edit, newData }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <SoftBox position="relative">
      <DashboardNavbar absolute light />
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${curved0})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { dark } }) => rgba(dark.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <SoftBox display="flex" gap={2}>
              <SoftAvatar alt="profile-image" variant="rounded" bgColor="secondary">
                {newData?.username?.charAt(0)?.toUpperCase()}
              </SoftAvatar>
              <SoftBox height="100%" mt={0.5} lineHeight={1}>
                <SoftTypography variant="h5" fontWeight="medium">
                  {newData?.username || "-"}
                </SoftTypography>{" "}
                <SoftTypography variant="button" color="text" fontWeight="medium">
                  {newData?.email || "-"}
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          </Grid>

          <Grid item textAlign={"end"} sx={{ ml: "auto" }}>
            {!edit && (
              <Tooltip title="Edit Profile" placement="top">
                <Icon
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setEdit(true);
                  }}
                  color="light"
                >
                  <Edit color="light" />
                </Icon>
              </Tooltip>
            )}
          </Grid>
        </Grid>
        <SoftBox mt={1}>
          <Grid container spacing={1}>
            <Grid item xs={1.2}>
              <SoftTypography variant="button" fontWeight="bold">
                Care home name
              </SoftTypography>
            </Grid>
            <Grid item>: &nbsp;</Grid>
            <Grid item xs={10}>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                {newData?.carehome_name || "-"}
              </SoftTypography>{" "}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={1.2}>
              <SoftTypography variant="button" fontWeight="bold">
                Administrator name
              </SoftTypography>
            </Grid>
            <Grid item>: &nbsp;</Grid>
            <Grid item xs={10}>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                {newData?.administrator_name || "-"}
              </SoftTypography>{" "}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={1.2}>
              <SoftTypography variant="button" fontWeight="bold">
                Phone Number
              </SoftTypography>
            </Grid>
            <Grid item>: &nbsp;</Grid>
            <Grid item xs={10}>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                {newData?.phone_number && "+"}
                {newData?.phone_number || "-"}
              </SoftTypography>{" "}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={1.2}>
              <SoftTypography variant="button" fontWeight="bold">
                Address
              </SoftTypography>
            </Grid>
            <Grid item>: &nbsp;</Grid>
            <Grid item xs={10} lineHeight={"25px"}>
              <SoftTypography
                variant="button"
                color="text"
                fontWeight="medium"
                dangerouslySetInnerHTML={{
                  __html: newData?.address.split(",").join(",<br>") || "-",
                }} // Renders <br /> as line breaks
              />
            </Grid>
          </Grid>
        </SoftBox>
      </Card>
    </SoftBox>
  );
}
Header.propTypes = {
  newData: PropTypes.func,
  setEdit: PropTypes.func, // Ensure `setEdit` is a function
  edit: PropTypes.bool, // Ensure `edit` is a boolean
};
export default Header;
