export function getMonthName(monthNumber) {
  monthNumber = monthNumber?.split("-");
  let month = monthNumber?.[1];
  let day = monthNumber?.[2];
  let year = monthNumber?.[0];
  const date = new Date();
  date.setMonth(month - 1);

  return `${date.toLocaleString("en-US", {
    month: "short",
  })},${day},${year} `;
}
