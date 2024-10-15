import { Fragment } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Tooltip as MuiTooltip,
  Divider,
} from "@mui/material";
import { Description, Monitor, PhoneInTalk } from "@mui/icons-material";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import { functionGetTime } from "helper/constant";
import { useSelector } from "react-redux";
import moment from "moment";

const CallHistoryDetails = ({ singleHistory, callHistory }) => {
  const messageArr = singleHistory?.transcript;
  const { callDetails } = useSelector((state) => state.family);
  const regex = /(Agent|User):\s+.*?(?=\n[A-Z]|$)/gs;
  const matches = messageArr?.match(regex);
  const messages = matches?.map((match) => {
    const [role, message] = match?.split(": ");
    return { role, message };
  });
  return (
    <Fragment>
      {singleHistory?.id ? (
        <Box>
          <Card variant="outlined" sx={{ padding: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
              <SoftBox display="flex" alignItems="center">
                <Monitor fontSize="small" color="info" />

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
            {callDetails?.length > 0 ? (
              <Box
                sx={{
                  maxHeight: "580px",
                  overflow: "auto",
                }}
              >
                {callDetails?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: item.type !== "bot" ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        padding: 1,
                        borderRadius: 1,
                        backgroundColor: item.type === "bot" ? "#E9ECEF" : "#66b5a32e",
                        color: item.type == "bot" ? "gray" : "#66B5A3",
                        maxWidth: "60%",
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
                            color: item.type === "bot" ? "gray" : "#66B5A3",
                          }}
                        >
                          {item.type}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "12px",
                            textTransform: "capitalize",
                            color: item?.type === "bot" ? "gray" : "#66B5A3",
                            ml: "10px",
                          }}
                        >
                          {moment?.utc(item?.created_at)?.local()?.format("hh:mm A")}
                        </Typography>
                      </SoftBox>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        {item.message}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" align="center">
                No Transcript Records Found
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

export default CallHistoryDetails;
