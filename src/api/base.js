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
  try {
    const res = await checkToken(); // Await checkToken to get the result first

    if (res === "time") {
      if (res == true) {
        return await axiosApi
          .get(url, { params: config, headers: authHeader() })
          .then((response) => response)
          .catch((error) => error.response);
      }
    } else {
      return await axiosApi
        .get(url, { params: config, headers: authHeader() })
        .then((response) => response)
        .catch((error) => error.response);
    }
  } catch (error) {
    console.error("Error during token validation or API call:", error);
    throw error;
  }
}

export async function patch(url, data, config = {}) {
  try {
    const res = await checkToken(); // Await checkToken to get the result first

    if (res === "time") {
      if (res == true) {
        return await axiosApi
          .patch(url, { ...data }, { ...config, headers: authHeader() })
          .then((response) => response)
          .catch((error) => error.response);
      }
    } else {
      return await axiosApi
        .patch(url, { ...data }, { ...config, headers: authHeader() })
        .then((response) => response)
        .catch((error) => error.response);
    }
  } catch (error) {
    console.error("Error during token validation or API call:", error);
    throw error;
  }
}

export async function post(url, data, config = {}) {
  try {
    const res = await checkToken(); // Await checkToken to get the result first

    if (res === "time") {
      if (res == true) {
        return axiosApi
          .post(url, { ...data }, { ...config, headers: authHeader() })
          .then((response) => response)
          .catch((error) => error.response);
      }
    } else {
      return axiosApi
        .post(url, { ...data }, { ...config, headers: authHeader() })
        .then((response) => response)
        .catch((error) => error.response);
    }
  } catch (error) {
    console.error("Error during token validation or API call:", error);
    throw error;
  }
}
export async function postFormData(url, data, config = {}) {
  try {
    const res = await checkToken(); // Await checkToken to get the result first

    if (res === "time") {
      if (res == true) {
        return axiosApi
          .post(url, data, {
            ...config,
            headers: authHeaderForm(),
          })
          .then((response) => response)
          .catch((error) => error.response);
      }
    } else {
      return axiosApi
        .post(url, data, {
          ...config,
          headers: authHeaderForm(),
        })
        .then((response) => response)
        .catch((error) => error.response);
    }
  } catch (error) {
    console.error("Error during token validation or API call:", error);
    throw error;
  }
}
export async function put(url, data, config = {}) {
  try {
    const res = await checkToken(); // Await checkToken to get the result first

    if (res === "time") {
      if (res == true) {
        return axiosApi
          .put(url, { ...data }, { ...config, headers: authHeader() })
          .then((response) => response);
      }
    } else {
      return axiosApi
        .put(url, { ...data }, { ...config, headers: authHeader() })
        .then((response) => response);
    }
  } catch (error) {
    console.error("Error during token validation or API call:", error);
    throw error;
  }
}

export async function del(url, config = {}) {
  try {
    const res = await checkToken(); // Await checkToken to get the result first

    if (res === "time") {
      if (res == true) {
        return await axiosApi
          .delete(url, { ...config, headers: authHeader() })
          .then((response) => response);
      }
    } else {
      return await axiosApi
        .delete(url, { ...config, headers: authHeader() })
        .then((response) => response);
    }
  } catch (error) {
    console.error("Error during token validation or API call:", error);
    throw error;
  }
}

export function isSuccessResp(status) {
  checkToken();
  if (status >= 200 && status <= 299) {
    return true;
  }
  return false;
}
