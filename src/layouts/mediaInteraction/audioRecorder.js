import React, { useState } from "react";
import { ReactMic } from "react-mic";
import { IconButton, Tooltip } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox"; // Assuming SoftBox is part of your component library
import { Padding } from "@mui/icons-material";

const AudioRecorder = ({ setMedia }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  // Start recording
  const startRecording = () => {
    setRecording(true);
    setAudioURL("");
  };

  // Stop recording
  const stopRecording = () => {
    setRecording(false);
  };

  // On stop, handle the recorded blob
  const onStop = (blob) => {
    setAudioURL(URL.createObjectURL(blob.blob)); // Create URL for audio playback
    setMedia((prev) => ({
      ...prev,
      audio: [...prev?.audio, blob.blob],
    }));
  };

  return (
    <SoftBox
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <Tooltip title={recording ? "Stop Recording" : "Start Recording"} placement="top">
        {!recording ? (
          <IconButton color="primary" onClick={startRecording}>
            <MicIcon fontSize="medium" />
          </IconButton>
        ) : (
          <IconButton color="secondary" onClick={stopRecording}>
            <StopIcon fontSize="medium" />
          </IconButton>
        )}
      </Tooltip>

      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
        strokeColor="#000" // White wave color
      />
    </SoftBox>
  );
};

AudioRecorder.propTypes = {
  setMedia: PropTypes.func.isRequired,
};

export default AudioRecorder;
