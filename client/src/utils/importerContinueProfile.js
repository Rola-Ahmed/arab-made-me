export const determinePathAndData = (output) => {
  let path = null;

  if (!output?.repName) {
    path = "buyerRegistration";
  } else if (
    output?.image == null ||
    output?.legalDocs == null ||
    (Array.isArray(output?.legalDocs) && output?.legalDocs?.length == 0)
  ) {
    path = "buyerRegistration/LegalDocuments";
  }
  return {
    path,
  };
};
