import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { Icon, IconButton } from "@mui/material";
import { navbarIconButton } from "examples/Navbars/DashboardNavbar/styles";
import React, { useState } from "react";

const FullScreenDropdown = () => {
  const [isFullScreenMode, setIsFullScreenMode] = useState(true);

  const toggleFullscreen = () => {
    let document = window.document;
    document.body.classList.add("fullscreen-enable");

    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      setIsFullScreenMode(false);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      setIsFullScreenMode(true);
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }

    // handle fullscreen exit
    const exitHandler = () => {
      if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
        document.body.classList.remove("fullscreen-enable");
    };
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
  };
  return (
    <IconButton
      size="large"
      color="inherit"
      sx={navbarIconButton}
      aria-controls="notification-menu"
      aria-haspopup="true"
      onClick={toggleFullscreen}
    >
      {isFullScreenMode ? <Fullscreen fontSize="medium" /> : <FullscreenExit fontSize="medium" />}
    </IconButton>
  );
};

export default FullScreenDropdown;
