//  calculates the time difference between the current time and a given notification time, and returns a string indicating how long ago the notification was.
  //   If the difference is less than 60 seconds, it returns a string indicating the number of seconds ago.
  // If the difference is less than 3600 seconds (1 hour), it returns a string indicating the number of minutes ago.
  // If the difference is less than 86400 seconds (1 day), it returns a string indicating the number of hours ago.
  

  // For Notification
export function getTimeDifference(notificationTime) {
    const currentTime = new Date();
    const notificationDate = new Date(notificationTime);
    const difference = Math.abs(currentTime - notificationDate) / 1000; // Difference in seconds

    if (difference < 60) {
      return `${Math.floor(difference)} seconds ago`;
    } else if (difference < 3600) {
      return `${Math.floor(difference / 60)} minutes ago`;
    } else if (difference < 86400) {
      return `${Math.floor(difference / 3600)} hours ago`;
    } else if (difference < 2592000) {
      return `${Math.floor(difference / 86400)} days ago`;
    } else {
      const months = Math.floor(difference / 2592000); // Approximate number of months
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
  }
 