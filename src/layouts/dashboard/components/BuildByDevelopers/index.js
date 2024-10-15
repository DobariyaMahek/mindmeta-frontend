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

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Mind Meta AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Images
import wavesWhite from "assets/images/shapes/waves-white.svg";
import rocketWhite from "assets/images/illustrations/rocket-image.png";
import moment from "moment";
import { Padding } from "@mui/icons-material";

function BuildByDevelopers() {
  return (
    <Card>
      <SoftBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <SoftBox display="flex" flexDirection="column" height="100%">
              <SoftTypography variant="h5" pt={1} fontWeight="bold" gutterBottom>
                Welcome
              </SoftTypography>
              <SoftBox mb={6}>
                <SoftTypography variant="body2" color="text" fontWeight="bold">
                  It&apos;s {moment?.utc(new Date())?.format("ddd MMM DD YYYY")} Today
                </SoftTypography>
                <SoftTypography variant="p" sx={{ color: "gray", fontSize: "14px", Padding: "0" }}>
                  Have a Nice Day
                </SoftTypography>
              </SoftBox>{" "}
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default BuildByDevelopers;
