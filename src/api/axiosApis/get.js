import { isSuccessResp, get } from "../base";

export const fetchUserData = async (page, rowsPerPage, search) => {
  try {
    const resp = await get(
      `/patients/list-and-search-patients?page=${page}&limit=${rowsPerPage}${search ? `&name=${search}` : ``}`
    );
    if (isSuccessResp(resp.status)) {
      return resp.data;
    }
  } catch (error) {
  }
};
