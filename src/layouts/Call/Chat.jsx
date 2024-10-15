import { useVoice, VoiceProvider } from "@humeai/voice-react";
import { ComponentRef, useEffect, useRef, useState } from "react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import PropTypes from "prop-types";
import Calling from "components/Calling";
import { getSession } from "helper/authHelper";
export default function Chat({ accessToken }) {
  const timeout = useRef(null);
  const ref = useRef(null);
  const userInfo = getSession();

  return (
    <div
    // className={
    //   "relative mx-auto flex h-[0px] w-full grow flex-col overflow-hidden"
    // }
    >
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
      >
        <Messages ref={ref} />
        <Controls />
      </VoiceProvider>
    </div>
  );
}
Chat.propTypes = {
  accessToken: PropTypes.string.isRequired,
};
