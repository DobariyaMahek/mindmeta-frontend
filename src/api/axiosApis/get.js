import { isSuccessResp, get } from "../base";

export const fetchUserData = async (page, rowsPerPage, search) => {
  try {
    const resp = await get(
      `/patients/list-and-search-patients?page=${page}&limit=${rowsPerPage}${search ? `&name=${search}` : ``}`
    );
    if (isSuccessResp(resp.status)) {
      return resp.data;
    }
  } catch (error) {}
};
export const getCallList = async (page, rowsPerPage, search) => {
  try {
    const resp = await get(
      // `/patients/list-and-search-patients?page=${page}&limit=${rowsPerPage}${search ? `&name=${search}` : ``}`
      `/call/list-scheduled-calls`
    );
    if (isSuccessResp(resp.status)) {
      return resp.data;
    }
  } catch (error) {}
};

export const getProfileList = async () => {
  try {
    const resp = await get(`/carehome/get-detail`);
    if (isSuccessResp(resp.status)) {
      return resp.data;
    }
  } catch (error) {
  }
};
