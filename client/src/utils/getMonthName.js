export function getMonthName(dateString) {
  // Parse the date string
  const date = new Date(dateString);
  // Check if the parsed date is valid
  if (isNaN(date)) {
    return null;
  }
  // Format the month name, day, and year
  const options = { month: "short", day: "numeric", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedDate;
}
