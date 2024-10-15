import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Card, IconButton } from "@mui/material";
import { Mic, ArrowDownward, PlayArrow, Pause, Send } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getAllChat } from "../../../redux/ApiSlice/patientSlice";
import { useWebSocketContext } from "api/WebSocketProvider";
import moment from "moment";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import AnimatedRobot from "components/AnimatedRobot";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import SoftBox from "components/SoftBox";
import { useLocation } from "react-router-dom";
import { getDateLabel } from "helper/constant";

export const useStyles = makeStyles((theme) => ({
  chatSection: {
    width: "100%",
    height: "82vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      height: "70vh",
    },
  },
  chatContainer: {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      width: "95%",
    },
  },
  chatMessage: {
    flex: 1,
    padding: theme.spacing(2),
    paddingTop: 0,
    overflowY: "auto",
    borderBottom: `1px solid #66b5a3`,
  },
  chatInput: {
    display: "flex",
    borderTop: `1px solid #66b5a3`,
    alignItems: "center",
    padding: theme.spacing(1),
  },
  inputField: {
    flex: 1,
    padding: theme.spacing(1),
    fontSize: "16px",
    width: "100% !important",
  },
  sendButton: {
    backgroundColor: "#66b5a3",
    color: "white",
    border: "none",
    padding: theme.spacing(1),
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#4a8d81",
    },
  },
  scrollToBottomButton: {
    position: "absolute",
    bottom: theme.spacing(8),
    right: theme.spacing(2),
    cursor: "pointer",
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    backgroundColor: "#ffff",
    zIndex: 10,
    padding: 0,
    textAlign: "center",
  },
  stickyHeaderText: {
    fontSize: "12px",
    fontWeight: 500,
    padding: 0,
    cursor: "pointer",
    color: "gray",
    background: "transparent",
  },
}));

