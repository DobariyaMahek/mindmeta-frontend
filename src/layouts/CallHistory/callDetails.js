import React, { Fragment, useEffect, useRef } from "react";
import { Box, Typography, Card, Divider } from "@mui/material";
import SoftBox from "components/SoftBox";
import { functionGetTime } from "helper/constant";
import { useSelector } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import { getDateLabel } from "helper/constant";
import { useStyles } from "layouts/interaction/chatbot";
const CallHistoryDetails = ({ singleHistory, callHistory }) => {
  const messageArr = singleHistory?.transcript;
  const { callDetails, familyLoader } = useSelector((state) => state.family);
  const firstMessageRef = useRef(null); // Create a ref for the first message
  const classes = useStyles();
  // Scroll to the top when the component mounts

  const groupedMessages =
    callDetails &&
    callDetails?.reduce((acc, msg) => {
      const dateLabel = getDateLabel(msg.created_at || new Date());
      if (!acc[dateLabel]) acc[dateLabel] = [];
      acc[dateLabel].push(msg);
      return acc;
    }, {});
  return (
    <Fragment>
      {singleHistory?.id ? (
        <Box>
          <Card variant="outlined" sx={{ padding: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
              <SoftBox display="flex" alignItems="center">
                <Typography variant="h6" marginLeft={"10px"}>
                  Web Call
                </Typography>
              </SoftBox>
            </Box>
            <SoftBox display="flex" alignItems="center" gap={1}>
              <Typography fontSize={"15px"} fontWeight={"bold"}>
                Start Time :
              </Typography>

              <Typography fontSize={"13px"} padding={0}>
                {singleHistory?.start_time ? functionGetTime(singleHistory?.start_time) : "-"}
              </Typography>
            </SoftBox>{" "}
            <SoftBox display="flex" alignItems="center" gap={1}>
              <Typography fontSize={"15px"} fontWeight={"bold"}>
                End Time :
              </Typography>

              <Typography fontSize={"13px"} padding={0}>
                {singleHistory?.end_time ? functionGetTime(singleHistory?.end_time) : "-"}
              </Typography>
            </SoftBox>
          </Card>

          <Card variant="outlined" sx={{ padding: 2 }}>
            <Typography variant="h6">Messages</Typography>
            <Divider sx={{ mb: 2 }} />
            {callDetails?.length > 0 && !familyLoader ? (
              <Box
                sx={{
                  maxHeight: "580px",
                  overflow: "auto",
                }}
              >
                {groupedMessages &&
                  !familyLoader &&
                  Object.keys(groupedMessages).map((dateLabel, index) => (
                    <React.Fragment key={index}>
                      <SoftBox className={classes.stickyHeader} sx={{ backgroundColor: "#fff" }}>
                        <Typography
                          variant="p"
                          onClick={() => {
                            const element = document.getElementById(dateLabel);
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className={classes.stickyHeaderText}
                        >
                          {dateLabel}
                        </Typography>
                      </SoftBox>
                      <Box id={dateLabel}>
                        {groupedMessages[dateLabel] &&
                          dateLabel &&
                          groupedMessages[dateLabel]?.map((msg, idx) => {
                            return (
                              <Box
                                key={msg.id}
                                sx={{
                                  display: "flex",
                                  justifyContent: msg.type === "bot" ? "flex-start" : "flex-end",
                                  marginBottom: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    backgroundColor: msg.type === "bot" ? "#E9ECEF" : "#66b5a32e",
                                    color: msg.type === "bot" ? "gray" : "#66B5A3",
                                    borderRadius:
                                      msg.type === "bot"
                                        ? "0px 10px 10px 10px"
                                        : "10px 0px 10px 10px",
                                    padding: 1,
                                    wordBreak: "break-word",
                                    minWidth: "8%",
                                    maxWidth: {
                                      xs: "90%",
                                      sm: "80%",
                                      md: "70%",
                                      lg: "40%",
                                    },
                                  }}
                                >
                                  <SoftBox
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textTransform: "capitalize",
                                        color: msg.type === "bot" ? "gray" : "#66B5A3",
                                      }}
                                    >
                                      {msg.type}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontSize: "12px",
                                        textTransform: "capitalize",
                                        color: msg?.type === "bot" ? "gray" : "#66B5A3",
                                        ml: "10px",
                                      }}
                                    >
                                      {moment?.utc(msg?.created_at)?.local()?.format("hh:mm A")}
                                    </Typography>
                                  </SoftBox>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    {msg.message}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })}
                      </Box>
                    </React.Fragment>
                  ))}
              </Box>
            ) : (
              <Typography variant="body2" align="center">
                {familyLoader
                  ? "Please wait while we load your messages..."
                  : "No Transcript Records Found"}
              </Typography>
            )}
          </Card>
        </Box>
      ) : (
        <SoftBox
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" align="center">
            {!callHistory?.length
              ? "No Call History Available"
              : "Please select a call from the list to see the details."}
          </Typography>
        </SoftBox>
      )}
    </Fragment>
  );
};

// Prop validation using PropTypes
CallHistoryDetails.propTypes = {
  singleHistory: PropTypes.shape({
    id: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
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

export default CallHistoryDetails;
