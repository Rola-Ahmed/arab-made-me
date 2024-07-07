// it gets Date and Time

// Function to format date and time from a timestamp
export function formattedTime(timestamp) {
  // Check if the timestamp is valid
  if (isNaN(new Date(timestamp).getTime())) {
    return null;
  }

  const dateObject = new Date(timestamp);

  // Define options for formatting date
  const dateOptions = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = dateObject.toLocaleDateString("en-US", dateOptions);

  // Define options for formatting time
  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  const formattedTime = dateObject.toLocaleTimeString("en-US", timeOptions);

  // Concatenate date and time with a space in between
  return `${formattedDate} ${formattedTime}`;
  // Output: "Dec 31, 2022 6:59:59 PM"
}
