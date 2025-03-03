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

import { forwardRef } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";

// Mind Meta AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// custom styles for the NotificationItem
import { menuItem, menuImage } from "examples/Items/NotificationItem/styles";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
const NotificationItem = forwardRef(({ color, image, title, date, ...rest }, ref) => (
  <MenuItem
    {...rest}
    ref={ref}
    sx={(theme) => menuItem(theme)}
    style={{
      width: "100%",
      cursor: "auto",
      marginBottom: "1px",
      padding: "2px 10px",
    }}
  >
    <SoftBox
      width="2.50rem"
      height="2rem"
      mr={1}
      borderRadius="md"
      sx={(theme) => menuImage(theme, { color })}
    >
      {image}
    </SoftBox>
    <SoftBox>
      <SoftTypography
        variant="button"
        textTransform="capitalize"
        fontWeight="regular"
        sx={{
          wordBreak: "break-word", // Ensure long words break properly
          maxWidth: "auto", // Set max width for proper layout
          overflowWrap: "break-word", // Break long words
          whiteSpace: "normal",
          fontSize: "13px",
          fontWeight: "500",
        }}
      >
        {title}
      </SoftTypography>
      <SoftTypography
        variant="caption"
        color="secondary"
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: "12px",
          alignItems: "start",
        }}
      >
        <SoftTypography variant="button" color="secondary">
          <Icon
            sx={{
              lineHeight: 1,
              mr: 0.5,
            }}
          >
            <WatchLaterOutlinedIcon />
          </Icon>
        </SoftTypography>
        {date}
      </SoftTypography>
    </SoftBox>
  </MenuItem>
));

// Setting default values for the props of NotificationItem
NotificationItem.defaultProps = {
  color: "dark",
};

// Typechecking props for the NotificationItem
NotificationItem.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  image: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default NotificationItem;
