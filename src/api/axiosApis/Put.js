import toast from "react-hot-toast";
import { isSuccessResp, put } from "../base";
import { UPDATE_PATIENT } from "../../helper/constant";

export async function UpdateUser(body, id) {
  try {
    const response = await put(`/patients/edit-patient/${id}`, body);
    if (isSuccessResp(response.status)) {
      toast.success(UPDATE_PATIENT);

      return response;
    } else {
      toast.error(
        response?.data?.detail && !Array.isArray(response?.data?.detail)
          ? response?.data?.detail
          : response?.data?.message
            ? response?.data?.message
            : SOMETHING_WRONG
      );
      return response;
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
