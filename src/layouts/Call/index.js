import React, { useEffect, useState } from "react";
import "./call.css";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Chat from "./Chat";
import { getHumeAccessToken } from "utils/getHumeAccessToken";
function Call() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const handleFetch = async () => {
      const data = await getHumeAccessToken();
      setAccessToken(data);
    };
    handleFetch();
  }, []);
  return (
    <DashboardLayout>
        
      <SoftBox py={3}>{accessToken && <Chat accessToken={accessToken} />}</SoftBox>
    </DashboardLayout>
  );
}

export default Call;
