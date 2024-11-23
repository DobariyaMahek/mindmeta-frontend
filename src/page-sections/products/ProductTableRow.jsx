import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // MUI
import Button from "@mui/material/Button"; // Import MUI Button

import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell"; // MUI ICON COMPONENTS

import Edit from "@mui/icons-material/Edit";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import DeleteOutline from "@mui/icons-material/DeleteOutline"; // CUSTOM COMPONENTS

import FlexBox from "@/components/flexbox/FlexBox";
import { Paragraph } from "@/components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "@/components/table"; // ==============================================================

// ==============================================================
export default function ProductTableRow({
  product,
  handleButtonClick,
  isSelected,
  handleSelectRow,
  handleDeleteProduct,
}) {
  // Format the date
  const options = {
    weekday: "short", // Fri
    month: "short", // Nov
    day: "numeric", // 22
    hour: "numeric", // 1
    minute: "2-digit", // 03
    hour12: true, // AM/PM format
  };

  console.log(`productproduct`, product);
  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuEl(event.currentTarget);
  };

  const handleCloseOpenMenu = () => setOpenMenuEl(null);

  return (
    <TableRow hover>
      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar
            variant="rounded"
            alt={product?.name}
            src={product?.image}
            sx={{
              width: 50,
              height: 50,
            }}
          />

          <div>
            <Paragraph
              fontWeight={500}
              color="text.primary"
              sx={{
                ":hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              {product.patient.first_name} {product.patient.last_name}
            </Paragraph>
            <Paragraph fontSize={13}>{product.category}</Paragraph>
          </div>
        </FlexBox>
      </TableCell>
      <TableCell padding="normal">
        <Paragraph
          fontWeight={500}
          color="text.primary"
          sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          {product.title}
        </Paragraph>
      </TableCell>
      <TableCell padding="normal">
        <Paragraph
          fontWeight={500}
          color="text.primary"
          sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          {Math.floor(product.call_duration)} minutes
        </Paragraph>
      </TableCell>
      <TableCell padding="normal">
        <Paragraph
          fontWeight={500}
          color="text.primary"
          sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          {new Date(product?.call_time).toLocaleString("en-US", options)}
        </Paragraph>
      </TableCell>
      <TableCell padding="normal">
        <TableMoreMenu
          open={openMenuEl}
          handleOpen={handleOpenMenu}
          handleClose={handleCloseOpenMenu}
        >
          <TableMoreMenuItem
            Icon={RemoveRedEye}
            title="View"
            handleClick={() => {
              handleButtonClick(product);
            }}
          />
        </TableMoreMenu>
      </TableCell>
    </TableRow>
  );
}
