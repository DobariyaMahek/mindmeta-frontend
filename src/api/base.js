import axios from "axios";
import { checkToken } from "helper/authHelper";
import { authHeaderForm } from "helper/authHelper";
import { authHeader } from "helper/authHelper";
import { SESSION_EXPIRED } from "helper/constant";
import toast from "react-hot-toast";
const apiUrl = process.env.REACT_APP_API_URL;
const axiosApi = axios.create({
  baseURL: apiUrl,
});
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error(SESSION_EXPIRED);
      localStorage.clear();
      window.location.href = "/authentication/sign-in";
    }
    return Promise.reject(error);
  }
);
export const axiosInstance = axiosApi;
export async function get(url, config = {}) {
  checkToken();
  return await axiosApi
    .get(url, { params: config, headers: authHeader() })
    .then((response) => response)
    .catch((error) => error.response);
}

export async function patch(url, data, config = {}) {
  checkToken();
  return await axiosApi
    .patch(url, { ...data }, { ...config, headers: authHeader() })
    .then((response) => response)
    .catch((error) => error.response);
}

export async function post(url, data, config = {}) {
  checkToken();
  return axiosApi
    .post(url, { ...data }, { ...config, headers: authHeader() })
    .then((response) => response)
    .catch((error) => error.response);
}
export async function postFormData(url, data, config = {}) {
  checkToken();
  return axiosApi
    .post(url, data, {
      ...config,
      headers: authHeaderForm(),
    })
    .then((response) => response)
    .catch((error) => error.response);
}
export async function put(url, data, config = {}) {
  checkToken();
  return axiosApi
    .put(url, { ...data }, { ...config, headers: authHeader() })
    .then((response) => response);
}

export async function del(url, config = {}) {
  checkToken();
  return await axiosApi
    .delete(url, { ...config, headers: authHeader() })
    .then((response) => response);
}

export function isSuccessResp(status) {
  checkToken();
  if (status >= 200 && status <= 299) {
    return true;
  }
  return false;
}
