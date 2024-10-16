import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Table from "examples/Tables/Table";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";
import PropTypes from "prop-types";

// Images for fallback
import fallbackImage from "assets/images/bruce-mars.jpg";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  Modal,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import "./patient.css";
import { PATIENT_LIST_COLUMNS } from "helper/constant";
import SoftButton from "components/SoftButton";
import {
  Cancel,
  CancelOutlined,
  CancelPresentation,
  CancelRounded,
  CancelScheduleSendOutlined,
  ChangeCircleOutlined,
  Chat,
  Clear,
  Delete,
  DeleteOutlined,
  Edit,
  Warning,
  WarningAmber,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Close from "@mui/icons-material/Close";
import SoftInput from "components/SoftInput";
import { deletePatient, GetActivePatientInfo } from "../../redux/ApiSlice/patientSlice";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "helper/useDebounce";
import toast from "react-hot-toast";
import moment from "moment";
import { DELETE_PATIENT } from "helper/constant";

// Function component
function Function({ job, org }) {
  return (
    <SoftBox display="flex" flexDirection="column">
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {job}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        {org}
      </SoftTypography>
    </SoftBox>
  );
}

Function.propTypes = {
  job: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
};

function Patient() {
  document.title = "Mind Meta AI | Patients";
  const { patientInfo, totalPatients } = useSelector((state) => state.patient);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 1000);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [pageSize] = useState(10); // Page limit
  const currentRows = patientInfo.map((item, index) => ({
    sr: (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {index + 1 + (currentPage - 1) * pageSize} {/* Adjust row number based on currentPage */}
      </SoftTypography>
    ),
    "patient name": (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {item?.first_name} {item?.last_name}
      </SoftTypography>
    ),
    email: (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {item?.email}
      </SoftTypography>
    ),
    birthDate: (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {moment?.utc(item?.birthdate).format("DD MMM YYYY")}
      </SoftTypography>
    ),
    "created date": (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {moment?.utc(item?.created_at).format("DD MMM YYYY")}
      </SoftTypography>
    ),
    status: (
      <SoftBadge
        variant="gradient"
        badgeContent={item.is_active === true ? "Active" : "Inactive"}
        color={item.is_active === true ? "info" : "secondary"}
        size="xs"
        container
      />
    ),
    action: (
      <Box sx={{ gap: "10px", display: "flex" }}>
        {" "}
        <Tooltip title="Edit" placement="top">
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate(`/update-patient/${item?.id}`);
            }}
            fontSize="1px"
            style={{ fontSize: "18px" }}
          >
            <Edit />
          </Icon>
        </Tooltip>{" "}
        <Tooltip title="Delete" placement="top">
          <Icon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedPatient(item);
              setOpen(true);
            }}
            fontSize="1px"
            style={{ fontSize: "18px" }}
          >
            <Delete />
          </Icon>
        </Tooltip>
      </Box>
    ),
  }));
  const fetchData = async () => {
    try {
      await dispatch(
        GetActivePatientInfo({
          search: debounceSearch,
          page: currentPage, // Send current page
          limit: pageSize,
        })
      );
    } catch (error) {}
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePatient({ id: selectedPatient?.id })).then((res) => {
      if (res?.payload?.success) {
        toast.success(DELETE_PATIENT);
        setOpen(false);
        setSelectedPatient(null);
        fetchData();
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [debounceSearch, currentPage]);
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
  };
  return (
    <DashboardLayout>
      <SoftBox py={3}>
        <SoftBox>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Patient List</SoftTypography>
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
              <Table columns={PATIENT_LIST_COLUMNS} rows={currentRows} text={"patient"} />
            </SoftBox>
          </Card>
        </SoftBox>
        <Grid container spacing={3} marginTop="20px">
          <Grid xs={12} display="flex" justifyContent="end">
            <Pagination
              count={Math.ceil(totalPatients / pageSize)} // Total pages calculated from totalPatients
              page={currentPage} // Current page
              onChange={handlePageChange} // Handle page change
              color="primary"
              // variant="outlined"
              shape="rounded"
            />
          </Grid>
        </Grid>
      </SoftBox>

      {/* Confirmation Dialog */}
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
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            outline: "none",
          }}
        >
          <Icon
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "text.secondary",
            }}
          >
            <Close />
          </Icon>

          <Typography id="confirm-modal-title" variant="h4" component="h2" gutterBottom>
            Are you sure?
          </Typography>
          <Typography id="confirm-modal-description" variant="body2" color="text.secondary" mb={3}>
            Do you really want to delete this record?
          </Typography>
          <SoftButton variant="outlined" color="secondary" onClick={handleClose} sx={{ mr: 1 }}>
            Cancel
          </SoftButton>
          <SoftButton variant="gradient" color="error" onClick={handleConfirmDelete}>
            Delete
          </SoftButton>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Patient;
