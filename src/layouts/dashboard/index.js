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
import Grid from "@mui/material/Grid";

// Mind Meta AI React components
import SoftBox from "components/SoftBox";

// Mind Meta AI React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";

// Mind Meta AI React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import { getSession } from "helper/authHelper";
import SoftTypography from "components/SoftTypography";
import { Card, Icon } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { getPatientById } from "../../redux/ApiSlice/patientSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { SOMETHING_WRONG } from "helper/constant";
import { Group } from "@mui/icons-material";
function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  document.title = "Mind Meta AI | Dashboard";
  const userInfo = getSession();
  const dispatch = useDispatch();
  const [patientInfo, setPatientInfo] = useState({});

  useEffect(() => {
    if (userInfo?.role === "family_member" && userInfo?.user_info?.patient_id) {
      setPatientInfo(userInfo?.user_info?.patient_info);
    }
  }, [userInfo?.user_info?.patient_id]);
  return (
    <DashboardLayout>
      <SoftBox py={3}>
        {userInfo?.role == "care_home" && (
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} xl={3}>
                <Card>
                  <SoftBox bgColor={"white"} variant="gradient">
                    <SoftBox p={2}>
                      <Grid container alignItems="center">
                        <Grid item xs={8}>
                          <SoftBox ml={0} lineHeight={1}>
                            <SoftTypography
                              variant="button"
                              color={"dark"}
                              opacity={0.7}
                              textTransform="capitalize"
                            >
                              Active Patients
                            </SoftTypography>
                            <SoftTypography variant="h5" fontWeight="bold" color={"dark"}>
                              0
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                        <Grid item xs={4}>
                          <SoftBox
                            variant="gradient"
                            bgColor={"info"}
                            color={"white"}
                            width="3rem"
                            height="3rem"
                            marginLeft="auto"
                            borderRadius="md"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            shadow="md"
                          >
                            <Icon fontSize="small" color="inherit">
                              <Group />
                            </Icon>
                          </SoftBox>
                        </Grid>
                      </Grid>
                    </SoftBox>
                  </SoftBox>
                </Card>
              </Grid>
            </Grid>
          </SoftBox>
        )}
        {userInfo?.role == "patient" && (
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={7}>
                <BuildByDevelopers />
              </Grid>
            </Grid>
          </SoftBox>
        )}
        {userInfo?.role === "family_member" && (
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <SoftBox p={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <SoftBox display="flex" flexDirection="column" height="100%">
                          <SoftTypography variant="h5" pt={1} fontWeight="bold" gutterBottom>
                            Patient Information
                          </SoftTypography>
                          <Grid mt={4} mb={2}>
                            <SoftTypography
                              variant="h6"
                              color="text"
                              fontSize={"14px"}
                              marginBottom="10px"
                            >
                              {/* It&apos;s {moment(new Date()).format("ddd MMM DD YYYY")} Today */}
                              Name :{" "}
                              <SoftTypography
                                variant="p"
                                sx={{ color: "gray", fontSize: "14px", Padding: "0" }}
                              >
                                {" "}
                                {patientInfo?.first_name || ""} {patientInfo?.last_name || ""}
                              </SoftTypography>
                            </SoftTypography>
                            <SoftTypography
                              variant="h6"
                              color="text"
                              fontSize={"14px"}
                              marginBottom="10px"
                            >
                              {/* It&apos;s {moment(new Date()).format("ddd MMM DD YYYY")} Today */}
                              Birthdate :
                              <SoftTypography
                                variant="p"
                                sx={{ color: "gray", fontSize: "14px", Padding: "0" }}
                              >
                                {" "}
                                {moment
                                  ?.utc(new Date(patientInfo?.birthdate))
                                  ?.format("DD MMM, YYYY") || ""}
                              </SoftTypography>
                            </SoftTypography>{" "}
                            <SoftTypography
                              variant="h6"
                              color="text"
                              fontSize={"14px"}
                              marginBottom="10px"
                            >
                              {/* It&apos;s {moment(new Date()).format("ddd MMM DD YYYY")} Today */}
                              Status :
                              <SoftTypography
                                variant="p"
                                sx={{ color: "gray", fontSize: "14px", Padding: "0" }}
                              >
                                {" "}
                                Active
                              </SoftTypography>
                            </SoftTypography>{" "}
                            <SoftTypography
                              variant="h6"
                              color="text"
                              fontSize={"14px"}
                              marginBottom="10px"
                            >
                              {/* It&apos;s {moment(new Date()).format("ddd MMM DD YYYY")} Today */}
                              Email :
                              <SoftTypography
                                variant="p"
                                sx={{ color: "gray", fontSize: "14px", Padding: "0" }}
                              >
                                {" "}
                                {patientInfo?.email || ""}
                              </SoftTypography>
                            </SoftTypography>
                            <SoftTypography
                              variant="h6"
                              color="text"
                              fontSize={"14px"}
                              marginBottom="10px"
                            >
                              {/* It&apos;s {moment(new Date()).format("ddd MMM DD YYYY")} Today */}
                              Medical History :
                              <SoftTypography
                                variant="p"
                                sx={{ color: "gray", fontSize: "14px", Padding: "0" }}
                              >
                                {" "}
                                {patientInfo?.medical_history || ""}
                              </SoftTypography>
                            </SoftTypography>
                          </Grid>{" "}
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </SoftBox>
                </Card>
              </Grid>
            </Grid>
          </SoftBox>
        )}
      </SoftBox>
    </DashboardLayout>
  );
}

export default Dashboard;
