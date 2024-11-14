import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import styled from "@mui/material/styles/styled";
import { useTranslation } from "react-i18next"; // CUSTOM COMPONENTS

import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import MoreButton from "@/components/more-button";
import profileimage from "../../../../../public/static/dashboardimages/memoryimage.png";
import "./chatsection.css";

const StyledRoot = styled(Card)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(3),
  "& .dot": {
    width: 10,
    height: 10,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
  },
  "& .progress-wrapper": {
    flexGrow: 1,
    marginInline: "1rem",
  },
  "& .title": {
    overflow: "hidden",
  },
}));
export default function Chatsection() {
  const { t } = useTranslation();
  return (
    <div className="chatsection-main">
      <StyledRoot>
        <FlexBetween>
          <H6 fontSize={14} lineHeight={1}>
            {t("Last Chat Transcript  ")}
          </H6>
          <MoreButton size="small" />
        </FlexBetween>
        <div className="chat-box-alignment">
          <div className="sender-chat">
            <div className="senders-chat-text">
              <p>How’s my favourite person doing today </p>
            </div>
            <div className="senders-name">
              <p>Lisa</p>
            </div>
          </div>
          <div className="receiver-chat">
            <div className="receiver-chat-and-profile">
              <div className="receiver-chat-profile">
                <img src={profileimage} alt="profileimage" />
              </div>
              <div className="receiver-chat-text">
                <p>Who’s this.... ahh </p>
              </div>
            </div>
            <div className="receiver-name">
              <p>James Lee</p>
            </div>
          </div>
          <div className="sender-chat">
            <div className="senders-chat-text">
              <p>It’s okay! James its me Lisa </p>
            </div>
            <div className="senders-name">
              <p>Lisa</p>
            </div>
          </div>
          <div className="receiver-chat">
            <div className="receiver-chat-and-profile">
              <div className="receiver-chat-profile">
                <img src={profileimage} alt="profileimage" />
              </div>
              <div className="receiver-chat-text">
                <p>
                  I don’t remember you. Who’re you and why you’re calling me?
                </p>
              </div>
            </div>
            <div className="receiver-name">
              <p>James Lee</p>
            </div>
          </div>
          <div className="sender-chat">
            <div className="senders-chat-text">
              <p>
                It’s okay James, I am here to chat with you we have lot to catch
                up. Do you want me to tell you a new story about young James
                Lee?{" "}
              </p>
            </div>
            <div className="senders-name">
              <p>Lisa</p>
            </div>
          </div>
        </div>
      </StyledRoot>
    </div>
  );
}
