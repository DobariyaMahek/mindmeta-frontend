import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import SoftBox from "components/SoftBox";
import { Badge, Icon, Menu } from "@mui/material";
import { useWebSocketContext } from "api/WebSocketProvider";
import SoftTypography from "components/SoftTypography";
import { Notifications } from "@mui/icons-material";
import SoftButton from "components/SoftButton";

function DashboardNavbar({ absolute = false, light = false, isMini = false }) {
  const [newMessage, setNewMessage] = useState(false);
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [animateDot, setAnimateDot] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const { notificationMessages, sendReadAllEvent, clearAllNotification } = useWebSocketContext();
  const { pathname } = useLocation();
  useEffect(() => {
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, false || !fixedNavbar);
    }
    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    if (newMessage) {
      setAnimateDot(true);
    }
  }, [newMessage]);

  useEffect(() => {
    if (
      notificationMessages[notificationMessages?.length - 1]?.success &&
      notificationMessages[notificationMessages?.length - 1]?.count > 0
    ) {
      setNewMessage(true);
    } else {
      setNewMessage(false);
    }
  }, [notificationMessages]);
  function timeAgo(dateString) {
    const now = new Date();
    const pastDate = new Date(dateString);
    const diffInMs = now - pastDate;

    if (isNaN(pastDate)) {
      return "Invalid date";
    }

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); // Rough estimate
    const years = Math.floor(days / 365); // Rough estimate

    if (days === 0) {
      if (hours > 0) {
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
      } else if (minutes > 0) {
        return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
      } else {
        return "Just now";
      }
    } else if (days === 1) {
      return "1 day ago";
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (weeks < 5) {
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else if (months < 12) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else {
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }
  }
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
    setAnimateDot(false);
    setNewMessage(false);
    sendReadAllEvent();
  };
  const handleCloseMenu = () => {
    setOpenMenu(false);
    setAnimateDot(false);
    setNewMessage(false);
  };

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      className="notification-message"
    >
      <SoftBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 10px 15px 10px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <SoftTypography variant="h5" fontWeight="bold">
          Notification
        </SoftTypography>
      </SoftBox>

      <SoftBox sx={{ mt: 2, maxHeight: "500px", width: "auto" }}>
        {notificationMessages[notificationMessages?.length - 1]?.notifications?.length > 0 ? (
          notificationMessages[notificationMessages?.length - 1]?.notifications?.map(
            (item, index) => {
              return (
                <React.Fragment key={index}>
                  <NotificationItem
                    color="secondary"
                    image={
                      <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
                        cake
                      </Icon>
                    }
                    title={item?.message}
                    date={timeAgo(item?.created_at)}
                  />
                </React.Fragment>
              );
            }
          )
        ) : (
          <SoftBox
            sx={{ height: "84px", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <SoftTypography variant="p" fontWeight="regular">
              You have no notifications at the moment.
            </SoftTypography>
          </SoftBox>
        )}
      </SoftBox>
    </Menu>
  );

  return (
    <AppBar
      position={pathname !== "/profile" ? "sticky" : "absolute"}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SoftBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs title={route[0]} route={route} light={light} />
        </SoftBox>
        {!isMini && (
          <SoftBox sx={(theme) => navbarRow(theme, { isMini })}>
            <SoftBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size={"small"}
                color={"inherit"}
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
              >
                <Badge
                  color="primary"
                  badgeContent={notificationMessages[notificationMessages?.length - 1]?.count || 0}
                  invisible={notificationMessages[notificationMessages?.length - 1]?.count === 0} // Hide if count is 0
                  className={
                    notificationMessages[notificationMessages?.length - 1]?.count
                      ? "animate-dot"
                      : ""
                  }
                  max={99}
                  size="sm"
                >
                  <Notifications fontSize="medium" className={light ? "text-white" : "text-dark"} />
                </Badge>
              </IconButton>

              {renderMenu()}
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
