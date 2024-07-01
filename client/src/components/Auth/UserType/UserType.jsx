import { useNavigate } from "react-router-dom";

// import "./EmailActivatedMsg.css";

// const
import {
  awaitImg,
  nextImg,
  logo,
  factoryIcon,
  buyerIcon,
} from "constants/Images";

export default function UserType() {
  document.title = "User Type";

  let navigate = useNavigate();

  return (
    <>
      <section className="register-msg ">
        {/* <div className="container "> */}
        <div className=" container ">
          {" "}
          <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
            <div className=" sub-cont w-100">
              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="img-cont ms-5">
                    <img src={awaitImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont  active">Select Your Role</p>
              </div>
              {/*  */}
              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={nextImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line-after mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">Company Details</p>
              </div>
              {/*  */}
              {/*  */}
              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={nextImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
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
                <p className="text-cont text-end">Legal documents</p>
              </div>
              {/*  */}
            </div>
          </div>
          <div className="sec-div d-flex justify-content-center">
            <div className="frame-container-1 p-5">
              <div className="cont-frame-1 ">
                <div className="img-logo w-100">
                  <img src={logo} />
                </div>

                <label className="text-title m-auto">Email Activated</label>

                <p className="text-sub m-auto">
                  Welcome to Egyption fastest-growing B2B platform, connecting
                  buyers and suppliers in the consumer goods industry. Please
                  choose your preferred account type to get started.
                </p>

                <div className="row gap-row">
                  <div
                    className="col-12 cursor"
                    onClick={() => {
                      navigate("/buyerRegistration");
                    }}
                  >
                    <div className="border-type p-3 ">
                      <div className="d-flex justify-content-start align-content-center gap-cont">
                        {" "}
                        <div className="user-icon">
                          <img src={buyerIcon} alt="buyer icon" />
                        </div>
                        <div className="">
                          <p className="user-text cursor">Buyer</p>
                          <p className="text-muted user-text-sub cursor">
                            I want to launch products with trusted suppliers and
                            partners.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    onClick={() => {
                      navigate("/CompanyDetails");
                    }}
                  >
                    <div className="border-type p-3 ">
                      <div className="d-flex justify-content-start align-content-center gap-cont">
                        {" "}
                        <div className="user-icon">
                          <img src={factoryIcon} alt="buyer icon" />
                        </div>
                        <div className="">
                          <p className="user-text cursor">Factory</p>
                          <p className="text-muted user-text-sub cursor">
                            I manufacture products or offer packaging,
                            ingredients or services.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <small className="text-muted title-small ">
                    Already have an account?{" "}
                    <span
                      className="fw-bolder cursor"
                      onClick={() => {
                        navigate("/signIn");
                      }}
                    >
                      {" "}
                      Sign In
                    </span>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
