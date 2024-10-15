import React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import PropTypes from "prop-types";

const Toggle = React.forwardRef((props, ref) => {
  const { variant, size, className, style, disabled, ...rest } = props;

  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return {
          border: "1px solid #e2e8f0", // border-input equivalent
          backgroundColor: "transparent",
          ":hover": {
            backgroundColor: "#e0f2fe", // hover:bg-accent equivalent
            color: "#1e3a8a", // hover:text-accent-foreground equivalent
          },
        };
      default:
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          height: "2.25rem", // h-9 equivalent
          padding: "0.625rem", // px-2.5 equivalent
        };
      case "lg":
        return {
          height: "2.75rem", // h-11 equivalent
          padding: "1.25rem", // px-5 equivalent
        };
      default:
        return {
          height: "2.5rem", // h-10 equivalent
          padding: "0.75rem", // px-3 equivalent
        };
    }
  };

  const combinedStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.375rem", // rounded-md equivalent
    fontSize: "0.875rem", // text-sm equivalent
    fontWeight: "500", // font-medium equivalent
    transition: "color 0.2s, background-color 0.2s", // transition-colors equivalent
    outline: "none",
    cursor: "pointer",
    border: "none",
    opacity: disabled ? 0.5 : 1, // disabled styles
    pointerEvents: disabled ? "none" : "auto",
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <TogglePrimitive.Root ref={ref} style={combinedStyles} disabled={disabled} {...rest}>
      {props.children}
    </TogglePrimitive.Root>
  );
});

Toggle.displayName = TogglePrimitive.Root.displayName;

Toggle.propTypes = {
  variant: PropTypes.string, // Validate 'variant' prop
  size: PropTypes.string, // Validate 'size' prop
  className: PropTypes.string, // Validate 'className' prop
  style: PropTypes.object, // Additional inline styles
  children: PropTypes.node, // Children to render inside the toggle
  disabled: PropTypes.bool, // Validate 'disabled' prop
};

export { Toggle };
