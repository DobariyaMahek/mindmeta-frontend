import React from "react";
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import { useSoftUIController } from "context";
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";
import { NavLink } from "react-router-dom";
import SoftTypography from "components/SoftTypography";
import { ExpandLess, ExpandMore, FiberManualRecord } from "@mui/icons-material";

function SidenavCollapse({
  color = "primary",
  icon,
  name,
  collapse,
  active = false,
  onClick,
  isOpen = false,
  ...rest // Using rest to ensure only required props are forwarded
}) {
  const [controller] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;

  return (
    <>
      <ListItem component="li" button onClick={onClick}>
        <SoftBox sx={(theme) => collapseItem(theme, { active, transparentSidenav })}>
          <ListItemIcon
            sx={(theme) => collapseIconBox(theme, { active, transparentSidenav, color })}
          >
            {typeof icon === "string" ? (
              <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon>
          <ListItemText
            primary={name}
            sx={(theme) => collapseText(theme, { miniSidenav, transparentSidenav, active })}
          />
          {collapse && (
            <Icon sx={{ position: "absolute", right: 10 }}>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </Icon>
          )}
        </SoftBox>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {collapse &&
          collapse.map(
            ({ key, name, route, icon, isActive, isShow }) =>
              isShow && (
                <SoftBox key={key} pl={6} display="flex" alignItems="center">
                  <NavLink to={route}>
                    <SoftBox display="flex" alignItems="center">
                      <Icon fontSize="10px" sx={{ fontSize: "10px" }} className="iconSize">
                        <FiberManualRecord
                          sx={{ fontSize: "10px", color: isActive ? "#66b5a3" : "" }}
                        />
                      </Icon>
                      <SoftTypography
                        variant="body2"
                        fontWeight="regular"
                        py={1}
                        pl={1}
                        sx={{ fontSize: "13px", color: isActive ? "#66b5a3" : "" }}
                      >
                        {name}
                      </SoftTypography>
                    </SoftBox>
                  </NavLink>
                </SoftBox>
              )
          )}
      </Collapse>
    </>
  );
}

SidenavCollapse.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  collapse: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      icon: PropTypes.node,
      isActive: PropTypes.bool,
      isShow: PropTypes.bool,
    })
  ),
  active: PropTypes.bool,
  onClick: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default SidenavCollapse;
