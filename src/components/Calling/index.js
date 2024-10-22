import React, { useState, useEffect } from "react";
import "./calling.css";
import { VoiceProvider } from "@humeai/voice-react";
import { getHumeAccessToken } from "utils/getHumeAccessToken";
import CallPopup from "./callPopup";
import { trainCallBot } from "../../redux/ApiSlice/callSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { SOMETHING_WRONG } from "helper/constant";
import { useNavigate } from "react-router-dom";

function Calling() {
  const [accessToken, setAccessToken] = useState(null);
  const [configId, setConfigId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const call_id = JSON.parse(localStorage.getItem("scheduled_call_id"));
  useEffect(() => {
    const handleFetch = async () => {
      const data = await getHumeAccessToken();
      setAccessToken(data);
    };
    handleFetch();
  }, []);
  useEffect(() => {
    if (accessToken && call_id) {
      handleGetInfo();
    }
  }, [accessToken, call_id]);
  const handleGetInfo = async () => {
    await dispatch(trainCallBot(call_id)).then(async (res) => {
      if (
        res?.payload?.success &&
        (res?.payload?.data?.hume_config_id || res?.payload?.data?.chat_group_id)
      ) {
        setConfigId(res?.payload?.data?.hume_config_id);
        setGroupId(res?.payload?.data?.chat_group_id);
      } else {
        localStorage.clear();
        navigate("/authentication/sign-in");
        toast.error(res?.payload?.detail || res?.payload?.message || SOMETHING_WRONG);
      }
    });
  };
  return (
    <>
      {accessToken && (
        <VoiceProvider
          auth={{ type: "accessToken", value: accessToken }}
          {...(!groupId && configId && { configId: configId })}
          {...(groupId && { resumedChatGroupId: groupId })}
        >
          <CallPopup {...{ accessToken }} />
        </VoiceProvider>
      )}
    </>
  );
}

export default Calling;
