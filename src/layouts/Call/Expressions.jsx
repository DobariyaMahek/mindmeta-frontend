"use client";

import { motion } from "framer-motion";
import * as R from "remeda";
import { expressionColors } from "utils/expressionColors";
import { isExpressionColor } from "utils/expressionColors";
import PropTypes from "prop-types";

export default function Expressions({ values }) {
  const top3 = R.pipe(values, R.entries(), R.sortBy(R.pathOr([1], 0)), R.reverse(), R.take(3));

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        gap: "0.75rem",
        borderTop: "1px solid #dee2e6", // Example border color
        padding: "0.75rem",
        fontSize: "0.75rem",
      }}
    >
      {top3.map(([key, value]) => (
        <div
          style={{
            width: "100%",
            overflow: "hidden",
          }}
          key={value}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.25rem",
              paddingBottom: "0.25rem",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: "500",
                color: "#000", // Example text color for light mode
              }}
            >
              {key}
            </div>
            <div
              style={{
                fontFamily: "Arial",
                opacity: 0.5,
                color: "#000", // Example text color for light mode
              }}
            >
              {value?.toFixed(2)}
            </div>
          </div>
          <div
            style={{
              position: "relative",
              height: "0.25rem",
              backgroundColor: isExpressionColor(key) ? expressionColors[key] : "var(--bg)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "var(--bg)",
                borderRadius: "9999px",
                opacity: 0.1,
              }}
            />
            <motion.div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                height: "100%",
                borderRadius: "9999px",
                backgroundColor: "var(--bg)",
              }}
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
  values: PropTypes.arrayOf(PropTypes.any).isRequired,
};
