// array of files selectedDocs
export function removeSelectedDoc(index, selectedDocs) {
  let updatedDocs = [...selectedDocs];
  updatedDocs.splice(index, 1);
  return updatedDocs;
}
