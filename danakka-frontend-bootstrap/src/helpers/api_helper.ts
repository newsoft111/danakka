import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";

//pass new generated access token here
const token = accessToken;

//apply base url for axios
const API_URL = "";

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.defaults.headers.common["Authorization"] = token;

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// intercepting to capture errors
axios.interceptors.response.use(function (response) {
    return response.data ? response.data : response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
        case 500: message = "Internal Server Error"; break;
        case 401: message = "Invalid credentials"; break;
        case 404: message = "Sorry! the data you are looking for could not be found"; break;
        default: message = error.message || error;
    }
    return Promise.reject(message);
});


class ApiCore {
  /**
   * Fetches data from given url
   */
  get = (url : string, params?: {}) => {
      return axios.get(url, params);
  };

  /**
   * post given data to url
   */
  create = (url : string, data : {}) => {
      return axios.post(url, data);
  };

  /**
   * Updates data
   */
  update = (url: string, data:{}) => {
      return axios.put(url, data);
  };

  /**
   * Delete 
   */
  delete = (url : string, data?:{}) => {
      return axios.delete(url, {...data});
  };
};

export {ApiCore};