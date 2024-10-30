"use client";

import { motion } from "framer-motion";
import * as R from "remeda";
import PropTypes from "prop-types";
import { expressionColors } from "utils/expressionColors";
import { isExpressionColor } from "utils/expressionColors";

export default function Expressions({ values }) {
  const top3 = R.pipe(values, R.entries(), R.sortBy(R.pathOr([1], 0)), R.reverse(), R.take(3));

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",

    padding: "5px 3px",
    fontSize: "0.75rem",
    width: "100%",
    boxSizing: "border-box",
  };

  const expressionItemStyle = {
    flex: "1 1 30%", // Flex items that try to take up 30% width
    minWidth: "150px", // Ensure minimum width for readability
    maxWidth: "calc(100% / 3)", // Restrict each item to one-third of the container's width
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start", // Align labels to the left
    overflow: "hidden",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: "0.25rem",
    fontFamily: "Exo 2",
  };

  const keyTextStyle = {
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    // textOverflow: "ellipsis",
    fontWeight: "500",
    color: "#fff",
    flexGrow: 1, // Allow label to grow
  };

  const valueTextStyle = {
    fontFamily: "Exo 2",
    opacity: 0.5,
    color: "#fff",
    paddingLeft: "0.5rem", // Space between label and value
    flexShrink: 0, // Prevent the value from shrinking
  };

  const barWrapperStyle = {
    position: "relative",
    height: "0.25rem",
    width: "100%",
    backgroundColor: "#e0e0e0", // Set a default background color
    borderRadius: "9999px",
  };

  const barBaseStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "9999px",
    opacity: 0.1,
  };

  const barAnimatedStyle = (value, key) => ({
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    borderRadius: "9999px",
    backgroundColor: isExpressionColor(key) ? expressionColors[key] : "#e8078d", // Use expression color or fallback
    width: `${R.pipe(value, R.clamp({ min: 0, max: 1 }), (value) => `${value * 100}%`)}`,
  });

  return (
    <div style={containerStyle}>
      {top3.map(([key, value]) => (
        <div style={expressionItemStyle} key={key}>
          <div style={headerStyle}>
            <div style={keyTextStyle}>{key}</div>
            <div style={valueTextStyle}>{value?.toFixed(2)}</div>
          </div>
          <div style={{ ...barWrapperStyle, backgroundColor: "#e0e0e0" }}>
            <div style={barBaseStyle} />
            <motion.div
              style={barAnimatedStyle(value, key)}
              initial={{ width: 0 }}
              animate={{
                width: `${R.pipe(
                  value,
                  R.clamp({ min: 0, max: 1 }),
                  (value) => `${value * 100}%`
                )}`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

Expressions.propTypes = {
  values: PropTypes.objectOf(PropTypes.number).isRequired, // Changed to objectOf(number) for better accuracy
};
