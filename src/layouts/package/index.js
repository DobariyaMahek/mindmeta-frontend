import React from "react";
import Card from "@mui/material/Card";
import { Box, CardContent, Typography, Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useSoftUIController } from "context";

function Package() {
  const [controller] = useSoftUIController();
  const { sidenavColor } = controller;

  return (
    <DashboardLayout>
        
      <SoftBox py={3}>
        <Box py={6} px={2} bgcolor="#f9f9f9">
          <Grid container spacing={4} justifyContent="center">
            {/* Basic Plan */}
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <Card
                sx={{
                  borderRadius: "16px",
                  textAlign: "center",
                  bgcolor: "white",
                  paddingY: "20px",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                  },
                }}
              >
                <CardContent>
                  <SoftTypography variant="h5" fontWeight="bold" mb={2} color="#66b5a3">
                    Basic Plan
                  </SoftTypography>
                  <Typography variant="h4" fontWeight="bold" color="#66b5a3" gutterBottom>
                    $19{" "}
                    <Typography variant="body2" component="span" color="textSecondary">
                      / month
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body1"
                    mb={3}
                    color="textSecondary"
                    fontSize="15px"
                    fontWeight="bold"
                  >
                    Ideal for patients who need regular check-ins with the comfort of knowing that
                    support is just a call away.
                  </Typography>
                  <Box textAlign="start">
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      <Typography color={"#66b5a3"} component={"span"}>
                        {" "}
                        •
                      </Typography>{" "}
                      5 days a week of scheduled check-ins
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      <Typography color={"#66b5a3"} component={"span"}>
                        {" "}
                        •
                      </Typography>{" "}
                      45-minute calls per day to discuss health updates and provide emotional
                      support
                    </Typography>
                  </Box>
                  <Box mb={3}>
                    <SoftBox mt={2}>
                      <SoftButton variant="gradient" color={sidenavColor}>
                        Select
                      </SoftButton>
                    </SoftBox>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Advanced Plan */}
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <Card
                sx={{
                  borderRadius: "16px",
                  textAlign: "center",
                  bgcolor: "white",
                  paddingY: "20px",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                  },
                }}
              >
                <CardContent>
                  <SoftTypography variant="h5" fontWeight="bold" mb={2} color="#66b5a3">
                    Advanced Plan
                  </SoftTypography>
                  <Typography variant="h4" fontWeight="bold" color="#66b5a3" gutterBottom>
                    $59{" "}
                    <Typography variant="body2" component="span" color="textSecondary">
                      / month
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body1"
                    mb={3}
                    color="textSecondary"
                    fontSize="15px"
                    fontWeight="bold"
                  >
                    Comprehensive care for those who require more frequent attention, personalized
                    service, and dedicated support.
                  </Typography>
                  <Box textAlign="start">
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      <Typography color={"#66b5a3"} component={"span"}>
                        {" "}
                        •
                      </Typography>{" "}
                      Daily calls
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      <Typography color={"#66b5a3"} component={"span"}>
                        {" "}
                        •
                      </Typography>{" "}
                      60-minute calls per day to discuss health updates and provide emotional
                      support
                    </Typography>
                  </Box>
                  <Box mb={3}>
                    <SoftBox mt={2}>
                      <SoftButton variant="gradient" color={sidenavColor}>
                        Select
                      </SoftButton>
                    </SoftBox>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </SoftBox>
    </DashboardLayout>
  );
}

export default Package;
