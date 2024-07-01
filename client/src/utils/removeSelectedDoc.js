// array of files selectedDocs
export function removeSelectedDoc(index, selectedDocs) {
  let updatedDocs = [...selectedDocs];
  updatedDocs.splice(index, 1);

  // when removing
  // setSelectedDocs(updatedDocs);

  return updatedDocs;

  // // when removing
  // setSelectedDocs((prevValue) =>
  //   prevValue.filter(
  //     (doc) => !(doc.pdfFile?.name === docId && doc?.keyWord === keyWordDoc)
  //   )
  // );
}
