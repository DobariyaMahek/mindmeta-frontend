import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import IconButton from "@mui/material/IconButton";
import { Close, CloudUpload, Delete } from "@mui/icons-material";
import { Box, Icon, List, ListItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { capitalizeValue } from "helper/constant";
import { useSoftUIController } from "context";
import toast from "react-hot-toast";
import { FILE_TYPE } from "helper/constant";
import { useDispatch } from "react-redux";
import { uploadMediaInstruction } from "../../redux/ApiSlice/familySlice";

function MediaInteraction() {
  const [controller] = useSoftUIController();
  const { sidenavColor } = controller;
  const navigate = useNavigate();

  const [media, setMedia] = useState({
    image: [],
    audio: [],
    video: [],
  });
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [instructions, setInstructions] = useState("");
  const [fileType, setFileType] = useState("image");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const mediaTypes = {
    image: { label: "Upload Photos", accept: "image/*", icon: <CloudUpload fontSize="large" /> },
    audio: { label: "Upload Sounds", accept: "audio/*", icon: <CloudUpload fontSize="large" /> },
    video: { label: "Upload Movies", accept: "video/*", icon: <CloudUpload fontSize="large" /> },
  };

  // Validation checks for description, tags, and instructions
  const validateField = (field, value) => {
    if (!value || !value?.length) {
      return `${capitalizeValue(field)} is required`;
    }
    return "";
  };

  const validateFields = () => {
    const newErrors = {
      description: validateField("description", description),
      tags: tags.length === 0 ? "Tags is required" : "",
      instructions: validateField("instructions", instructions),
      media: validateField("media", media[fileType]),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleMediaChange = (event, type) => {
    const newMedia = Array.from(event.target.files);
    const validTypes = {
      image: ["image/jpeg", "image/png", "image/gif"],
      audio: ["audio/mpeg", "audio/wav"],
      video: ["video/mp4", "video/mkv"],
    };

    const invalidFiles = newMedia?.filter((file) => !validTypes[type].includes(file.type));
    if (invalidFiles.length > 0) {
      setErrors({
        ...errors,
        media: `Invalid file type for ${type}`,
      });
      return;
    }

    setMedia((prev) => ({
      ...prev,
      [type]: [...prev[type], ...newMedia],
    }));
    setErrors((prev) => ({ ...prev, media: "" }));
  };

  const removeMedia = (type, index) => {
    setMedia((prev) => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index),
    }));
  };

  const handleTagInput = (e) => {
    const newTag = capitalizeValue(e.target.value.trimStart());
    setTagInput(newTag);

    if (tags?.includes(newTag)) {
      setErrors((prev) => ({ ...prev, tags: "This tag already exists" }));
    } else {
      setErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
      setErrors((prev) => ({ ...prev, tags: "" }));
    }
  };
  const renderMediaPreview = (file, type, index) => {
    const fileUrl = URL.createObjectURL(file);
    const fileSize = (file.size / 1024).toFixed(2) + " KB";

    return (
      <ListItem
        key={file.name}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          backgroundColor: "#ffffff",
          position: "relative", // For absolute positioning of delete icon
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
          },
          width: "100%",
          height: "auto",
        }}
      >
        <SoftBox
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "180px",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "16px",
            backgroundColor: "#f4f4f4", // Subtle background color for empty space
            position: "relative", // For the hover effect on the image/video
            "&:hover .delete-icon": {
              opacity: 1, // Show the delete icon on hover
            },
          }}
        >
          {/* Render image, video, or audio preview */}
          {type === "image" && (
            <img
              src={fileUrl}
              alt={file.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
          {type === "video" && (
            <video width="100%" height="100%" controls>
              <source src={fileUrl} type={file.type} />
              Your browser does not support the video tag.
            </video>
          )}
          {type === "audio" && (
            <audio controls style={{ width: "100%" }}>
              <source src={fileUrl} type={file.type} />
              Your browser does not support the audio tag.
            </audio>
          )}

          {/* Overlay with delete bin icon */}
          <Box
            className="delete-icon"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0,
              transition: "opacity 0.3s ease",
              cursor: "pointer", // Make it clickable
            }}
            onClick={() => removeMedia(type, index)}
          >
            <Delete
              sx={{
                color: "#fff", // White bin icon
                fontSize: "40px",
              }}
            />
          </Box>
        </SoftBox>

        {/* File Info */}
        <SoftBox sx={{ width: "100%", textAlign: "center", marginBottom: "8px" }}>
          <Typography
            variant="h6"
            color="primary.main"
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap", // Prevent text from wrapping to the next line
              maxWidth: "100%", // Make sure it doesn’t overflow its container
            }}
          >
            {file.name}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Size: {fileSize} | Type: {file.type}
          </Typography>
        </SoftBox>
      </ListItem>
    );
  };

  // Render the upload section for each type of media
  const renderUploadSection = (type) => (
    <>
      <Grid item xs={12} >
        <Box
          sx={{
            border: "2px dashed #90caf9",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#f1f5f9",
          }}
        >
          <IconButton
            color="primary"
            component="label"
            sx={{
              backgroundColor: "#e3f2fd",
              marginBottom: "10px",
              "&:hover": { backgroundColor: "#bbdefb" },
            }}
          >
            {mediaTypes[type].icon}
            <input
              type="file"
              accept={mediaTypes[type].accept}
              hidden
              onChange={(e) => handleMediaChange(e, type)}
            />
          </IconButton>

          <Typography variant="h6" color="textSecondary">
            {mediaTypes[type].label}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Supports: {mediaTypes[type].accept.replace(/\*/g, "").toUpperCase()}
          </Typography>

          {/* Media Preview */}
        </Box>
        {errors.media && <span className="error">{errors.media}</span>}
      </Grid>
      <Grid container spacing={3} sx={{ marginTop: "5px", padding: "10px" }}>
        {media[type].map((file, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            {renderMediaPreview(file, type, index)}
          </Grid>
        ))}
      </Grid>
    </>
  );
  const clearState = () => {
    setMedia({ image: [], audio: [], video: [] });
    setDescription("");
    setTags([]);
    setTagInput("");
    setInstructions("");
    setFileType("image");
    setErrors({});
  };
  const handleSubmit = () => {
    if (validateFields()) {
      const formData = new FormData();
      formData.append("file_type", fileType);

      media[fileType]?.map((item, i) => {
        return formData.append(`files`, item);
      });
      tags?.map((item, i) => {
        return formData.append(`tags`, item);
      });
      formData.append("description", description);
      formData.append("instruction", instructions);
      dispatch(uploadMediaInstruction(formData)).then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          clearState();
        }
      });
    }
  };

  return (
    <DashboardLayout>
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" gutterBottom>
                  Media
                </SoftTypography>
                <Grid mb={1}>
                  {" "}
                  <label>
                    File Type<span>*</span>{" "}
                  </label>
                  <select
                    name="fileType "
                    className="relation-dropdown"
                    value={fileType}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setFileType(value);
                      setMedia({ image: [], audio: [], video: [] });
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",

                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select Relation</option>
                    {FILE_TYPE &&
                      FILE_TYPE?.map((item, i) => (
                        <option value={item} key={i}>
                          {item}
                        </option>
                      ))}
                  </select>
                </Grid>
                <Grid container spacing={2}>
                  {fileType === "image" && renderUploadSection("image")}
                  {fileType === "audio" && renderUploadSection("audio")}
                  {fileType === "video" && renderUploadSection("video")}
                </Grid>
              </SoftBox>
            </Card>{" "}
            <Card sx={{ marginTop: "20px" }}>
              <SoftBox p={3}>
                <SoftTypography variant="h6" gutterBottom>
                  Instruction
                </SoftTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <label>
                      Tags <span>*</span>
                    </label>
                    <SoftInput
                      fullWidth
                      value={tagInput}
                      onChange={handleTagInput}
                      onKeyDown={handleTagKeyDown}
                      error={Boolean(errors.tags)}
                      placeholder="Enter tag name and press the enter key"
                    />
                    <div className="tags-preview">
                      {tags.map((tag, index) => (
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
                          <Icon
                            onClick={() => setTags([...tags?.filter((_, i) => i !== index)])}
                            sx={{ marginLeft: "6px", cursor: "pointer" }}
                          >
                            <Close fontSize="small" />
                          </Icon>
                        </SoftBox>
                      ))}
                    </div>
                    {errors.tags && <span className="error">{errors.tags}</span>}
                  </Grid>
                  <Grid item xs={12}>
                    <label>
                      Description <span>*</span>
                    </label>
                    <SoftInput
                      fullWidth
                      multiline
                      rows={6}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                      placeholder="Enter description"
                      error={Boolean(errors.description)}
                    />
                    {errors.description && <span className="error">{errors.description}</span>}
                  </Grid>{" "}
                  <Grid item xs={12}>
                    <label>
                      Instructions <span>*</span>
                    </label>
                    <SoftInput
                      fullWidth
                      multiline
                      rows={6}
                      value={instructions}
                      onChange={(e) => {
                        setInstructions(e.target.value);
                        setErrors((prev) => ({ ...prev, instructions: "" }));
                      }}
                      placeholder="Enter instruction"
                      error={Boolean(errors.instructions)}
                    />
                    {errors.instructions && <span className="error">{errors.instructions}</span>}
                  </Grid>
                </Grid>
              </SoftBox>
            </Card>
            {/* Action buttons */}
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="start"
              gap="10px"
              sx={{ marginTop: "20px" }}
            >
              <SoftButton variant="gradient" color="secondary" onClick={() => clearState()}>
                Clear
              </SoftButton>
              <SoftButton variant="gradient" color={sidenavColor} onClick={handleSubmit}>
                Save
              </SoftButton>
            </Grid>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
}

export default MediaInteraction;
