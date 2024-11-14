import { get } from "http";
import { isSuccessResp } from "../base";

export async function fetchUserData() {
  try {
    const response = await get("/users/123");
    if (isSuccessResp(response.status)) {
      return response;
    } else {
      console.error("Failed to fetch user data.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
