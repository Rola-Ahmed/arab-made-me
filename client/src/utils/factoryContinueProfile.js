// utils/factoryUtils.js
export const determinePathAndData = (result) => {
  // const output = result?.data?.factories;
  const output = result;
  // console.log(
  //   "output",
  //   output,
  //   // Array.isArray(output?.legalDocs) && output?.legalDocs?.length == 0,
  //   // output?.legalDocs == null,
  //   output?.legalDocs == null ||
  //     (Array.isArray(output?.legalDocs) && output?.legalDocs?.length == 0)

  //   // output?.legalDocs?.length == 0,
  //   // output?.coverImage?.length == 0,
  //   // output?.coverVideo?.length == 0
  // );

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
    // output?.legalDocs == null ,
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
    //   factoryVerified: output?.verified,
    //   FactoryName: output?.name,
    //   factoryRepEmail: output?.repEmail,
    //   factoryEmailActivated: output?.emailActivated,
    //   datacompletelyLoaded: false,
    //   profile: output?.coverImage,
    // continueProfilePath: path,
    path
  };
};
