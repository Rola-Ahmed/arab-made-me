// utils/factoryUtils.js
export const determinePathAndData = (result) => {
  // const output = result?.data?.factories;
  const output = result;

  let path = null;

  if (output?.name == null) {
    path = "CompanyDetails";
  } else if (
    //   output?.coverVideo == null ||
    output?.coverImage == null ||
    output?.qualityCertificates == null ||
    (Array.isArray(output?.qualityCertificates) &&
      output?.qualityCertificates?.length == 0) ||
    output?.images == null ||
    (Array.isArray(output?.images) && output?.images?.length == 0)
  ) {
    path = "CompanyDetails/MircoSiteDocs";
  } else if (
    output?.repName == null ||
    output?.repPhone == null ||
    output?.repEmail == null
  ) {
    path = "CompanyDetails/RepresentiveDetails";
  } else if (
    output?.legalDocs == null ||
    (Array.isArray(output?.legalDocs) && output?.legalDocs?.length == 0) ||
    output?.taxRegisterationNumber == null ||
    output?.commercialRegisterationNumber == null ||
    output?.IndustrialLicenseNumber == null ||
    output?.IndustrialRegistrationNumber == null ||
    output?.BusinessRegistrationNumber == null
  ) {
    path = "CompanyDetails/LegalDocuments";
  }

  return {
    path,
  };
};
