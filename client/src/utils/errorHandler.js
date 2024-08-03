// it gets Date and Time
export function errorHandler(error) {
  if (error.response) {
    const statusCode = error.response.status;
    switch (statusCode) {
      case 400:
        return error?.response?.data?.errorMessage;
      case 401:
        return "User is not Unauthorized";

      case 403:
        return "factory is not verified Yet or factory representive Email is not activated";

      case 404:
        return "Not Found (404). Something went wrong please try again later";

      case 500:
        // media error

        if (error?.response?.data?.errorMessage?.includes("jwt malformed")) {
          return "Something went Wrong, Please try again later.";
        }
        if (error?.response?.data?.errorMessage?.includes("ENOENT")) {
          return "Our server is currently under maintenance. Please try again later.";
        }

        if (
          error?.response?.data?.errorMessage?.includes(
            "Association with alias"
          )
        ) {
          return "Something went Wrong, Please try again later.";
        }
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
  }
  // else if (error.message.includes("ERR_CONNECTION_REFUSED")) {
  //   return "Server Maintenance: Our server is currently under maintenance. Please try again later.";
  // } else if (error.message.includes("ERR_NAME_NOT_RESOLVED")) {
  //   return "DNS Error: The server name could not be resolved.";
  // } else if (error.message.includes("ERR_INTERNET_DISCONNECTED")) {
  //   return "Internet Disconnected: Please check your internet connection.";
  // } else if (error.message.includes("ERR_TIMED_OUT")) {
  //   return "Request Timed Out: The server took too long to respond.";
  // } else if (error.message.includes("ERR_NETWORK_CHANGED")) {
  //   return "Network Changed: The network connection was changed.";
  // }
  else if (error.message === "error") {
    return error?.response?.data?.errorMessage;
  }
  if (error.message === "Network Error") {
    // if (error.message.includes("ERR_CONNECTION_REFUSED")) {
    //   return "Server Maintenance: Our server is currently under maintenance. Please try again later.";
    // }
    // if (error.message.includes("ERR_INTERNET_DISCONNECTED")) {
    //   return "Internet Disconnected: Please check your internet connection.";
    // }
    // console.log("netwoerkk", error);
    // // return "Something Went Wrong Please Try Again";
    return "Server Maintenance: Our server is currently under maintenance. Please try again later.";
  } else {
    return "Something Went Wrong. Please try again later.";
  }
}
