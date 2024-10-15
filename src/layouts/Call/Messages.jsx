import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Messages = forwardRef(function Messages(_, ref) {
  const { messages, connect } = useVoice();
  const navigate = useNavigate();
  const hasCall = localStorage.getItem("hasCall");
  useEffect(() => {
    if (hasCall == "true") {
      localStorage.setItem("hasCall", "false");
      navigate(-1);
    } else {
      localStorage.setItem("hasCall", "true");
      connect()
        .then(() => {})
        .catch(() => {})
        .finally(() => {});
    }
  }, []);

  return (
    <motion.div
      layoutScroll
      style={{
        flexGrow: 1,
        overflow: "auto",
        borderRadius: "0.375rem",
        padding: "1rem",
      }}
      ref={ref}
    >

    </motion.div>
  );
});

export default Messages;
