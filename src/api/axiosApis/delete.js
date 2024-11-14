import { del, isSuccessResp } from "../base";

export async function deleteUser() {
  try {
    const response = await del("/users/123");
    if (isSuccessResp(response.status)) {
      return response;
    } else {
      console.error("Failed to delete user.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}
