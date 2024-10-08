import { useState, useContext, useEffect } from "react";
import { awaitImg, nextImg, checkedImg } from "constants/Images";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "components/Forms/Shared/InputField";
import { determinePathAndData } from "utils/importerContinueProfile";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import useCountries from "hooks/useCountries";
import { useFetchSectors } from "hooks/useFetchSectors";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import { addImporter } from "Services/importer";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";
import {
  RegisterationNumbers,
  requiredStringMax255,
  phoneValidation,
  emailValidation,
  websiteValidation,
} from "utils/validationUtils";

export default function ImporterRepDetails() {
  let { isLogin } = useContext(UserToken);
  let { setCurrentUserData } = useContext(userDetails);
  let { allSectors } = useFetchSectors();
  const countriesMiddleEast = useCountries();

  document.title = "Buyer Registration";
  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn/buyerRegistration/LegalDocuments`);
    }
  }, [isLogin]);

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);

  let validationSchema = Yup.object().shape({
    // userType: Yup.string(),

    repName: requiredStringMax255,

    importerName: requiredStringMax255,

    repEmail: emailValidation,

    repPhone: phoneValidation,

    WhatsappPhone: phoneValidation,

    commercialRegisterationNumber: RegisterationNumbers([
      Yup.ref("vatNumber"),
      Yup.ref("importerLicenseNumber"),
    ]),
    vatNumber: RegisterationNumbers([
      Yup.ref("importerLicenseNumber"),
      Yup.ref("commercialRegisterationNumber"),
    ]),
    importerLicenseNumber: RegisterationNumbers([
      Yup.ref("vatNumber"),
      Yup.ref("commercialRegisterationNumber"),
    ]),

    website: websiteValidation,

    address: Yup.string().max(255, "max length is 255"),

    description: requiredStringMax255,
  });

  let formValidation = useFormik({
    initialValues: {
      repName: "",
      importerName: "",
      repEmail: "",
      repPhone: "",
      repPhoneCode: countriesMiddleEast?.[0].phoneCode,

      WhatsappPhone: "",
      WhatsappPhoneCode: countriesMiddleEast?.[0].phoneCode,

      commercialRegisterationNumber: "",
      description: "",

      sectorId: "",

      website: "",

      country: countriesMiddleEast?.[0].code,
      address: "",

      allowEmailNotification: "false",
      vatNumber: "",
      importerLicenseNumber: "",
    },
    validationSchema,
    onSubmit: submitForm,
  });
  useEffect(() => {
    if (allSectors?.length !== 0) {
      formValidation.setValues({
        ...formValidation.values,
        sectorId: allSectors?.[0]?.id || "",
      });
    }
  }, [allSectors]);

  async function submitForm(values) {
    setIsLoading(true);
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    // ;

    let {
      importerName,
      repName,
      repEmail,
      repPhoneCode,
      repPhone,
      description,
      country,
      sectorId,
      allowEmailNotification,
      address,
      website,
      commercialRegisterationNumber,
      WhatsappPhone,
      WhatsappPhoneCode,
      importerLicenseNumber,
      vatNumber,
    } = values;
    let data = {
      name: importerName,
      repName,
      repPhone: `${repPhoneCode}${repPhone}`,
      repEmail,
      description,
      country,
      sectorId,
      allowEmailNotification,
      importerLicenseNumber,
      commercialRegisterationNumber,
      vatNumber,
      socialLinks: {},
      ...(address && { address: [address] }),
      ...(website && { website: website }),
    };

    if (WhatsappPhone !== "")
      data.socialLinks["whatsapp"] = `${WhatsappPhoneCode}${WhatsappPhone}`;

    let result = await addImporter(
      {
        authorization: isLogin,
      },
      data
    );

    if (result?.success) {
      
      let { path } = determinePathAndData(result?.data?.importer);

      navigate("/buyerRegistration/LegalDocuments");
      setCurrentUserData((prevUserData) => ({
        ...prevUserData,
        importerId: result?.data?.importer?.id,
        continueProfilePath: path,
      }));
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result?.error,
      }));
      const targetElement = document.getElementById("view");
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setIsLoading(false);
    }
  }

  return (
    <section id="view" className="register-msg ">
      <div className=" container ">
        <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
          <div className=" sub-cont-buyer w-100">
            <div className=" text-check ">
              <div className="  timeline-reg d-flex">
                <div className="img-cont ms-5">
                  <img src={checkedImg} alt="" />
                </div>

                <div className="w-100 vertical-line  mt-auto mb-auto"></div>
              </div>
              <p className="text-cont  ">Select Your Role</p>
            </div>

            <div className=" text-check ">
              <div className="  timeline-reg d-flex">
                <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                <div className="img-cont">
                  <img src={awaitImg} alt="" />
                </div>

                <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
              </div>
              <p className="text-cont text-center active">
                Representive Information
              </p>
            </div>
            {/*  */}
            {/*  */}
            <div className=" text-check ">
              <div className="  timeline-reg d-flex">
                <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                <div className="img-cont me-5">
                  <img src={nextImg} alt="" />
                </div>
              </div>
              <p className="text-cont text-end">Legal Documents</p>
            </div>
            {/*  */}
          </div>
        </div>

        <form onSubmit={formValidation.handleSubmit} className="w-100 ">
          <div className="sec-div d-flex justify-content-center">
            <div className="frame-container-2 ">
              <div className="cont-frame-1 ">
                {errorMsg?.response && (
                  <p className="text-sub m-auto alert  alert-danger  text-dark w-100">
                    {errorMsg.response}
                  </p>
                )}

                <div className="row gap-12">
                  <div className="col-12">
                    <InputField
                      isRequired={true}
                      title="Buyer Name "
                      formValidation={formValidation}
                      vlaidationName="importerName"
                    />
                  </div>

                  <div className="col-12">
                    <InputField
                      isRequired={true}
                      title="Representive full Name"
                      formValidation={formValidation}
                      vlaidationName="repName"
                    />
                  </div>

                  <div className="col-12">
                    <InputField
                      isRequired={true}
                      title="Representive Email"
                      formValidation={formValidation}
                      vlaidationName="repEmail"
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        Representive Phone Number *
                      </label>
                      <div className="input-group  h-100">
                        <div className="input-group-prepend">
                          <select
                            className="input-group-text h-100 p-2 m-0 phone-borders"
                            id="repPhoneCode"
                            name="repPhoneCode"
                            placeholder="1113534343"
                            onChange={formValidation.handleChange}
                            value={formValidation.values.repPhoneCode}
                            onBlur={formValidation.handleBlur}
                          >
                            {/* <select className="input-group-text h-100  m-0" name="" id=""> */}

                            {countriesMiddleEast.map((phoneItem) => (
                              <option value={phoneItem.phoneCode}>
                                {phoneItem.phoneCode}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          className="form-control  phone-border"
                          id="repPhone"
                          name="repPhone"
                          placeholder="1113534343"
                          onChange={formValidation.handleChange}
                          value={formValidation.values.repPhone}
                          onBlur={formValidation.handleBlur}
                        />
                      </div>
                      <FormVlaidtionError
                        formValidation={formValidation}
                        vlaidationName="repPhone"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        Whatsapp Phone Number
                      </label>
                      <div className="input-group  h-100">
                        <div className="input-group-prepend">
                          <select
                            className="input-group-text h-100 p-2 m-0 phone-borders"
                            id="WhatsappPhoneCode"
                            name="WhatsappPhoneCode"
                            placeholder="1113534343"
                            onChange={formValidation.handleChange}
                            value={formValidation.values.WhatsappPhoneCode}
                            onBlur={formValidation.handleBlur}
                          >
                            {countriesMiddleEast.map((phoneItem) => (
                              <option value={phoneItem.phoneCode}>
                                {phoneItem.phoneCode}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          className="form-control  phone-border"
                          id="WhatsappPhone"
                          name="WhatsappPhone"
                          placeholder="1113534343"
                          onChange={formValidation.handleChange}
                          value={formValidation.values.WhatsappPhone}
                          onBlur={formValidation.handleBlur}
                        />
                      </div>

                      <FormVlaidtionError
                        formValidation={formValidation}
                        vlaidationName="WhatsappPhone"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <InputField
                      isRequired={false}
                      title={"website"}
                      formValidation={formValidation}
                      vlaidationName={"website"}
                    />
                  </div>

                  {/*  */}

                  <div className="col-12">
                    <InputField
                      isRequired={true}
                      title={"commercial Registeration Number"}
                      formValidation={formValidation}
                      vlaidationName={"commercialRegisterationNumber"}
                    />
                  </div>

                  <div className="col-12">
                    <InputField
                      isRequired={true}
                      title="importer License Number"
                      formValidation={formValidation}
                      vlaidationName="importerLicenseNumber"
                    />
                  </div>
                  <div className="col-12">
                    <InputField
                      isRequired={true}
                      title="Vat Number"
                      formValidation={formValidation}
                      vlaidationName="vatNumber"
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">Country</label>
                      <select
                        className="form-select form-control "
                        onChange={formValidation.handleChange}
                        id="country"
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.country}
                      >
                        {countriesMiddleEast.map((countryItem) => (
                          <option value={countryItem.code}>
                            {countryItem.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    <InputField
                      isRequired={false}
                      title={"address"}
                      formValidation={formValidation}
                      vlaidationName={"address"}
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">sector</label>
                      <select
                        className="form-select form-control "
                        onChange={formValidation.handleChange}
                        id="sectorId"
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.sectorId}
                      >
                        <option value="">Select</option>

                        {allSectors?.map((item) => (
                          <option value={item?.id}>{item?.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap m-0 p-0">
                      <label className="form-title">
                        Allow Email Notifications
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input switch-input cursor form-select form-control "
                        type="checkbox"
                        id="allowEmailNotification"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.allowEmailNotification}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <TextareaInput
                      vlaidationName="description"
                      formValidation={formValidation}
                      isRequired={true}
                      title="Buyer Description"
                    />
                  </div>

                  <div className="col-12 action">
                    {isLoading ? (
                      <button type="button" className="action-btn btn-1 w-100">
                        <i className="fas fa-spinner fa-spin"></i>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="action-btn btn-1 w-100 submitButton"
                        onClick={() => {
                          if (formValidation.isValid == false) {
                            const targetElement = document.getElementById(
                              Object.keys(formValidation.errors)?.[0]
                            );

                            // Scroll to the target element
                            if (targetElement) {
                              targetElement.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                            }
                          }
                        }}
                      >
                        Countinue
                      </button>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <small
                    className="text-muted title-small cursor"
                    onClick={() => {
                      navigate(`/`);
                    }}
                  >
                    Exit
                  </small>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
