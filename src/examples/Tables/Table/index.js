import { useMemo } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Box, Table as MuiTable, Paper, Typography } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import SoftBox from "components/SoftBox";
import SoftAvatar from "components/SoftAvatar";
import SoftTypography from "components/SoftTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";
import { position } from "stylis";
import zIndex from "@mui/material/styles/zIndex";

function Table({ columns, rows, text, loader }) {
  const { secondary, light } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;

  const renderColumns = columns.map(({ name, align, width }, key) => {
    let pl;
    let pr;

    if (key === 0) {
      pl = 3;
      pr = 3;
    } else if (key === columns.length - 1) {
      pl = 3;
      pr = 3;
    } else {
      pl = 1;
      pr = 1;
    }

    return (
      <SoftBox
        key={name}
        component="th"
        width={width || "auto"}
        pt={2}
        pb={2}
        pl={align === "left" ? pl : 3}
        pr={align === "right" ? pr : 3}
        textAlign={align}
        fontSize={size.xxs}
        fontWeight={700}
        color={light.main}
        opacity={0.7}
        borderBottom={`${borderWidth[1]} solid ${secondary.main}`}
        sx={{
          background: "#d3d3d363",
        }}
      >
        {name.toUpperCase()}
      </SoftBox>
    );
  });

  const renderRows =
    rows.length > 0 && !loader ? (
      rows.map((row, key) => {
        const rowKey = `row-${key}`;

        const tableRow = columns.map(({ name, align }) => {
          let template;

          if (Array.isArray(row[name])) {
            template = (
              <SoftBox
                key={uuidv4()}
                component="td"
                p={1}
                borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${secondary.main}` : null}
              >
                <SoftBox display="flex" alignItems="center" px={1}>
                  <SoftBox mr={2}>
                    <SoftAvatar
                      src={row[name][0]}
                      name={row[name][1]}
                      variant="rounded"
                      size="sm"
                    />
                  </SoftBox>
                  <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    sx={{ width: "max-content" }}
                  >
                    {row[name][1]}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            );
          } else {
            template = (
              <SoftBox
                key={uuidv4()}
                component="td"
                p={1.7}
                textAlign={align}
                borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${secondary.main}` : null}
              >
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  color="light"
                  sx={{ display: "inline-block", width: "max-content" }}
                >
                  {row[name]}
                </SoftTypography>
              </SoftBox>
            );
          }

          return template;
        });

        return <TableRow key={rowKey}>{tableRow}</TableRow>;
      })
    ) : (
      <TableRow>
        <SoftBox component="td" colSpan={columns.length} textAlign="center" p={4}>
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Typography variant="h6" color='primary' fontSize="14px">
              {loader ? `Loading ${text} data, please wait...` : `No ${text} records found`}
            </Typography>
          </Box>
        </SoftBox>
      </TableRow>
    );

  return useMemo(
    () => (
      <TableContainer>
        <MuiTable>
          {" "}
          <SoftBox component="thead" background="white" zIndex="999">
            <TableRow>{renderColumns}</TableRow>
          </SoftBox>
          <TableBody>
            <>{renderRows}</>
          </TableBody>
        </MuiTable>
      </TableContainer>
    ),
    [columns, rows]
  );
}

// Setting default values for the props of Table
Table.defaultProps = {
  columns: [],
  rows: [{}],
  text: "",
};

// Typechecking props for the Table
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.string,
};

export default Table;