const ChatBot = () => {
  const { chatLoader } = useSelector((state) => state.patient);
  const classes = useStyles();
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const chatContainerRef = useRef(null);
  const { messages, sendMessage } = useWebSocketContext();
  const [chatMessage, setChatMessage] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [playingAudioId, setPlayingAudioId] = useState(null); // To track which message is playing
  const synth = useRef(window.speechSynthesis); // Ref for speech synthesis
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const segments = pathname?.split("/");
  const id = segments[2];

  useEffect(() => {
    const msg = messages?.length ? messages[messages?.length - 1] : null;
    const allMessage = [...chatMessage, msg];
    if (msg && messages) {
      setChatMessage(allMessage);
    }
  }, [messages]);

  useEffect(() => {
    if (id) {
      dispatch(getAllChat(id)).then((res) => {
        if (res?.payload?.success) {
          const data = res?.payload?.data?.map((conversation) => ({
            id: conversation?.id, // Unique ID for each message
            type: conversation?.sender,
            message: `${conversation?.message}.`,
            created_at: conversation?.created_at,
          }));
          setChatHistory(data);
          setChatMessage(data);
        } else {
          setChatHistory([]);
          setChatMessage([]);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessage]);

  const handleSendMessage = () => {
    if (transcript?.trim() && !chatLoader) {
      sendMessage(transcript?.trim());
      resetTranscript();
    }
  };


  // Group messages by date
  const groupedMessages =
    chatMessage &&
    chatMessage?.reduce((acc, msg) => {
      const dateLabel = getDateLabel(msg.created_at || new Date());
      if (!acc[dateLabel]) acc[dateLabel] = [];
      acc[dateLabel].push(msg);
      return acc;
    }, {});

  const handlePlayPause = (messageId, text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // If the current message is playing, stop it
    if (playingAudioId === messageId) {
      synth.current.cancel(); // Cancel the current speech
      setPlayingAudioId(null);
    } else {
      // Stop any current speech
      synth.current.cancel();

      // Start the new speech
      synth.current.speak(utterance);
      setPlayingAudioId(messageId);

      // Set up an event listener to reset the playing state when the speech ends
      utterance.onend = () => {
        setPlayingAudioId(null);
      };
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  return (
    <DashboardLayout>
      <SoftBox py={3}>
        <SoftBox>
          <Card>
            <SoftBox className={classes.chatSection}>
              <div className={classes.chatContainer}>
                <Box className={classes.chatMessage} ref={chatContainerRef}>
                  {!chatMessage?.length || chatLoader ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        color: "lightgrey",
                        flexDirection: "column",
                        textAlign: "center",
                      }}
                    >
                      <AnimatedRobot />
                      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                        {chatLoader
                          ? "Please wait while we load your messages..."
                          : "No messages yet. Start the conversation!"}
                      </Typography>
                    </Box>
                  ) : (
                    groupedMessages &&
                    !chatLoader &&
                    Object.keys(groupedMessages).map((dateLabel, index) => (
                      <React.Fragment key={index}>
                        <SoftBox className={classes.stickyHeader} sx={{ backgroundColor: "#fff" }}>
                          <Typography
                            variant="p"
                            onClick={() => {
                              const element = document.getElementById(dateLabel);
                              if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                              }
                            }}
                            className={classes.stickyHeaderText}
                          >
                            {dateLabel}
                          </Typography>
                        </SoftBox>
                        <Box id={dateLabel}>
                          {groupedMessages[dateLabel] &&
                            dateLabel &&
                            groupedMessages[dateLabel]?.map((msg, idx) => {
                              return (
                                <Box
                                  key={msg.id}
                                  sx={{
                                    display: "flex",
                                    justifyContent: msg.type === "bot" ? "flex-start" : "flex-end",
                                    marginBottom: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      backgroundColor: msg.type === "bot" ? "#E9ECEF" : "#66b5a32e",
                                      color: msg.type === "bot" ? "gray" : "#66B5A3",
                                      borderRadius:
                                        msg.type === "bot"
                                          ? "0px 10px 10px 10px"
                                          : "10px 0px 10px 10px",
                                      padding: 1,
                                      wordBreak: "break-word",
                                      minWidth: "8%",
                                      maxWidth: {
                                        xs: "90%",
                                        sm: "80%",
                                        md: "70%",
                                        lg: "40%",
                                      },
                                    }}
                                  >
                                    <SoftBox
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                          textTransform: "capitalize",
                                          color: msg.type === "bot" ? "gray" : "#66B5A3",
                                        }}
                                      >
                                        {msg.type}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          fontSize: "12px",
                                          textTransform: "capitalize",
                                          color: msg?.type === "bot" ? "gray" : "#66B5A3",
                                          ml: "10px",
                                        }}
                                      >
                                        {moment?.utc(msg?.created_at)?.local()?.format("hh:mm A")}
                                      </Typography>
                                    </SoftBox>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontSize: "14px",
                                      }}
                                    >
                                      {msg.message}
                                    </Typography>
                                    <IconButton
                                      onClick={() => handlePlayPause(msg.id, msg.message)}
                                      sx={{ marginTop: "10px" }}
                                    >
                                      {playingAudioId === msg.id ? <Pause /> : <PlayArrow />}
                                    </IconButton>
                                  </Box>
                                </Box>
                              );
                            })}
                        </Box>
                      </React.Fragment>
                    ))
                  )}
                </Box>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                  <Box className={classes.chatInput}>
                    <IconButton
                      className={classes.micButton}
                      onClick={
                        listening
                          ? SpeechRecognition.stopListening
                          : SpeechRecognition.startListening
                      }
                    >
                      <Mic />
                    </IconButton>
                    {listening ? (
                      <Typography variant="h6">Listening...</Typography>
                    ) : (
                      <Typography variant="h6">Press Mic to Speak</Typography>
                    )}
                  </Box>

                  <IconButton
                    className={classes.sendButton}
                    onClick={handleSendMessage}
                    aria-label="send message"
                    size="medium"
                    style={{
                      backgroundColor: "#66b5a3",
                      borderRadius: "50%",
                      color: "white",
                    }}
                  >
                    <Send />
                  </IconButton>
                </SoftBox>
              </div>
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default ChatBot;
