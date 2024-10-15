import React from "react";
import PropTypes from "prop-types"; // Add this import statement
import { Navigate } from "react-router-dom";
import { getSession } from "helper/authHelper";

function PrivateRoute({ children }) {
  const userInfo = getSession();

  return userInfo ? children : <Navigate to="/authentication/sign-in" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
