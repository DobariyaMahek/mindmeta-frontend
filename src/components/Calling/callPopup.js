import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import Controls from "layouts/Call/Controls";
import React, { useState } from "react";
import "./calling.css";
import { useSoftUIController } from "context";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";

const CallPopup = ({ accessToken,setCallReceive, callReceive }) => {
  const [controller] = useSoftUIController();
  const { miniSidenav, sidenavColor, layout } = controller;
  const { connect, disconnect, status } = useVoice();
  const dispatch = useDispatch();

  const handleHangUp = () => {
    setCallReceive(false);
    disconnect();
  };

  const handleAnswer = async () => {
    localStorage.setItem("startTime", JSON.stringify(new Date().toISOString()));
    setCallReceive(true);
    connect()
      .then((response) => {})
      .catch((error) => {});
  };
  return (
    <AnimatePresence>
      {status.value !== "connected" && callReceive == null && (
        <motion.div>
          <SoftBox
            sx={{
              position: "fixed",
              bottom: 0,
              left: !miniSidenav ? "15.625rem" : 0,
              display: "flex",
              width: !miniSidenav ? "calc(100% - 15.625rem)" : "100%",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: "999999999999999999999999999999",
            }}
          >
            <div className="card">
              <div className="header">
                <div className="animation">
                  <span className="icon ring"></span>
                </div>
                <p className="calling">Incoming Call...</p>
              </div>

              <div className="footer">
                <div className="call-button cut-call" onClick={handleHangUp}>
                  <span className="icon red"></span>
                </div>
                <div className="call-button recive-call" onClick={handleAnswer}>
                  <span className="icon green"></span>
                </div>
              </div>
            </div>
          </SoftBox>
        </motion.div>
      )}

      <Controls {...{ callReceive, setCallReceive }} />
    </AnimatePresence>
  );
};
CallPopup.propTypes = {
  accessToken: PropTypes.string.isRequired, // Replace 'string' with the appropriate type for accessToken
      callReceive: PropTypes.bool.isRequired,  // Expecting a boolean
    setCallReceive: PropTypes.func.isRequired,  // Expecting a function
};
export default CallPopup;
