import React, { useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getSession } from "helper/authHelper";
import { getScheduleCallList, scheduleCall } from "../../../redux/ApiSlice/callSlice";
import EventModal from "./eventModal";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import { Add, ArrowLeft, ArrowRight } from "@mui/icons-material";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { VIEW_OPTIONS } from "helper/constant";
import SoftInput from "components/SoftInput";
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format: (date, formatStr, options) => format(date, formatStr, { locale: options?.locale }),
  parse: (dateStr, formatStr, options) =>
    parse(dateStr, formatStr, new Date(), { locale: options?.locale }),
  startOfWeek: (date, options) => startOfWeek(date, { locale: options?.locale }),
  getDay: (date) => getDay(date),
  locales,
});

function CalendarComponent() {
  const { meeting } = useSelector((state) => state.call); // Fetch meetings from Redux
  const userInfo = getSession();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({}); // State to track expanded descriptions
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const dispatch = useDispatch();

  const handleGetData = async () => {
    await dispatch(getScheduleCallList());
  };
  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    let formattedEvents =
      meeting?.map((event) => ({
        ...event,
        start: moment.utc(event.start).local().toDate(),
        end: moment.utc(event.end).local().toDate(),
      })) || [];

    // If current view is 'Agenda', filter events for the selected date
    if (currentView === Views.AGENDA) {
      formattedEvents = formattedEvents.filter(
        (event) =>
          moment(event.start).isSame(selectedDate, "day") ||
          moment(event.end).isSame(selectedDate, "day")
      );
    }

    setFilteredEvents(formattedEvents);
  }, [meeting, currentView, selectedDate]);
  const onPrevClick = useCallback(() => {
    const newDate = moment(selectedDate)
      .subtract(
        currentView === Views.AGENDA ? 1 : currentView === Views.WEEK ? 1 : 1,
        currentView === Views.AGENDA ? "d" : currentView === Views.WEEK ? "w" : "M"
      )
      .toDate();
    setSelectedDate(newDate);
    setExpandedDescriptions({});
  }, [currentView, selectedDate]);

  const onNextClick = useCallback(() => {
    const newDate = moment(selectedDate)
      .add(
        currentView === Views.AGENDA ? 1 : currentView === Views.WEEK ? 1 : 1,
        currentView === Views.AGENDA ? "d" : currentView === Views.WEEK ? "w" : "M"
      )
      .toDate();
    setSelectedDate(newDate);
    setExpandedDescriptions({});
  }, [currentView, selectedDate]);
  const onTodayClick = useCallback(() => {
    setSelectedDate(moment().toDate());
    setExpandedDescriptions({});
  }, []);
  const dateText = useMemo(() => {
    if (currentView === Views.AGENDA) return moment(selectedDate).format("dddd, MMMM DD");
    if (currentView === Views.WEEK) {
      const from = moment(selectedDate)?.startOf("week");
      const to = moment(selectedDate)?.endOf("week");
      return `${from.format("MMMM DD")} to ${to.format("MMMM DD")}`;
    }
    if (currentView === Views.MONTH) {
      return moment(selectedDate).format("MMMM YYYY");
    }
  }, [currentView, selectedDate]);
  const handleScheduleCall = () => {
    setModalOpen(true);
  };

  const handleSaveEvent = (event) => {
    const body = {
      title: event.title,
      patient_id: event?.patient?.value,
      description: event.description,
      call_time: moment(event.callTime).utc(),
      call_duration: event?.callDuration * 60,
    };
    dispatch(scheduleCall({ body })).then((res) => {
      if (res?.payload?.success) {
        setModalOpen(false);
        handleGetData();
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.error);
        setModalOpen(false);
      }
    });
  };

  const eventPropGetter = () => ({
    style: {
      backgroundColor: "#e8078d",
      color: "white",
      borderRadius: "5px",
      padding: "5px",
      margin: "2px 0",
    },
  });
  const toggleReadMore = (eventId) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [eventId]: !prevState[eventId],
    }));
  };
  const eventRenderer = ({ event }) => {
    const maxLength = 400;
    const description = event?.description;
    const isLongDescription = description?.length > maxLength;
    const isExpanded = expandedDescriptions[event.id] || false;

    const displayDescription = isExpanded
      ? description
      : description?.substring(0, maxLength) + (isLongDescription ? "..." : "");

    return (
      <SoftBox sx={{ cursor: "auto" }}>
        {/* Patient Name Row */}
        <div className="text-grid">
          {/* Key: Patient Name */}
          {currentView === "agenda" && (
            <Typography color={"#fff"} fontSize="14px" fontWeight={"bold"}>
              Patient Name
            </Typography>
          )}
          {/* Value: Darsh Dubai */} {/* 9 columns for value */}
          <Typography color={"#fff"} fontSize="14px">
            {currentView === "agenda" ? ":" : ""} {event?.patient?.label}
          </Typography>
          {currentView !== "agenda" && (
            <Typography color={"#fff"} fontSize="12px">
              {format(new Date(event.start), "hh:mm a")}
            </Typography>
          )}
        </div>

        {/* Title Row */}
        <div className="text-grid">
          {/* Key: Title */}
          {currentView === "agenda" && (
            <Typography color={"#fff"} fontSize="14px" fontWeight={"bold"}>
              Title
            </Typography>
          )}
          {/* Value: Free Check-up */}
          <Typography color={"#fff"} fontSize="13px">
            {currentView === "agenda" ? ":" : ""} {event?.title}
          </Typography>
        </div>

        {currentView === "agenda" && (
          <>
            <div className="text-grid">
              {/* Key: Description */}
              <Typography color={"#fff"} fontSize="14px" fontWeight={"bold"}>
                Description
              </Typography>

              {/* Value: Hypertension Description */}
              <Typography color="#fff" fontSize="13px" display={"inline"}>
                : {displayDescription}
              {isLongDescription && (
                <Typography
                  onClick={() => toggleReadMore(event.id)}
                  color={"#fff"}
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  sx={{ cursor: "pointer" }}
                  display={"inline"}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </Typography>
              )}
              </Typography>
            </div>
            <div className="text-grid">
              {/* Key: Description */}
              <Grid item xs={1}>
                <Typography color={"#fff"} fontSize="14px" fontWeight={"bold"}>
                  Call Duration
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography color={"#fff"} fontSize="13px">
                  : {event?.call_duration} minute
                </Typography>
              </Grid>
            </div>
          </>
        )}
      </SoftBox>
    );
  };

  return (
    <DashboardLayout>
      <SoftBox pt={3}>
        <SoftBox>
          <Card>
            <Box
              sx={{
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // width: 260,
                borderRadius: 1,
              }}
            >
              <IconButton aria-label="Previous" color="light" onClick={onPrevClick}>
                <ArrowLeft />
              </IconButton>
              <Typography variant="h6 " className="date-text-style" color="#fff">
                {dateText}
              </Typography>
              <IconButton aria-label="Next" color="light" onClick={onNextClick}>
                <ArrowRight />
              </IconButton>
            </Box>
            <div style={{ height: "auto", padding: "10px" }}>
              <div className="calander-header-alignment">
                <Box sx={{ position: "relative", zIndex: 5 }}>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setExpandedDescriptions({});
                    }}
                    customInput={<input style={{ cursor: "pointer" }} />}
                    className={"input"}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd-MM-yyyy"
                    onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
                  />
                </Box>
                <div>
                  <SoftBox sx={{ display: "flex" }}>
                    <div className="two-content-alignment">
                      <SoftBox display="flex" justifyContent="end" alignItems="center">
                        {userInfo?.role == "care_home" && (
                          <SoftButton
                            variant="gradient"
                            color="primary"
                            sx={{
                              marginRight: "10px",
                            }}
                            onClick={handleScheduleCall}
                          >
                            <Add /> Schedule Call
                          </SoftButton>
                        )}

                        <ButtonGroup variant="contained">
                          {VIEW_OPTIONS.map(({ id, label }) => (
                            <SoftButton
                              key={id}
                              onClick={() => {
                                setCurrentView(id);
                                id != currentView && setExpandedDescriptions({});
                              }}
                              variant="outlined"
                              color="info"
                              sx={id === currentView ? { color: "#e8078d" } : { color: "#fff" }}
                            >
                              {label}
                            </SoftButton>
                          ))}
                        </ButtonGroup>
                      </SoftBox>
                    </div>
                  </SoftBox>
                </div>
                <SoftButton variant="outlined" color="info" onClick={onTodayClick}>
                  Today
                </SoftButton>
              </div>
              <Grid container justifyContent="center" alignItems="center" mb={2}>
                <Grid item xs={3}></Grid>
              </Grid>

              <Calendar
                localizer={localizer}
                events={filteredEvents}
                defaultView={Views.MONTH}
                startAccessor="start"
                endAccessor="end"
                selectable={userInfo.role !== "patient"}
                // onSelectSlot={handleSelectSlot}
                eventPropGetter={eventPropGetter}
                components={{
                  event: eventRenderer,
                }}
                style={{ height: 735, cursor: "default" }}
                view={currentView}
                date={selectedDate}
                onView={setCurrentView}
                onNavigate={setSelectedDate}
                toolbar={false}
                views={["month", "agenda"]}
              />

              {userInfo.role !== "patient" && modalOpen && (
                <EventModal
                  open={modalOpen}
                  handleClose={() => setModalOpen(false)}
                  handleSave={handleSaveEvent}
                  selectedDate={selectedDate}
                />
              )}
            </div>
          </Card>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
}

export default CalendarComponent;
