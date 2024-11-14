import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { useFormik } from "formik";
import * as Yup from "yup";
import DropZone from "@/components/dropzone";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { useState } from "react";

export default function CreateTicketPageView() {
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is Required!"),
    lastName: Yup.string().required("Last Name is Required!"),
    email: Yup.string().email().required("Email is Required!"),
    phone: Yup.string().min(9).required("Phone is required!"),
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    phone: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: () => {},
    });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedType, setSelectedType] = useState("image"); // State for selected file type

  // Handle file type selection
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setUploadedFiles([]); // Clear uploaded files if type changes
  };

  // Determine accepted file types based on the selectedType
  const getAcceptedFileTypes = () => {
    switch (selectedType) {
      case "image":
        return "image/*";
      case "audio":
        return "audio/*";
      case "video":
        return "video/*";
      default:
        return "";
    }
  };

  // Handle file drop event
  const handleDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter((file) =>
      file.type.startsWith(selectedType)
    );

    if (filteredFiles.length === acceptedFiles.length) {
      setUploadedFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
    } else {
      alert(`Please upload only ${selectedType} files.`);
    }
  };

  // Handle file deletion
  const handleDelete = (fileIndex) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );
  };

  // Handle file download
  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box py={3}>
      <Card
        sx={{
          p: 3,
          maxWidth: 900,
          margin: "auto",
        }}
      >
        <H6 fontSize={18} mb={3}>
          Media
        </H6>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                select
                fullWidth
                value={selectedType}
                onChange={handleTypeChange}
                slotProps={{
                  select: {
                    native: true,
                    IconComponent: KeyboardArrowDown,
                  },
                }}
              >
                <option value="image">Image</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </TextField>
              <Grid size={12} mt={2}>
                <DropZone onDrop={handleDrop} accept={getAcceptedFileTypes()} />
              </Grid>
            </Grid>

            <Grid size={12}>
              <TextField
                multiline
                rows={6}
                fullWidth
                placeholder="Description*"
              />
            </Grid>

            <Grid size={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button type="submit">Submit</Button>
                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
              </FlexBox>
            </Grid>

            {/* Display uploaded files with preview, download, and delete options */}
            <Grid item size={12} xs={12} mt={3}>
              <H6 fontSize={16} mb={1}>
                Uploaded Files
              </H6>
              {uploadedFiles.length > 0 ? (
                <div className="uploading-things-main">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="uploading-things-box">
                      {/* Display preview and file details */}
                      {file.type.startsWith("image") && (
                        <Box>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                          />
                        </Box>
                      )}
                      {file.type.startsWith("audio") && (
                        <Box>
                          <audio controls>
                            <source
                              src={URL.createObjectURL(file)}
                              type={file.type}
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </Box>
                      )}
                      {file.type.startsWith("video") && (
                        <Box>
                          <video width="200" height="auto" controls>
                            <source
                              src={URL.createObjectURL(file)}
                              type={file.type}
                            />
                            Your browser does not support the video element.
                          </video>
                        </Box>
                      )}
                      <div className="uploaded-things-description">
                        <div>
                          <Paragraph>Name: {file.name}</Paragraph>
                          <Paragraph>Type: {file.type}</Paragraph>
                          <Paragraph>
                            Size: {(file.size / 1024).toFixed(2)} KB
                          </Paragraph>
                        </div>
                        <div className="uploaded-things-delete-and-download-icon-main">
                          <div
                            className="delete-icon"
                            onClick={() => handleDelete(index)}
                            color="secondary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="800px"
                              height="800px"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M10 12V17"
                                stroke="#000000"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M14 12V17"
                                stroke="#000000"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M4 7H20"
                                stroke="#000000"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                                stroke="#000000"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                                stroke="#000000"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                          <div
                            className="download-icon"
                            onClick={() => handleDownload(file)}
                            color="primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="800px"
                              height="800px"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                opacity="0.5"
                                d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                                stroke="#1C274C"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
                                stroke="#1C274C"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                          {/* <Button
                            onClick={() => handleDownload(file)}
                            color="primary"
                          >
                            Download
                          </Button>
                          <Button
                            onClick={() => handleDelete(index)}
                            color="secondary"
                          >
                            Delete
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Paragraph>No files uploaded yet.</Paragraph>
              )}
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
}
