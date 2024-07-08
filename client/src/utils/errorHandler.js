// it gets Date and Time
export function errorHandler(error) {
  if (error.response) {
    const statusCode = error.response.status;
    switch (statusCode) {
      case 400:
        return error?.response?.data?.errorMessage;
      case 401:
        return "User is not Unauthorized ";

      case 403:
        return "factory is not verified Yet or factory representive Email is not activated";

      case 404:
        return "Not Found (404). The requested resource was not found.";

      case 500:
        return error?.response?.data?.errorMessage;
      case 502:
        return "We apologize for the inconvenience, but it looks like there is a temporary issue with our server (Error 502: Bad Gateway). Our team is working hard to resolve this as quickly as possible.";
      case 429:
        return " Too Many Requests , Please try again later.";

      case 402:
        return error?.response?.data?.message;

      default:
        return error?.response?.data?.errorMessage;
    }
  } else {
    return "Something Went Wrong. Please try again later.";
  }

  if (error.message === "Network Error") {
    return "Something Went Wrong Please Try Again";
  } else if (error.message === "error") {
    return error?.response?.data?.errorMessage;
  }
}
