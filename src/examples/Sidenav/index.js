import React, { useEffect, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import { useSoftUIController, setMiniSidenav } from "context";
import { Box, Modal, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useWebSocketContext } from "api/WebSocketProvider";
import { getSession } from "helper/authHelper";
import { capitalizeValue } from "helper/constant";

function Sidenav({ color = "primary", brand = "", brandName, routes, ...rest }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const [open, setOpen] = useState(false);
  const session = getSession();

  const { notificationSocketRef, chatSocketRef } = useWebSocketContext();

  const handleConfirm = () => {
    if (notificationSocketRef.current) {
      notificationSocketRef.current.close();
    }

    if (chatSocketRef.current) {
      chatSocketRef.current.close();
    }

    localStorage.clear();
    navigate("/authentication/sign-in");
  };

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch]);

  const renderRoutes = routes.map(
    ({
      type,
      name,
      icon,
      title,
      noCollapse,
      key,
      route,
      href,
      collapse,
      isProtected,
      isActive,
      isShow,
      onClick,
      isOpen,
    }) => {
      if (!isProtected || !isShow) return null;
      if (type === "collapse") {
        return href ? (
          <Link
            to={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              color={color}
              name={name}
              icon={icon}
              active={isActive}
              noCollapse={noCollapse}
              collapse={collapse}
              onClick={onClick}
              isOpen={isOpen}
            />
          </Link>
        ) : (
          <NavLink to={route} key={key}>
            <SidenavCollapse
              color={color}
              name={name}
              icon={icon}
              active={isActive}
              noCollapse={noCollapse}
              collapse={collapse}
              onClick={onClick}
              isOpen={isOpen}
            />
          </NavLink>
        );
      } else if (type === "title") {
        return (
          <SoftTypography
            key={key}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            opacity={0.6}
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </SoftTypography>
        );
      } else if (type === "divider") {
        return <Divider key={key} />;
      }

      return null;
    }
  );

  return (
    <SidenavRoot {...rest} variant="permanent" ownerState={{ transparentSidenav, miniSidenav }}>
      <SoftBox pt={3} pb={1} px={4} textAlign="center">
        <SoftBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <SoftTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </SoftTypography>
        </SoftBox>
        <SoftBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <SoftBox component="img" src={brand} alt="Soft UI Logo" width="2rem" />}
          <SoftBox
            width={!brandName && "100%"}
            display="flex"
            flexDirection="column"
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <SoftTypography fontSize="0.875rem" variant="button" fontWeight="medium">
              {brandName}
            </SoftTypography>{" "}
            <SoftTypography fontSize="12px" variant="button" fontWeight="medium" color="secondary">
              {capitalizeValue(session?.role?.replace("_", " "))} -{"   "}
              {session?.role == "patient"
                ? session?.user_info?.first_name + " " + session?.user_info?.last_name
                : session?.role == "family_member"
                ? session?.user_info?.name
                : "Admin"}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <Divider />
      <List>{renderRoutes}</List>
      <SoftBox pt={2} my={2} mx={2} mt="auto">
        <SoftBox mt={2}>
          <SoftButton
            variant="gradient"
            color={color}
            fullWidth
            onClick={() => {
              setOpen(true);
            }}
          >
            Logout
          </SoftButton>
        </SoftBox>
      </SoftBox>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        sx={{ outline: "none" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 1,
            textAlign: "start",
            outline: "none",
          }}
        >
          <SoftBox
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 10px 5px 10px",
            }}
          >
            <Typography id="logout-modal-title" variant="h6" component="h2" gutterBottom>
              Log Out
            </Typography>
            <Icon
              aria-label="close"
              onClick={() => setOpen(false)}
              sx={{
                color: "text.secondary",
              }}
            >
              <Close />
            </Icon>
          </SoftBox>

          <hr />
          <Typography
            id="logout-modal-description"
            variant="body2"
            color="text.secondary"
            mb={3}
            m={2}
          >
            Are you sure you want to log out?
          </Typography>

          <Box sx={{ textAlign: "end" }}>
            <SoftButton
              variant="outlined"
              color={"secondary"}
              onClick={() => setOpen(false)}
              sx={{ mr: 1 }}
            >
              No
            </SoftButton>
            <SoftButton variant="gradient" color={color} onClick={handleConfirm}>
              Yes, I want
            </SoftButton>
          </Box>
        </Box>
      </Modal>
    </SidenavRoot>
  );
}

Sidenav.propTypes = {
  color: PropTypes.string,
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      name: PropTypes.string,
      icon: PropTypes.node,
      title: PropTypes.string,
      noCollapse: PropTypes.bool,
      key: PropTypes.string.isRequired,
      route: PropTypes.string,
      href: PropTypes.string,
      collapse: PropTypes.array,
      isProtected: PropTypes.bool,
    })
  ).isRequired,
};

export default Sidenav;
