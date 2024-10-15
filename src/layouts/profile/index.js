import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile/components/Header";
import { useState } from "react";
import EditProfile from "./components/EditProfile";
function Overview() {
  document.title = "Mind Meta AI | Profile";
  const [edit, setEdit] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    // Add more fields as needed
  });

  const handleSaveProfile = (updatedData) => {
    setProfileData(updatedData);
    setEdit(false);
  };
  return (
    <DashboardLayout>
      <Header {...{ edit, setEdit }} />
      {edit && (
        <EditProfile
          profileData={profileData}
          onSave={handleSaveProfile}
          onCancel={() => setEdit(!edit)}
        />
      )}
        
    </DashboardLayout>
  );
}

export default Overview;
