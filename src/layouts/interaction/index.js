import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import SoftBox from "components/SoftBox";
import ChatBot from "./chatbot";
import PatientInfo from "./patientInfo";

const Interaction = () => {
  const [currentSection, setCurrentSection] = useState(1);
  document.title = "Mind Meta AI | Chatbot";
  return (
    <DashboardLayout>
        
      <SoftBox py={3}>
        <PatientInfo {...{ setCurrentSection }} />
      </SoftBox>
        
    </DashboardLayout>
  );
};

export default Interaction;
