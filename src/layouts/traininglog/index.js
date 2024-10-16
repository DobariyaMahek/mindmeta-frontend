import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Table from "examples/Tables/Table";
import SoftBadge from "components/SoftBadge";
import {
  Box,
  Grid,
  Icon,
  IconButton,
  ListItem,
  Modal,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
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
        {" "}
        <Tooltip title="View details" placement="top">
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setOpen(true);
              setSelectedLogs(item);
            }}
            fontSize="1px"
            style={{ fontSize: "18px" }}
          >
            <Visibility />
          </Icon>
        </Tooltip>{" "}
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
          gridTemplateColumns: type == "audio" ? "1fr" : "repeat(auto-fill, minmax(185px, 1fr))",
          gap: "10px",
          padding: "10px",
          textAlign: "center",
        }}
      >
        {file?.map((file, index) => {
          return (
            <Box
              display={"flex"}
              justifyContent={type == "audio" ? "start" : "center"}
              alignItems={"center"}
              key={file} // Ensure 'file.name' is unique
            >
              <ListItem
                sx={{
                  width: "auto",
                  height: type == "audio" ? "auto" : "150px",
                }}
              >
                {/* Render image, video, or audio preview */}
                {type === "image" && (
                  <LazyLoadImage
                    height={"100%"}
                    src={file}
                    alt={type}
                    width={"100%"}
                    placeholderSrc={dummyImage}
                  />
                )}
                {type === "video" && (
                  <video width="100%" height="" controls style={{ width: "100%", height: "100%" }}>
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
          );
        })}
      </Box>
    );
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
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
              <Table columns={TRAINING_LOGS_COLUMNS} rows={currentRows} text={"training"} loader={'familyLoader'} />
            </SoftBox>
          </Card>
        </SoftBox>
        <Grid container spacing={3} marginTop="20px">
          <Grid xs={12} display="flex" justifyContent="end">
            <Pagination
              count={Math.ceil(trainingLogsCount / pageSize)} // Total pages calculated from trainingLogsCount
              page={currentPage} // Current page
              onChange={handlePageChange} // Handle page change
              color="primary"
              // variant="outlined"
              shape="rounded"
            />
          </Grid>
        </Grid>
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

            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,

            textAlign: "center",
            outline: "none",
          }}
        >
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" px={4} py={2}>
            <Typography id="confirm-modal-title" variant="h5">
              View training details
            </Typography>
            <Icon
              aria-label="close"
              onClick={handleClose}
              sx={{
                color: "text.secondary",
                cursor: "pointer",
              }}
            >
              <Close />
            </Icon>
          </SoftBox>

          <SoftBox textAlign="start" sx={{ maxHeight: 600, overflow: "auto", p: 4 }}>
            <Typography variant="h6">Media</Typography>
            {renderMediaPreview(selectedLogs?.file_url, selectedLogs?.file_type)}{" "}
            <Typography variant="h6">Tags</Typography>
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
                padding="3px 8px"
                marginRight="5px"
              >
                <SoftTypography variant="h6" fontSize="14px" color="text">
                  {tag}
                </SoftTypography>
              </SoftBox>
            ))}
            <Typography variant="h6" marginTop={"10px"}>
              Description
            </Typography>
            <Typography fontSize={"14px"}>{selectedLogs?.description}</Typography>{" "}
            <Typography variant="h6" marginTop={"10px"}>
              Instruction
            </Typography>
            <Typography fontSize={"14px"}>{selectedLogs?.instruction}</Typography>
          </SoftBox>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default TrainingLogs;
