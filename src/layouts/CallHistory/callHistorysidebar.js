import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Divider, IconButton, Card } from "@mui/material";
import { Call, PhoneInTalk } from "@mui/icons-material";
import { functionGetTime } from "helper/constant";
import toast from "react-hot-toast";
import { SOMETHING_WRONG } from "helper/constant";
import { useDispatch } from "react-redux";
import { GetCallDetails, setCallDetails } from "../../redux/ApiSlice/familySlice";

export default function SidebarCallHistory({ setHistoryState, singleHistory, callHistory }) {
  const dispatch = useDispatch();

  return (
    <Card
      sx={{
        width: " 100%",
        height: '86vh',
        overflow: "auto",
        padding: 1,
      }}
    >
      <Typography variant="h6" align="center" gutterBottom color="#fff">
        Call History
      </Typography>
      <Divider light />

      <Box sx={{ padding: 1 }}>
        {callHistory?.length ? (
          callHistory.map((obj, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 1,
                  backgroundColor: singleHistory?.id === obj?.id ? "#e8078d2e" : "transparent",
                  cursor: "pointer",
                  color: singleHistory?.id !== obj?.id ? "#fff" : "#e8078d",
                  borderRadius: 3,
                  "&:hover": {
                    backgroundColor: "#e8078d2e",
                    color: "#e8078d",
                    "& .MuiSvgIcon-root": {
                      color: "#e8078d", // Change icon color when hovering over the Box
                    },
                  },
                  marginBottom: "5px",
                  overflow: "hidden",
                }}
                onClick={() => {
                  setHistoryState(obj);
                  if (obj?.id != singleHistory?.id) {
                    dispatch(setCallDetails([]));
                  }
                }}
              >
                <IconButton
                  sx={{
                    color: singleHistory?.id !== obj?.id ? "light.main" : "info.main",
                  }}
                >
                  <Call fontSize="small" />
                </IconButton>

                <Box sx={{ marginLeft: 1 }}>
                  {/* <Typography fontSize={"15px"} fontWeight={"bold"}>
                    Web Call
                  </Typography>{" "} */}
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 1, // Change this number to set how many lines to show
                      maxHeight: "40px", // Adjust based on your line height
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {obj?.call_scheduled_title}
                  </Typography>
                  <Typography fontSize={"13px"} padding={0}>
                    {functionGetTime(obj?.start_time)}
                  </Typography>
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography
            variant="body2"
            align="center"
            color="#fff"
            sx={{ marginTop: 1, marginBottom: 1 }}
          >
            No Records Found
          </Typography>
        )}
      </Box>
    </Card>
  );
}

// Prop validation using PropTypes
SidebarCallHistory.propTypes = {
  setHistoryState: PropTypes.func.isRequired,
  singleHistory: PropTypes.shape({
    id: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    audio_websocket_protocol: PropTypes.string,
    public_log_url: PropTypes.string,
    transcript: PropTypes.string,
  }),
  callHistory: PropTypes.arrayOf(
    PropTypes.shape({
      start_time: PropTypes.string.isRequired,
      audio_websocket_protocol: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};
