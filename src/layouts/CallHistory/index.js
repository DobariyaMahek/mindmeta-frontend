import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import SidebarCallHistory from "./callHistorysidebar";
import CallHistoryDetails from "./callDetails";
import { useDispatch, useSelector } from "react-redux";
import { getCallHistory } from "../../redux/ApiSlice/familySlice";
import toast from "react-hot-toast";
import { SOMETHING_WRONG } from "helper/constant";

function CallHistory() {
  const dispatch = useDispatch();
  const { callHistory } = useSelector((state) => state.family);
  const [singleHistory, setHistoryState] = useState(null);
  useEffect(() => {
    dispatch(getCallHistory()).then((res) => {
      if (res?.payload?.success) {
      } else {
        toast.error(res?.payload?.detail || res?.payload?.message || SOMETHING_WRONG);
      }
    });
  }, []);
  return (
    <DashboardLayout>
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <SidebarCallHistory {...{ setHistoryState, singleHistory, callHistory }} />
          </Grid>
          <Grid item xs={9}>
            <CallHistoryDetails {...{ singleHistory, callHistory }} />
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
}

export default CallHistory;
