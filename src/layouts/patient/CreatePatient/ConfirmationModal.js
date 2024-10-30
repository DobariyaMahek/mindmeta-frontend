import { Close } from "@mui/icons-material";
import { Box, Icon, Modal, Typography } from "@mui/material";
import SoftButton from "components/SoftButton";
import React from "react";
import PropTypes from "prop-types";

const ConfirmationModal = ({ deleteConfirmation, setDeleteConfirmation, deleteFamilyMember }) => {
  return (
    <Modal
      open={deleteConfirmation}
      onClose={() => setDeleteConfirmation(false)}
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
          onClick={() => setDeleteConfirmation(false)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "text.secondary",
            cursor: "pointer",
          }}
        >
          <Close />
        </Icon>

        <Typography id="confirm-modal-title" variant="h4" component="h2" gutterBottom>
          Are you sure?
        </Typography>
        <Typography id="confirm-modal-description" variant="body2" color="text.secondary" mb={3}>
          Do you really want to delete this member?
        </Typography>
        <SoftButton
          variant="outlined"
          color="secondary"
          onClick={() => setDeleteConfirmation(false)}
          sx={{ mr: 1 }}
        >
          Cancel
        </SoftButton>
        <SoftButton variant="gradient" color="error" onClick={deleteFamilyMember}>
          Delete
        </SoftButton>
      </Box>
    </Modal>
  );
};
ConfirmationModal.propTypes = {
  deleteConfirmation: PropTypes.bool.isRequired,
  setDeleteConfirmation: PropTypes.func.isRequired,
  deleteFamilyMember: PropTypes.func.isRequired,
};

export default ConfirmationModal;
