export function removefromArray(index, selectedDocs) {
  let updatedDocs = [...selectedDocs];
  updatedDocs.splice(index, 1);
  return updatedDocs;
}
