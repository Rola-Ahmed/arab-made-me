import axios from "axios";
import { baseUrl } from "config.js";
import { errorHandler } from "utils/errorHandler";

// Set default configurations for axios
axios.defaults.baseURL = baseUrl;
axios.defaults.timeout = 50000;

// Utility function to create request config
const createRequestConfig = (method, url, headers, data) => ({
  method,
  url,
  headers,
  data,
});

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Handle API response
const handleResponse = (response) => {
  // delay(500)
  if (response.data.message === "done" || response.data.message == "updated" || response?.data?.message === "check your email") {
    return {
      data: response.data,
      loadingStatus: false,
      error: null,
      success: true,
    };
  }
  return {
    data: null,
    loadingStatus: true,
    error: response.data.message,
    success: false,
  };
};

// Handle API errors
const handleError = (error) => {
  let errorMsg = "";

  errorMsg = errorHandler(error);

  return { data: null, loadingStatus: true, error: errorMsg, success: false };
};

// Generic function to make GET requests
export const getRequest = async (url) => {
  try {
    const response = await axios.get(url);
    return handleResponse(response);
  } catch (error) {
    // console.log("Request error: get", error);
    return handleError(error);
  }
};

export const getRequestDataHeader = async (url, headers, data) => {
  try {
    const config = createRequestConfig("get", url, headers, data);
    const response = await axios.request(config);
    return handleResponse(response);
  } catch (error) {
    console.log("Request error: get", error);
    return handleError(error);
  }
};

// Generic function to make POST requests
export const postRequest = async (url, headers, data) => {
  try {
    const config = createRequestConfig("post", url, headers, data);
    const response = await axios.request(config);
    return handleResponse(response);
  } catch (error) {
    console.log("Request error: post", error);
    return handleError(error);
  }
};

// Generic function to make POST requests
export const putRequest = async (url, headers, data) => {
  try {
    const config = createRequestConfig("put", url, headers, data);
    const response = await axios.request(config);
    return handleResponse(response);
  } catch (error) {
    console.log("Request error: put", error);
    return handleError(error);
  }
};

export const deleteRequest = async (url, headers, data) => {
  try {
    const config = createRequestConfig("delete", url, headers, data);
    const response = await axios.request(config);
    return handleResponse(response);
  } catch (error) {
    console.log("Request error: deleteRequest", error);
    return handleError(error);
  }
};
