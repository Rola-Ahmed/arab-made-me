
const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const year = tomorrow.getFullYear();
const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
const day = tomorrow.getDate().toString().padStart(2, "0");
const hours = tomorrow.getHours().toString().padStart(2, "0");
const minutes = tomorrow.getMinutes().toString().padStart(2, "0");

// Format the date as per the 'datetime-local' input type
const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;




export default formattedDate;




// purpose: The function generates a formatted date string representing tomorrow's date and time. It ensures that the generated date is always in the future compared to the current date and time.
// Why is it needed?: This functionality is useful for scenarios where you want to enforce that the user selects a date and time in the future, preventing them from entering past or today's date.