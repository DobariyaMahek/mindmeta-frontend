import React, { Fragment } from "react";
import { Box, Typography, Card, Divider, Grid, ListItem } from "@mui/material";
import SoftBox from "components/SoftBox";
import { functionGetTime } from "helper/constant";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useStyles } from "layouts/interaction/chatbot";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MediaDetails = ({ singleHistory, callHistory }) => {
  const { mediaDetails, familyLoader } = useSelector((state) => state.family);
  const classes = useStyles();

  const dummyImage =
    "https://img.freepik.com/premium-photo/top-view-abstract-paper-texture-background_225709-2718.jpg";

  // Aggregate media details by file type
  const aggregatedMedia = mediaDetails.reduce((acc, media) => {
    const { file_type, urls } = media;
    if (!acc[file_type]) {
      acc[file_type] = { file_type, urls: [] };
    }
    acc[file_type].urls.push(...urls);
    return acc;
  }, {});

  const renderMediaPreview = (file, type, index) => {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: type === "audio" ? "1fr" : "repeat(auto-fill, minmax(185px, 1fr))",
          gap: "10px",
          padding: "10px",
          textAlign: "center",
        }}
        key={index}
      >
        {file.urls?.map((url, index) => (
          <Box
            display={"flex"}
            justifyContent={type === "audio" ? "start" : "center"}
            alignItems={"center"}
            key={index} // Ensure 'file.name' is unique
          >
            <ListItem
              sx={{
                width: "auto",
                height: type === "audio" ? "auto" : "150px",
              }}
            >
              {type === "image" && (
                <LazyLoadImage
                  height={"100%"}
                  src={url}
                  alt={type}
                  width={"100%"}
                  placeholderSrc={dummyImage}
                />
              )}
              {type === "video" && (
                <video width="100%" controls style={{ height: "100%" }}>
                  <source src={url} type={"video/mp4"} />
                </video>
              )}
              {type === "audio" && (
                <audio controls>
                  <source src={url} type={"audio/wav"} />
                  Your browser does not support the audio tag.
                </audio>
              )}
            </ListItem>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Fragment>
      {singleHistory?.id ? (
        <Box>
          <Card variant="outlined" sx={{ padding: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
              <SoftBox display="flex" alignItems="center">
                <Typography variant="h6">Call Details</Typography>
              </SoftBox>
            </Box>
            <SoftBox>
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
            <Typography variant="h6">Media</Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.keys(aggregatedMedia).length > 0 && !familyLoader ? (
              <Box
                sx={{
                  maxHeight: "560px",
                  overflow: "auto",
                }}
              >
                {Object.values(aggregatedMedia).map((media, index) => (
                  <Box key={index}>
                    <Typography variant="h6">
                      {media?.file_type?.charAt(0)?.toUpperCase() + media?.file_type?.slice(1)}
                    </Typography>
                    {renderMediaPreview(media, media.file_type, index)}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" align="center">
                {familyLoader
                  ? "Please wait while we load your media..."
                  : "No Media Records Found"}
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
              ? "No Photo Gallery Available"
              : "Please select a call from the list to see the details."}
          </Typography>
        </SoftBox>
      )}
    </Fragment>
  );
};

// Prop validation using PropTypes
MediaDetails.propTypes = {
  singleHistory: PropTypes.shape({
    id: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    transcript: PropTypes.string,
    call_scheduled_title: PropTypes.string,
  }),
  callHistory: PropTypes.arrayOf(
    PropTypes.shape({
      start_time: PropTypes.string.isRequired,
      audio_websocket_protocol: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MediaDetails;
