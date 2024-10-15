import React, { useState, useEffect } from "react";
import "./calling.css";
import { VoiceProvider } from "@humeai/voice-react";
import { getHumeAccessToken } from "utils/getHumeAccessToken";
import CallPopup from "./callPopup";
import { trainCallBot } from "../../redux/ApiSlice/callSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { SOMETHING_WRONG } from "helper/constant";

function Calling() {
  const [accessToken, setAccessToken] = useState(null);
  const [configId, setConfigId] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleFetch = async () => {
      const data = await getHumeAccessToken();
      setAccessToken(data);
    };
    handleFetch();
  }, []);
  useEffect(() => {
    if (accessToken) {
      handleGetInfo();
    }
  }, [accessToken]);
  const groupId = "897a264d-d9c2-459c-aa73-6ef3b7800c6d";
  const handleGetInfo = async () => {
    await dispatch(trainCallBot()).then(async (res) => {
      if (res?.payload?.success) {
        setConfigId(res?.payload?.data?.hume_config_id);
      } else {
        toast.error(res?.payload?.detail || res?.payload?.message || SOMETHING_WRONG);
      }
    });
  };
  return (
    <>
      {accessToken && (
        <VoiceProvider
          auth={{ type: "accessToken", value: accessToken }}
          configId={configId}
          // resumedChatGroupId={groupId}
        >
          <CallPopup {...{ accessToken }} />
        </VoiceProvider>
      )}
    </>
  );
}

export default Calling;
