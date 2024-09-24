export const updateUrlParamString = (paramName, paramValue) => {
  let currentUrl = window.location.href;
  const paramRegex = new RegExp(`([?&])${paramName}=.*?(&|$)`);

  if (paramValue) {
    // Replace existing param with new value or append
    currentUrl = paramRegex.test(currentUrl)
      ? currentUrl.replace(paramRegex, `$1${paramName}=${paramValue}$2`)
      : currentUrl +
        (currentUrl.includes("?")
          ? `&${paramName}=${paramValue}`
          : `?${paramName}=${paramValue}`);
  } else {
    // Remove the parameter if value is empty/null
    currentUrl = currentUrl.replace(paramRegex, "$1").replace(/[?&]$/, "");
  }

  // Update the URL in the browser without reloading the page
  window.history.replaceState({}, document.title, currentUrl);
};

export const UpdateUrlParamArray = (paramName, paramValue) => {
  let currentUrl = window.location.href;
  const paramRegex = new RegExp(`([?&])${paramName}=.*?(&|$)`); // Match the parameter and its value

  if (paramValue?.length > 0) {
    // If paramValue exists, add or replace the parameter in the URL
    if (paramRegex.test(currentUrl)) {
      // Replace existing parameter with new value
      currentUrl = currentUrl.replace(
        paramRegex,
        `$1${paramName}=${paramValue.join(",")}$2`
      );
    } else {
      // Append new parameter if it doesn't exist
      currentUrl += currentUrl.includes("?")
        ? `&${paramName}=${paramValue.join(",")}`
        : `?${paramName}=${paramValue.join(",")}`;
    }
  } else {
    // If paramValue is empty or null, remove the parameter from the URL
    currentUrl = currentUrl.replace(paramRegex, "$1").replace(/[?&]$/, ""); // Clean trailing ? or &
  }

  // Update the browser's address bar
  window.history.replaceState({}, document.title, currentUrl);
};
