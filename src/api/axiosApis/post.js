import toast from "react-hot-toast";
import { isSuccessResp, post } from "../base";
import {
  CREATE_PATIENT,
  SOMETHING_WRONG,
  SUCCESSFULLY_LOGIN,
} from "../../helper/constant";

export async function loginUser(body) {
  try {
    const response = await post("/auth/sign-in", body);
    if (isSuccessResp(response.status)) {
      toast.success(SUCCESSFULLY_LOGIN);

      return response;
    } else {
      console.log(response);
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
export async function createUser(body) {
  try {
    const response = await post("/patients/add-patient", body);
    if (isSuccessResp(response.status)) {
      console.log(`responseresponse`, response);
      toast.success(CREATE_PATIENT);

      return response;
    } else {
      console.log(response);
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
