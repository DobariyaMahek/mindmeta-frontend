import PropTypes from "prop-types";

// @mui material components
import { Icon, Breadcrumbs as MuiBreadcrumbs, Tooltip } from "@mui/material";

// Mind Meta AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Breadcrumbs({ title, route, light = false }) {
  const navigate = useNavigate();
  return (
    <SoftBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      ></MuiBreadcrumbs>
      <SoftBox sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {title === "update-patient" && (
          <Tooltip title="Back" placement="top">
            <Icon
              sx={{ cursor: "pointer", marginRight: "10px", color: "#fff" }}
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowBack />
            </Icon>
          </Tooltip>
        )}
        <SoftTypography
          fontWeight="bold"
          textTransform="capitalize"
          variant="h6"
          color={light ? "white" : "dark"}
          noWrap
        >
          {title.replace("-", " ")}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

Breadcrumbs.propTypes = {
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
