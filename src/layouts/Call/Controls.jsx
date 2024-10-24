import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import SoftButton from "components/SoftButton";
import { useNavigate } from "react-router-dom";
import { useSoftUIController } from "context";
import { createCallHistory } from "../../redux/ApiSlice/patientSlice";
import toast from "react-hot-toast";
import { getSession } from "helper/authHelper";
import { useDispatch } from "react-redux";
import { SOMETHING_WRONG } from "helper/constant";

function Controls({ callReceive, setCallReceive }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav } = controller;
  const { disconnect, status, isMuted, unmute, mute, micFft, messages, connect } = useVoice();
  const navigate = useNavigate();
  const dispatchs = useDispatch();
  const session = getSession();

  // Timer state
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  useEffect(() => {
    let timer;
    if (isTiming) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => prevMinutes + 1);
            return 0;
          } else {
            return prevSeconds + 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTiming]);

  // Reset timer when call ends
  const resetTimer = () => {
    setMinutes(0);
    setSeconds(0);
  };

  useEffect(() => {
    console.log(status.value);
    if (status.value === "connected" && callReceive) {
      setIsTiming(true); // Start the timer when the call is connected
    } else if (status.value == "error") {
      setIsTiming(false); // Stop the timer when the call is disconnected
      resetTimer(); // Reset the timer after the call ends
      handleDisconnect();
    }
  }, [status.value, callReceive]);

  const handleDisconnect = async () => {
    const call_id = JSON.parse(localStorage.getItem("scheduled_call_id"));
    const startTime = JSON.parse(localStorage.getItem("startTime"));
    const chat_metadata = JSON.parse(localStorage.getItem("chat_metadata"));
    const body = {
      patient_id: session?.user_info?.id,
      hume_chat_id: chat_metadata?.chatId,
      hume_chat_group_id: chat_metadata?.chatGroupId,
      call_scheduled_id: call_id,
      start_time: startTime,
      end_time: new Date().toISOString(),
    };
    await dispatchs(createCallHistory(body)).then((res) => {
      if (res?.payload?.success) {
        localStorage.removeItem("startTime");
        localStorage.removeItem("scheduled_call_id");
        localStorage.removeItem("chat_metadata");
        setCallReceive(false);
      } else {
        setCallReceive(false);
      }
    });
  };

  useEffect(() => {
    if (messages && messages[1]?.type == "chat_metadata") {
      localStorage.setItem("chat_metadata", JSON.stringify(messages[1]));
    }
  }, [messages]);

  return (
    status.value == "connected" &&
    callReceive && (
      <motion.div>
        <div
          style={{
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
          <AnimatePresence>
            {status.value === "connected" ? (
              <motion.div
                initial={{
                  y: "100%",
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: "100%",
                  opacity: 0,
                }}
                style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #4b5563", // border-gray-600 equivalent
                  padding: "0.5rem 1rem",
                  textAlign: "center",
                  fontSize: "0.875rem", // text-sm equivalent
                  fontWeight: "500", // font-medium equivalent
                  color: "#ffffff", // text-white
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm equivalent
                  backgroundColor: "white",
                }}
              >
                <Toggle
                  pressed={!isMuted}
                  onPressedChange={() => {
                    if (isMuted) {
                      unmute();
                    } else {
                      mute();
                    }
                  }}
                >
                  {isMuted ? (
                    <MicOff
                      style={{ width: "1rem", height: "1rem", color: "#1f2937", border: "none" }}
                    />
                  ) : (
                    <Mic
                      style={{ width: "1rem", height: "1rem", color: "#1f2937", border: "none" }}
                    />
                  )}
                </Toggle>

                <div
                  style={{
                    position: "relative",
                    display: "grid",
                    height: "2rem",
                    width: "12rem",
                    flexShrink: 0,
                  }}
                >
                  <MicFFT fft={micFft} className={"fill-current"} />
                </div>

                {/* Timer Display */}
                <div style={{ fontSize: "1rem", color: "#1f2937" }}>
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>

                <SoftButton
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    disconnect();
                    handleDisconnect();
                  }}
                >
                  <span>
                    <Phone
                      style={{
                        width: "1rem",
                        height: "1rem",
                        color: "#ef4444",
                        opacity: 0.5,
                        marginRight: "10px",
                      }}
                      strokeWidth={2}
                      stroke={"currentColor"}
                    />
                  </span>
                  <span style={{ color: "#ef4444" }}>End Call</span>
                </SoftButton>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  );
}

Controls.propTypes = {
  callReceive: PropTypes.func.isRequired, // Validate that callReceive is a required function
  setCallReceive: PropTypes.func.isRequired,
};

export default Controls;
