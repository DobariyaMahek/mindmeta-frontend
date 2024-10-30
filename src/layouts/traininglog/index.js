import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Table from "examples/Tables/Table";
import { Box, Grid, Icon, ListItem, Modal, Pagination, Tooltip, Typography } from "@mui/material";
import { Clear, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Close from "@mui/icons-material/Close";
import SoftInput from "components/SoftInput";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "helper/useDebounce";
import moment from "moment";
import { TRAINING_LOGS_COLUMNS } from "helper/constant";
import { getTrainingLogs } from "../../redux/ApiSlice/familySlice";
import { LazyLoadImage } from "react-lazy-load-image-component";

function TrainingLogs() {
  document.title = "Mind Meta AI | Training";
  const { trainingLogsCount, familyTrainingLogs, familyLoader } = useSelector(
    (state) => state.family
  );

  const [open, setOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 1000);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [pageSize] = useState(10); // Page limit
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullInstruction, setShowFullInstruction] = useState(false);

  // Character limits for truncation
  const textLimit = 208;

  const toggleDescription = () => setShowFullDescription(!showFullDescription);
  const toggleInstruction = () => setShowFullInstruction(!showFullInstruction);

  const currentRows = familyTrainingLogs.map((item, index) => ({
    sr: (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {index + 1 + (currentPage - 1) * pageSize} {/* Adjust row number based on currentPage */}
      </SoftTypography>
    ),
    "family member name": (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {item?.family_member_name}
      </SoftTypography>
    ),
    email: (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {item?.family_member_email}
      </SoftTypography>
    ),
    "created date": (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {moment?.utc(item?.created_at).format("DD MMM YYYY")}
      </SoftTypography>
    ),
    action: (
      <Box sx={{ gap: "10px", display: "flex" }}>
        <Tooltip title="View details" placement="top">
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setOpen(true);
              setSelectedLogs(item);
              setShowFullDescription(false);
              setShowFullInstruction(false);
            }}
            fontSize="1px"
            style={{ fontSize: "18px" }}
          >
            <Visibility />
          </Icon>
        </Tooltip>
      </Box>
    ),
  }));

  const fetchData = async () => {
    try {
      await dispatch(
        getTrainingLogs({
          name: debounceSearch,
          page: currentPage, // Send current page
          limit: pageSize,
        })
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, [debounceSearch, currentPage, pageSize]);

  const handleClose = () => {
    setOpen(false);
    setSelectedLogs(null);
  };

  const dummyImage =
    "https://img.freepik.com/premium-photo/top-view-abstract-paper-texture-background_225709-2718.jpg";

  const renderMediaPreview = (file, type) => {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: type === "audio" ? "300px" : "repeat(auto-fill, minmax(185px, 1fr))",
          gap: "15px",
          padding: "15px",
          textAlign: "center",
          borderRadius: "12px",
        }}
      >
        {file?.map((file, index) => (
          <Box
            display={"flex"}
            justifyContent={type === "audio" ? "start" : "center"}
            alignItems={"center"}
            key={index}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <ListItem
              sx={{
                width: "auto",
                height: type === "audio" ? "auto" : "150px",
                padding: "0",
              }}
            >
              {type === "image" && (
                <LazyLoadImage
                  height={"100%"}
                  src={file}
                  alt={type}
                  width={"100%"}
                  placeholderSrc={dummyImage}
                  style={{ borderRadius: "12px" }}
                />
              )}
              {type === "video" && (
                <video
                  width="100%"
                  height=""
                  controls
                  style={{ width: "100%", height: "100%", borderRadius: "12px" }}
                >
                  <source src={file} type={"video/mp4"} />
                </video>
              )}
              {type === "audio" && (
                <audio controls>
                  <source src={file} type={"audio/wav"} />
                  Your browser does not support the audio tag.
                </audio>
              )}
            </ListItem>
          </Box>
        ))}
      </Box>
    );
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
  };
  const getTruncatedText = (text, charLimit) => {
    if (text.length > charLimit) {
      return text.substring(0, charLimit) + "...";
    }
    return text;
  };
  return (
    <DashboardLayout>
      <SoftBox py={3}>
        <SoftBox>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Training Logs</SoftTypography>
              <div style={{ position: "relative" }}>
                <SoftInput
                  placeholder="Search by name or email"
                  icon={{
                    component: "search",
                    direction: "left",
                  }}
                  value={search}
                  onChange={(e) => {
                    setSearch(e?.target?.value?.trimStart());
                    setCurrentPage(1);
                  }}
                  style={{
                    paddingRight: "25px",
                  }}
                />
                {search && (
                  <Icon
                    onClick={() => setSearch("")}
                    style={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                      cursor: "pointer",
                    }}
                    fontSize="1px"
                  >
                    <Clear />
                  </Icon>
                )}
              </div>
            </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table
                columns={TRAINING_LOGS_COLUMNS}
                rows={currentRows}
                text={"training"}
                loader={familyLoader}
              />
            </SoftBox>
          </Card>
        </SoftBox>
        {trainingLogsCount > pageSize && !familyLoader && (
          <Grid container spacing={3} marginTop="20px">
            <Grid xs={12} display="flex" justifyContent="end">
              <Pagination
                count={Math.ceil(trainingLogsCount / pageSize)} // Total pages calculated from trainingLogsCount
                page={currentPage} // Current page
                onChange={handlePageChange} // Handle page change
                color="primary"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#ffffff", // Text color for pagination items
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "primary.main", // Primary color for selected page
                    color: "#ffffff", // White text color for selected page
                  },
                }}
              />
            </Grid>
          </Grid>
        )}
      </SoftBox>
      <Modal
        open={open}
        onClose={handleClose}
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
            width: 900,
            bgcolor: "#ffffff",
            borderRadius: 3,
            boxShadow: 24,
            textAlign: "center",
            outline: "none",
          }}
        >
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" px={4} py={2}>
            <Typography id="confirm-modal-title" variant="h5" fontWeight="bold" color="dark">
              View Training Details
            </Typography>
            <Icon
              aria-label="close"
              onClick={handleClose}
              sx={{
                color: "text.secondary",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
            >
              <Close />
            </Icon>
          </SoftBox>

          <SoftBox textAlign="start" sx={{ maxHeight: 600, overflow: "auto", p: 4 }}>
            <Typography variant="h6" color="dark">
              Media
            </Typography>
            {renderMediaPreview(selectedLogs?.file_url, selectedLogs?.file_type)}

            <SoftBox>
              {/* Tags Section */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={1.5}>
                  <Typography variant="h6" color="dark">
                    Tags
                  </Typography>
                </Grid>
                <Grid item>: </Grid>
                <Grid item xs={10}>
                  {(typeof selectedLogs?.tags === "string"
                    ? [selectedLogs?.tags]
                    : selectedLogs?.tags
                  )?.map((tag, index) => (
                    <SoftBox
                      key={index}
                      border="0.0625rem solid #d2d6da"
                      display="inline-flex"
                      alignItems="center"
                      borderRadius="0.5rem"
                      padding="2px 10px"
                      bgcolor="%fff"
                      sx={{
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "primary.main",
                          "& .MuiTypography-root": {
                            color: "#ffffff",
                          },
                        },
                      }}
                    >
                      <SoftTypography variant="h6" fontSize="14px" color="primary">
                        {tag}
                      </SoftTypography>
                    </SoftBox>
                  ))}
                </Grid>
              </Grid>

              {/* Description Section */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={1.5}>
                  <Typography variant="h6" color="dark">
                    Description
                  </Typography>
                </Grid>
                <Grid item>: </Grid>
                <Grid item xs={10}>
                  <Typography fontSize="14px" color="text.secondary">
                    {showFullDescription
                      ? selectedLogs?.description
                      : getTruncatedText(selectedLogs?.description || "", textLimit)}{" "}
                    {selectedLogs?.description?.length > textLimit && (
                      <Typography
                        color={"#000"}
                        fontSize={"12px"}
                        fontWeight={"bold"}
                        sx={{ cursor: "pointer" }}
                        display={"inline"}
                        onClick={toggleDescription}
                      >
                        {showFullDescription ? "Read Less" : "Read More"}
                      </Typography>
                    )}
                  </Typography>
                </Grid>
              </Grid>

              {/* Instruction Section */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={1.5}>
                  <Typography variant="h6" color="dark">
                    Instruction
                  </Typography>
                </Grid>
                <Grid item>: </Grid>
                <Grid item xs={10}>
                  <Typography fontSize="14px" color="text.secondary">
                    {showFullInstruction
                      ? selectedLogs?.instruction
                      : getTruncatedText(selectedLogs?.instruction || "", textLimit)}{" "}
                    {selectedLogs?.instruction?.length > textLimit && (
                      <Typography
                        color={"#000"}
                        fontSize={"12px"}
                        fontWeight={"bold"}
                        sx={{ cursor: "pointer" }}
                        display={"inline"}
                        onClick={toggleInstruction}
                      >
                        {showFullInstruction ? "Read Less" : "Read More"}
                      </Typography>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </SoftBox>
          </SoftBox>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default TrainingLogs;
