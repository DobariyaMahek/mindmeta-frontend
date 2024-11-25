import { isSuccessResp, get } from "../base";

export const fetchUserData = async (page, rowsPerPage, search, showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const resp = await get(`/patients/list-and-search-patients?page=${page}&limit=${rowsPerPage}${search ? `&name=${search}` : ``}`);
    if (isSuccessResp(resp.status)) {
      return resp.data;
    }
  } catch (error) {
  } finally {
    if (hideLoader) hideLoader();
  }
};
export const getCallList = async (showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const resp = await get(`/call/list-scheduled-calls`);
    if (isSuccessResp(resp.status)) {
      return resp.data;
    }
  } catch (error) {} finally {
    if (hideLoader) hideLoader();
  }

};

export const getProfileList = async (showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const resp = await get(`/carehome/get-detail`);
    if (isSuccessResp(resp.status)) {
      return resp.data;
    }
  } catch (error) {
  } finally {
    if (hideLoader) hideLoader();
  }
};
