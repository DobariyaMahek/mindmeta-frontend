import toast from "react-hot-toast";
import { del, isSuccessResp } from "../base";
import { DELETE_PATIENT } from "../../helper/constant";

export async function deleteFamilyMember(userId) {
  try {
    const response = await del(`/patients/delete-family-member/${userId}`);
    if (isSuccessResp(response.status)) {
      return response;
    } else {
      console.error("Failed to delete user.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

export async function deletePatient(userId) {
  try {
    const response = await del(`/patients/delete-patient/${userId}`);
    if (isSuccessResp(response.status)) {
      toast.success(DELETE_PATIENT);
      return response;
    } else {
      console.error("Failed to delete user.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}
