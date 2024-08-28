import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { countriesMiddleEast } from "constants/countries";
import ReadOnly from "components/Forms/Shared/ReadOnly";
import InputField from "components/Forms/Shared/InputField";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";
import TextareaInput from "components/Forms/Shared/TextareaInput";

export default function FactoryInforamtion(props) {
  let {
    handleShow,
    factoryProfile,
    factoryInfoValidation,
    show,
    errorMsg,
    isLoading,
    handleClose,
  } = props;
  return (
    <>
      <div id="FactoryInforamtion"></div>
      <div className="container-profile-input w-100 d-flex gap-16">
        <p className="fs-24-semi">Factory Inforamtion</p>
        <div className="w-100 ">
          <div className="row  row-gap">
            <div className="col-6">
              <ReadOnly title="Factory Name" value={factoryProfile?.name} />
            </div>
            <div className="col-6">
              <ReadOnly
                title="Year Of establishment"
                value={factoryProfile?.yearOfEstablishmint}
              />
            </div>
            <div className="col-6">
              <ReadOnly title="Country" value={factoryProfile?.country} />
            </div>

            <div className="col-6">
              <ReadOnly title="City" value={factoryProfile?.city} />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Yearly Sales Income"
                value={factoryProfile?.yearlySalesIncome}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Number of employees"
                value={factoryProfile?.numberOfEmployees}
              />
            </div>
            <div className="col-6">
              <ReadOnly
                title="Business Registration Number"
                value={factoryProfile?.BusinessRegistrationNumber}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Vat Number"
                value={factoryProfile?.taxRegisterationNumber}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Industrial Registration Number"
                value={factoryProfile?.IndustrialRegistrationNumber}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Industrial license Number"
                value={factoryProfile?.IndustrialLicenseNumber}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="commercial Registeration Number"
                value={factoryProfile?.commercialRegisterationNumber}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Factory Phone Number"
                value={factoryProfile?.phone}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Factory Location"
                value={factoryProfile?.address}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="exporting Countries"
                value={factoryProfile?.importingCountries?.join(", ")}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Factory description"
                value={factoryProfile?.description}
              />
            </div>

            <div className="col-6">
              <ReadOnly title="Why Us" value={factoryProfile?.whyUs} />
            </div>
          </div>
        </div>
        <Button
          className="btn-edit mt-2"
          variant="primary"
          onClick={() => handleShow("factoryInfoChangeReadOnly")}
        >
          <p className="cursor">Change Factory Information </p>
        </Button>
      </div>

      {/* Factory Info Modal update form */}
      <form onSubmit={factoryInfoValidation.handleSubmit}>
        <Modal
          show={show.factoryInfoChangeReadOnly}
          onHide={() => handleClose("factoryInfoChangeReadOnly")}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="factory-profile"
        >
          <Modal.Body closeButton>
            {/* Account Info container 1 */}

            <div className="container-profile-input w-100">
              <div className="title-contianer-input w-100">
                <Modal.Header closeButton>
                  <Modal.Title>
                    <p>Factory Inforamtion</p>
                  </Modal.Title>
                </Modal.Header>
                {errorMsg?.response && (
                  <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                    {errorMsg?.response}
                  </div>
                )}
                <div className="w-100 ">
                  <form>
                    <div className="row  row-gap">
                      <div className="col-6">
                        <InputField
                          formValidation={factoryInfoValidation}
                          vlaidationName="factoryName"
                          isRequire={false}
                          title="Factory Name"
                        />
                      </div>
                      <div className="col-6">
                        <InputField
                          formValidation={factoryInfoValidation}
                          vlaidationName="yearOfEstablishmint"
                          isRequire={false}
                          title="Year Of Establishment"
                        />
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label className="form-title">Country</label>
                          <select
                            className="form-select form-control"
                            onChange={factoryInfoValidation.handleChange}
                            id="country"
                            onBlur={factoryInfoValidation.handleBlur}
                            value={factoryInfoValidation.values.country}
                          >
                            {countriesMiddleEast?.map((countryItem) => (
                              <option value={countryItem.code}>
                                {countryItem.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-6">
                        <InputField
                          formValidation={factoryInfoValidation}
                          vlaidationName="city"
                          isRequire={false}
                          title="City"
                        />
                      </div>

                      <div className="col-6">
                        <InputField
                          formValidation={factoryInfoValidation}
                          vlaidationName="yearlySalesIncome"
                          isRequire={false}
                          title="Yearly Sales Income"
                        />
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label className="form-title">
                            Number of employees
                          </label>

                          <select
                            className="form-select form-control"
                            onChange={factoryInfoValidation.handleChange}
                            id="numberOfEmployees"
                            onBlur={factoryInfoValidation.handleBlur}
                            value={
                              factoryInfoValidation.values.numberOfEmployees
                            }
                          >
                            <option value="">Select Number of employees</option>

                            <option value="1-10">1-10 Employess</option>
                            <option value="11-50 ">11-50 Employess</option>
                            <option value="51 - 100">51 - 100 Employess</option>
                            <option value="101 - 500">
                              101 - 500 Employess
                            </option>
                            <option value="501-1000">501-1000 Employess</option>
                            <option value="More than 1000">
                              More than 1000 Employess
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-6">
                        <InputField
                          formValidation={factoryInfoValidation}
                          vlaidationName="BusinessRegistrationNumber"
                          isRequire={false}
                          title="Business Registration Number"
                        />
                      </div>

                      <div className="col-6">
                        <InputField
                          formValidation={factoryInfoValidation}
                          vlaidationName="taxRegisterationNumber"
                          isRequire={false}
                          title="Vat Number"
                        />
                      </div>

                      <div className="col-6">
                        <InputField
                          isRequired={true}
                          title={"Industrial Registration Number"}
                          formValidation={factoryInfoValidation}
                          vlaidationName={"IndustrialRegistrationNumber"}
                        />
                      </div>

                      <div className="col-6">
                        <InputField
                          isRequired={true}
                          title={"Industrial license number"}
                          formValidation={factoryInfoValidation}
                          vlaidationName={"IndustrialLicenseNumber"}
                        />
                      </div>

                      <div className="col-6">
                        <InputField
                          formValidation={factoryInfoValidation}
                          vlaidationName="commercialRegisterationNumber"
                          isRequire={false}
                          title="commercial Registeration Number"
                        />
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label className="form-title">
                            Facatory Phone Number
                          </label>
                          <div className="input-group  h-100">
                            <div className="input-group-prepend">
                              <select
                                className="input-group-text h-100 p-2 m-0 phone-borders"
                                id="factoryPhoneCode"
                                placeholder="1113534343"
                                onChange={factoryInfoValidation.handleChange}
                                value={
                                  factoryInfoValidation.values.factoryPhoneCode
                                }
                                onBlur={factoryInfoValidation.handleBlur}
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
                              className="form-control phone-border"
                              id="factoryPhone"
                              placeholder="1113534343"
                              onChange={factoryInfoValidation.handleChange}
                              value={factoryInfoValidation.values.factoryPhone}
                              onBlur={factoryInfoValidation.handleBlur}
                            />
                          </div>
                          <FormVlaidtionError
                            formValidation={factoryInfoValidation}
                            vlaidationName="factoryPhone"
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <InputField
                          formValidation={factoryInfoValidation}
                          vlaidationName="address"
                          isRequire={false}
                          title="Factory Location"
                        />
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>exporting Countries</label>
                          <button
                            className="btn d-flex justify-content-between  dropdown-toggle w-100 text-start select-countries"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Select Countries
                          </button>
                          <ul className="dropdown-menu col-5 scroller">
                            {countriesMiddleEast.map((item) => (
                              <li>
                                <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop">
                                  <input
                                    onChange={
                                      factoryInfoValidation.handleChange
                                    }
                                    className="form-check-input cursor me-3 "
                                    type="checkbox"
                                    id="importingCountries"
                                    value={item.code}
                                    defaultChecked={factoryProfile?.importingCountries?.some(
                                      (type) =>
                                        item.code
                                          .toLowerCase()
                                          .includes(type.toLowerCase())
                                    )}
                                  />
                                  <label
                                    className="form-check-label p-0 m-0"
                                    htmlFor="importingCountries"
                                  >
                                    {item.name}
                                  </label>
                                </div>
                              </li>
                            ))}
                          </ul>

                          {/*  */}
                        </div>
                      </div>

                      {/* <div className="col-12"> */}
                      <TextareaInput
                        formValidation={factoryInfoValidation}
                        vlaidationName="description"
                        isRequire={false}
                        title="Factory description"
                      />

                      {/* </div> */}
                      {/* <div className="col-12"> */}
                      <TextareaInput
                        formValidation={factoryInfoValidation}
                        vlaidationName="whyUs"
                        isRequire={false}
                        title="Why Us"
                      />

                      {/* </div> */}

                      <div className="col-12 d-flex justify-content-start btn-modal-gap">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() =>
                            handleClose("factoryInfoChangeReadOnly")
                          }
                        >
                          Close
                        </Button>
                        {isLoading ? (
                          <button type="button" className="btn-edit">
                            <i className="fas fa-spinner fa-spin text-white px-5"></i>
                          </button>
                        ) : (
                          <button
                            className="btn-edit submitButton"
                            type="submit"
                          >
                            <p className="cursor">save changes</p>
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </form>
    </>
  );
}
