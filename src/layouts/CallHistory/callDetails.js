import React, { Fragment, useEffect, useRef, useState } from "react";
import { Box, Typography, Card, Divider, Grid, Icon, Tooltip, Modal } from "@mui/material";
import SoftBox from "components/SoftBox";
import { functionGetTime } from "helper/constant";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import { getDateLabel } from "helper/constant";
import { useStyles } from "layouts/interaction/chatbot";
import InfiniteScroll from "react-infinite-scroll-component";
import { GetCallDetails } from "../../redux/ApiSlice/familySlice";
import Expressions from "layouts/Call/Expressions";
import { Close, EqualizerOutlined } from "@mui/icons-material";
import SoftTypography from "components/SoftTypography";
import CallEmotionChart from "./CallEmotionChart";
import { isEmpty } from "helper/constant";
import { GetCallChartData } from "../../redux/ApiSlice/patientSlice";

const CallHistoryDetails = ({ singleHistory, callHistory }) => {
  const dispatch = useDispatch();
  const { callDetails, familyLoader, callDetailsPageCount } = useSelector((state) => state.family);
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true); // To check if more data is available
  const firstMessageRef = useRef(null); // Ref for the first message
  const classes = useStyles();
  const [openChat, setOpenChat] = useState(false);
  const { chartLoader, chartData } = useSelector((state) => state.patient);

  // Function to fetch call details for a particular page
  const handleGetCallDetails = async (obj, pageNumber = 1) => {
    await dispatch(GetCallDetails({ id: obj?.id, page: pageNumber })).then((res) => {
      if (res?.payload?.success) {
        // Stop loading more pages when no more pages left
        if (pageNumber >= res?.payload?.page_count) {
          setHasMore(false);
        }
      } else {
        toast.error(res?.payload?.detail || res?.payload?.message || "Something went wrong.");
      }
    });
  };

  // Load more messages when user scrolls down
  const loadMoreMessages = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleGetCallDetails(singleHistory, nextPage);
  };

  // Group messages by date
  const groupedMessages =
    callDetails &&
    callDetails.reduce((acc, msg) => {
      const dateLabel = getDateLabel(msg.created_at || new Date());
      if (!acc[dateLabel]) acc[dateLabel] = [];
      acc[dateLabel].push(msg);
      return acc;
    }, {});
  const handleFetchData = (id) => {
    dispatch(GetCallChartData(id));
  };
  // Fetch the initial page of call details on component mount
  useEffect(() => {
    if (singleHistory?.id) {
      handleGetCallDetails(singleHistory, 1);
    }
  }, [singleHistory?.id]);

  return (
    <Fragment>
      {singleHistory?.id ? (
        <Box>
          <Card variant="outlined" sx={{ padding: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <SoftBox display="flex" alignItems="center">
                <Typography variant="h6" color="#fff">
                  Call Details
                </Typography>
              </SoftBox>{" "}
              <Tooltip title="Overview" placement="top">
                <Icon
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setOpenChat(true);
                    handleFetchData(singleHistory?.id);
                  }}
                >
                  <EqualizerOutlined color="#fff" />
                </Icon>
              </Tooltip>
            </Box>
            <Divider light />
            <SoftBox color="#fff">
              <Grid container spacing={1}>
                <Grid item xs={1}>
                  <Typography fontSize="14px" fontWeight={"bold"}>
                    Title
                  </Typography>
                </Grid>
                <Grid item xs={11}>
                  <Typography fontSize="14px">
                    : &nbsp;
                    {singleHistory?.call_scheduled_title}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={1}>
                  <Typography fontSize="14px" fontWeight={"bold"}>
                    Start Time
                  </Typography>
                </Grid>
                <Grid item xs={11}>
                  <Typography fontSize="14px">
                    : &nbsp;
                    {singleHistory?.start_time ? functionGetTime(singleHistory?.start_time) : "-"}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={1}>
                  <Typography fontSize="14px" fontWeight={"bold"}>
                    End Time
                  </Typography>
                </Grid>
                <Grid item xs={11}>
                  <Typography fontSize="14px">
                    : &nbsp;
                    {singleHistory?.end_time ? functionGetTime(singleHistory?.end_time) : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </SoftBox>
          </Card>

          <Card variant="outlined" sx={{ padding: 2 }}>
            <Typography variant="h6" color="#fff">
              Messages
            </Typography>
            <Divider light />
            {callDetails?.length > 0 && !familyLoader ? (
              <Box sx={{ maxHeight: "555px", overflow: "auto" }} id="scrollableDiv">
                <InfiniteScroll
                  dataLength={callDetails.length} // Length of current callDetails array
                  next={loadMoreMessages} // Function to load more messages
                  hasMore={hasMore} // Whether more data is available
                  loader={""}
                  scrollableTarget="scrollableDiv"
                  endMessage={""}
                >
                  {groupedMessages &&
                    Object.keys(groupedMessages).map((dateLabel, index) => (
                      <Fragment key={index}>
                        <SoftBox
                          className={classes.stickyHeader}
                          sx={{ backgroundColor: "#110c17" }}
                        >
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
                          {groupedMessages[dateLabel]?.map((msg) => (
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
                                  backgroundColor: msg.type === "bot" ? "gray" : "#e8078d2e",
                                  color: "#fff",
                                  borderRadius:
                                    msg.type === "bot"
                                      ? "0px 10px 10px 10px"
                                      : "10px 0px 10px 10px",
                                  padding: 1,
                                  wordBreak: "break-word",
                                  minWidth: "8%",
                                  maxWidth: {
                                    md: "70%",
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
                                      color: "#fff",
                                    }}
                                  >
                                    {msg.type}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontSize: "12px",
                                      textTransform: "capitalize",
                                      color: "#fff",
                                      ml: "10px",
                                    }}
                                  >
                                    {moment.utc(msg?.created_at)?.local()?.format("hh:mm A")}
                                  </Typography>
                                </SoftBox>
                                {msg?.type !== "bot" && <Divider light />}
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontSize: "14px",
                                  }}
                                >
                                  {msg.message}
                                </Typography>
                                {msg?.emotion_features && (
                                  <Expressions values={msg?.emotion_features} />
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Fragment>
                    ))}
                </InfiniteScroll>
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
      <Modal
        open={openChat}
        onClose={() => {
          setOpenChat(false);
        }}
        aria-labelledby="overview-modal-title"
        sx={{ outline: "none" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70rem",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <SoftBox
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography id="logout-modal-title" variant="h6" component="h2" gutterBottom>
              Overview
            </Typography>
            <Icon
              aria-label="close"
              onClick={() => {
                setOpenChat(false);
              }}
              sx={{ cursor: "pointer" }}
            >
              <Close />
            </Icon>
          </SoftBox>

          <SoftBox
            height="100%"
            marginTop="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex="column"
          >
            {chartLoader ? (
              <SoftTypography variant="button" color="text">
                Loading data...
              </SoftTypography>
            ) : !chartData || Object.keys(chartData)?.length === 0 ? (
              <SoftTypography variant="button" color="text">
                No record found for this call
              </SoftTypography>
            ) : !isEmpty(chartData) && Object.keys(chartData).length > 0 ? (
              <CallEmotionChart data={chartData} />
            ) : (
              ""
            )}
          </SoftBox>
        </Box>
      </Modal>
    </Fragment>
  );
};

// Prop validation using PropTypes
CallHistoryDetails.propTypes = {
  singleHistory: PropTypes.shape({
    id: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    call_scheduled_title: PropTypes.string,
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
