
// it gets Date and Time
export   function formattedTime(timestamp) {
    const dateObject = new Date(timestamp);

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
    const finalFormattedDate = `${formattedDate} ${formattedTime}`;
    return finalFormattedDate;
  }
