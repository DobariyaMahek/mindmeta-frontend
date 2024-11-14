import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; // MUI ICON COMPONENT

import { useFormik } from "formik";
import * as Yup from "yup"; // CUSTOM COMPONENTS

import FlexBox from "@/components/flexbox/FlexBox";
import { H6 } from "@/components/typography";
import { useState } from "react";
export default function InstructionPageView() {
  const DATA = [
    "Screenshots/Screen Recording is very helpful.",
    "You can use snipboard.io to share screenshots.",
    "And loom.com for screen recording.",
  ];
  const validationSchema = Yup.object({
    tags: Yup.string().required("Tags is Required!"),
  });
  const initialValues = {
    tags: "",
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: () => {},
    });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {},
  });

  const [tagsList, setTagsList] = useState([]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event.target.value.trim()) {
      event.preventDefault();
      setTagsList((prevTags) => [...prevTags, event.target.value]);
      formik.setFieldValue("tags", "");
    }
  };

  const removeTag = (indexToRemove) => {
    setTagsList((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
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
          Instruction
        </H6>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item size={12}>
              <TextField
                fullWidth
                name="tags"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                onKeyPress={handleKeyPress}
                value={formik.values.tags}
                placeholder="Tags*"
                helperText={formik.touched.tags && formik.errors.tags}
                error={Boolean(formik.touched.tags && formik.errors.tags)}
              />

              <Grid item xs={12} mt={2}>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {tagsList.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(index)}
                      deleteIcon={<CloseIcon />}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Grid size={12}>
              <TextField
                multiline
                rows={6}
                fullWidth
                placeholder="Instruction*"
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
          </Grid>
        </form>
      </Card>
    </Box>
  );
}
