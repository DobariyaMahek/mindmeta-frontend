import toast from "react-hot-toast";
import { isSuccessResp, put } from "../base";
import { UPDATE_PATIENT } from "../../helper/constant";
import { useLoader } from "@/contexts/LoaderContext"; // Import the loader context

export async function UpdateUser(body, id) {
  try {
    const response = await put(`/patients/edit-patient/${id}`, body);
    if (isSuccessResp(response.status)) {
      toast.success(UPDATE_PATIENT);

      return response;
    } else {
      toast.error(response?.data?.detail && !Array.isArray(response?.data?.detail) ? response?.data?.detail : response?.data?.message ? response?.data?.message : SOMETHING_WRONG);
      return response;
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
export async function UpdateCareHomeProfile(body, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided

    const response = await put(`/carehome/update-detail`, body);
    if (isSuccessResp(response.status)) {
      console.log(`responseresponsesssssssssss`, response);
      toast.success(response?.data.message)
      return response;
    }
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    if (hideLoader) hideLoader();
  }
}
