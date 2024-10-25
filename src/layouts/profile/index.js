import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile/components/Header";
import { useState } from "react";
import EditProfile from "./components/EditProfile";
import { PROFILE_FIELD } from "helper/constant";
function Overview() {
  document.title = "Mind Meta AI | Profile";
  const [edit, setEdit] = useState(null);
  const [profileData, setProfileData] = useState(PROFILE_FIELD);
  const [newData, setNewData] = useState(PROFILE_FIELD);
  const handleSaveProfile = (updatedData) => {
    setProfileData(updatedData);
    setNewData(updatedData);
    setEdit(false);
  };
  return (
    <DashboardLayout>
      <Header {...{ edit, setEdit,  newData }} />
      {edit && (
        <EditProfile
          profileData={profileData}
          setProfileData={setProfileData}
          onSave={handleSaveProfile}
          onCancel={() => setEdit(!edit)}
        />
      )}
    </DashboardLayout>
  );
}

export default Overview;
