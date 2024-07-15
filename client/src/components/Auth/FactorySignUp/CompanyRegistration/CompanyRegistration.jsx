import { useState, useContext, useEffect } from "react";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";
import InputField from "components/Forms/Shared/InputField";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import { awaitImg, currentsubPoint, subPoint } from "constants/Images";
import { useNavigate } from "react-router-dom";
import { useFormValidation } from "./useFormValidation";
import { useFetchSectors } from "components/Home/sectors/useFetchSectors";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { countriesMiddleEast } from "constants/countries";
import { addFactory } from "Services/factory";
import LastPointStatus from "../TimeLineHeader/LastPointStatus";
import SelectRole from "../TimeLineHeader/SelectRole";
import NextPoint from "../TimeLineHeader/NextPoint";

export default function CompanyRegistration() {
  document.title = "Company Registration";
  let currentUrl = window.location.pathname;

  let { isLogin } = useContext(UserToken);
  let { setCurrentUserData, currentUserData } = useContext(userDetails);
  let formValidation = useFormValidation(countriesMiddleEast, submitForm);
  let { allSectors } = useFetchSectors();
  // Ensure formValidation is not undefined
  // if (!formValidation) formValidation = null;
  // if (currentUserData?.factoryId)

  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn${currentUrl}`);
    }
    if (currentUserData && currentUserData?.importerId) {
      navigate("/403");
    }
  }, [isLogin, currentUserData]);

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);

  async function submitForm(values) {
    setIsLoading(true);

    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    try {
      let data = {
        description: values.description,
        country: values.country,
        sectorId: values.sectorId,
        name: values.factoryName,
        socialLinks: {},

        ...(values.website && { website: values.website }),
        ...(values.city && { city: values.city }),
        ...(values.factoryPhone && {
          phone: `${values.factoryPhoneCode}${values.factoryPhone}`,
        }),
      };

      if (values.WhatsappPhone !== "")
        data.socialLinks[
          "whatsapp"
        ] = `${values.WhatsappPhoneCode}${values.WhatsappPhone}`;

      let result = await addFactory({ authorization: isLogin }, data);
      // console.log("result", result);
      if (result?.success) {
        setCurrentUserData((prevUserData) => ({
          ...prevUserData,
          factoryId: result?.data?.factory?.id,
        }));

        navigate(`/CompanyDetails/step2`);
        setIsLoading(true);
      } else {
        setIsLoading(false);
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
      }
    } catch (error) {}
  }

  return (
    <section id="view" className="register-msg ">
      <div className=" container ">
        <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
          <div className=" sub-cont w-100">
            <SelectRole />
            <div className="text-check">
              <div className="  timeline-reg d-flex">
                <div className="w-100 vertical-line mt-auto mb-auto"></div>
                <div className="img-cont">
                  <img src={awaitImg} alt="" />
                </div>

                <div className="w-25 vertical-line  mt-auto mb-auto"></div>
                <div className="img-cont d-flex align-items-center ">
                  <img src={currentsubPoint} alt="" />
                </div>
                <div className="w-25 vertical-line-after  mt-auto mb-auto"></div>

                <div className="img-cont  d-flex align-items-center">
                  <img src={subPoint} alt="" />
                </div>
                <div className="w-25 vertical-line-after  mt-auto mb-auto"></div>

                <div className="img-cont  d-flex align-items-center">
                  <img src={subPoint} alt="" />
                </div>
                <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
              </div>
              <p className="text-cont text-center">Company Microsite Details</p>

              {/*  */}
            </div>

            <NextPoint title="Representive Information" />

            <LastPointStatus title="Legal Documents" isCurrentPoint={false} />
          </div>
        </div>

        <form onSubmit={formValidation.handleSubmit} className="w-100 ">
          <div className="sec-div d-flex justify-content-center">
            <div className="frame-container-2 ">
              <div className="cont-frame-1 ">
                {errorMsg?.response && (
                  <p className="text-sub m-auto alert  alert-danger  text-dark w-100">
                    {errorMsg?.response}
                  </p>
                )}
                <div className="row gap-16  w-100 m-auto">
                  <div className="col-12 ">
                    <InputField
                      isRequired={true}
                      title={" Company Name"}
                      formValidation={formValidation}
                      vlaidationName={"factoryName"}
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-group ">
                      <label className="form-title">Company Phone Number</label>
                      <div className="input-group  h-100">
                        <div className="input-group-prepend">
                          <select
                            className="input-group-text h-100 p-2 m-0 phone-borders"
                            id="factoryPhoneCode"
                            placeholder="1113534343"
                            onChange={formValidation.handleChange}
                            value={formValidation.values.factoryPhoneCode}
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
                          className="form-control input-style phone-border"
                          id="factoryPhone"
                          placeholder="1113534343"
                          onChange={formValidation.handleChange}
                          value={formValidation.values.factoryPhone}
                          onBlur={formValidation.handleBlur}
                        />
                      </div>
                      <FormVlaidtionError
                        formValidation={formValidation}
                        vlaidationName={"factoryPhone"}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group ">
                      <label className="form-title">
                        Whatsapp Phone Number
                      </label>
                      <div className="input-group  h-100">
                        <div className="input-group-prepend">
                          <select
                            className="input-group-text h-100 p-2 m-0 phone-borders"
                            id="WhatsappPhoneCode"
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
                          className="form-control input-style phone-border"
                          id="WhatsappPhone"
                          placeholder="1113534343"
                          onChange={formValidation.handleChange}
                          value={formValidation.values.WhatsappPhone}
                          onBlur={formValidation.handleBlur}
                        />
                      </div>

                      <FormVlaidtionError
                        formValidation={formValidation}
                        vlaidationName={"WhatsappPhone"}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <InputField
                      isRequired={false}
                      title={"Website"}
                      formValidation={formValidation}
                      vlaidationName={"website"}
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-group ">
                      <label className="form-title">Country</label>
                      <select
                        className="form-select form-control input-style"
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
                      title={"City"}
                      formValidation={formValidation}
                      vlaidationName={"city"}
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">sector</label>
                      <select
                        className="form-select form-control input-style"
                        onChange={
                          // setCountryVal(event.target.value);
                          formValidation.handleChange
                        }
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
                    <TextareaInput
                      vlaidationName="description"
                      formValidation={formValidation}
                      isRequired={true}
                      title="Company Description"
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
