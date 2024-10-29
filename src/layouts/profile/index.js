import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile/components/Header";
import { useEffect, useState } from "react";
import EditProfile from "./components/EditProfile";
import { PROFILE_FIELD } from "helper/constant";
import { useDispatch } from "react-redux";
import { GetCareHomeProfile, UpdateCareHomeProfile } from "../../redux/ApiSlice/authSlice";
import toast from "react-hot-toast";
function Overview() {
  document.title = "Mind Meta AI | Profile";
  const [edit, setEdit] = useState(null);
  const [profileData, setProfileData] = useState(PROFILE_FIELD);
  const [newData, setNewData] = useState(PROFILE_FIELD);
  const dispatch = useDispatch();
  const handleSaveProfile = (updatedData) => {
    dispatch(UpdateCareHomeProfile({ body: updatedData })).then((res) => {
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
        fetchData();
        setEdit(false);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  const fetchData = () => {
    dispatch(GetCareHomeProfile()).then((res) => {
      if (res?.payload?.success) {
        const obj = res?.payload?.data;
        const data = {
          username: obj?.username || "",
          carehome_name: obj?.carehome_name || "",
          email: obj?.email || "",
          address: obj?.address || "",
          administrator_name: obj?.administrator_name || "",
          phone_number: String(obj?.phone_number) || "",
          countryCode: String(obj?.phone_number) || "in",
        };
        setProfileData(data);
        setNewData(data);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <DashboardLayout>
      <Header {...{ edit, setEdit, newData }} />
      {edit && (
        <EditProfile
          profileData={profileData}
          setProfileData={setProfileData}
          onSave={handleSaveProfile}
          onCancel={() => {
            setEdit(!edit);
            fetchData();
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default Overview;
