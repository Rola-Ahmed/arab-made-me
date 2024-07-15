import { useState, useEffect, useContext } from "react";

import axios from "axios";
import { baseUrl } from "config.js";

import Header from "components/main/Header/Header";
import { UserToken } from "Context/userToken";

import { useNavigate, useSearchParams } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";

import { contact1, contact2 } from "constants/Images";

function ContactSupplierFactoryPg() {
  let [factoryDetails, setFactoryDetails] = useState({});

  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");

  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  //  if the factoryid is null means not defined then direct to homepage
  if (factoryId == null) {
    localStorage.setItem("ToHomePage", "Page Not Found");

    navigate("/");
  }

  // factory details
  async function fetchFactoryData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (factoryId !== null) {
      fetchFactoryData();
    }
  }, [factoryId]);

  function handleIsLoggedInBtn(loginPath) {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      setisLoggedReDirect(`/signIn/${loginPath}`);
      return;
    }

    navigate(`/${loginPath}`);
  }

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
      />
      <Header title="Contact Supplier" />
      <section id="view" className="contact-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 contact-card-1">
              <div>
                <img
                  src={contact1}
                  className="photo-contact"
                  alt="contact-photo"
                />
              </div>
            </div>
            <div className="col-lg-6 ">
              <div className="one-card  mb-3">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M14 15.75C13.1347 15.75 12.2889 15.4934 11.5694 15.0127C10.8499 14.5319 10.2892 13.8487 9.95804 13.0492C9.62691 12.2498 9.54027 11.3701 9.70908 10.5215C9.87789 9.67281 10.2946 8.89326 10.9064 8.28141C11.5183 7.66955 12.2978 7.25287 13.1465 7.08406C13.9952 6.91525 14.8748 7.00189 15.6743 7.33303C16.4737 7.66416 17.157 8.22491 17.6377 8.94438C18.1184 9.66384 18.375 10.5097 18.375 11.375C18.3737 12.5349 17.9123 13.6469 17.0921 14.4671C16.272 15.2873 15.1599 15.7487 14 15.75ZM14 8.75C13.4808 8.75 12.9733 8.90395 12.5416 9.19239C12.11 9.48083 11.7735 9.8908 11.5748 10.3705C11.3761 10.8501 11.3242 11.3779 11.4255 11.8871C11.5267 12.3963 11.7767 12.864 12.1439 13.2312C12.511 13.5983 12.9787 13.8483 13.4879 13.9496C13.9971 14.0508 14.5249 13.9989 15.0046 13.8002C15.4842 13.6015 15.8942 13.265 16.1826 12.8334C16.4711 12.4017 16.625 11.8942 16.625 11.375C16.6242 10.679 16.3474 10.0118 15.8553 9.51969C15.3632 9.02757 14.696 8.75076 14 8.75Z"
                      fill="#212B36"
                    />
                    <path
                      d="M14 26.25L6.61895 17.5449C6.57703 17.4949 6.31427 17.1498 6.31427 17.1498C5.05331 15.489 4.37205 13.4603 4.37501 11.375C4.37501 8.82229 5.38907 6.37414 7.19411 4.5691C8.99915 2.76406 11.4473 1.75 14 1.75C16.5527 1.75 19.0009 2.76406 20.8059 4.5691C22.611 6.37414 23.625 8.82229 23.625 11.375C23.6281 13.4594 22.9474 15.4873 21.6871 17.1476L21.6857 17.1498C21.6857 17.1498 21.4232 17.4949 21.3841 17.5413L14 26.25ZM7.71095 16.0956C7.71182 16.0962 7.91517 16.3653 7.96172 16.4232L14 23.5444L20.0463 16.4132C20.0847 16.3649 20.2898 16.0939 20.2902 16.0932C21.3203 14.7361 21.877 13.0787 21.875 11.375C21.875 9.28642 21.0453 7.28338 19.5685 5.80653C18.0916 4.32968 16.0886 3.5 14 3.5C11.9114 3.5 9.90839 4.32968 8.43154 5.80653C6.95469 7.28338 6.12501 9.28642 6.12501 11.375C6.12307 13.0797 6.68018 14.7379 7.71095 16.0956Z"
                      fill="#212B36"
                    />
                  </svg>
                </div>
                <div className="one-card-text">
                  <h6>Visit us</h6>
                  <p>
                    {/* 508 Bridle Avenue Newnan, GA 30263 */}

                    {factoryDetails?.address?.[0]}
                  </p>
                </div>
              </div>
              <div className="one-card  mb-3">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M19.25 3.5H8.75C8.28601 3.50046 7.84116 3.68499 7.51307 4.01307C7.18499 4.34116 7.00046 4.78601 7 5.25V24.5C7.00053 24.964 7.18508 25.4088 7.51315 25.7368C7.84123 26.0649 8.28603 26.2495 8.75 26.25H19.25C19.7139 26.2494 20.1587 26.0648 20.4867 25.7367C20.8148 25.4087 20.9994 24.9639 21 24.5V5.25C20.9995 4.78603 20.8149 4.34122 20.4868 4.01315C20.1588 3.68508 19.714 3.50053 19.25 3.5ZM19.25 5.25V7H8.75V5.25H19.25ZM8.75 24.5V8.75H19.25V24.5H8.75Z"
                      fill="#212B36"
                    />
                  </svg>
                </div>
                <div className="one-card-text">
                  <h6>Call us</h6>
                  <p> {factoryDetails?.phone}</p>
                  {/* <p>(319) 555-0115</p> */}
                </div>
              </div>
              <div className="one-card  mb-3">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M24.5 5.05408H3.5C3.03587 5.05408 2.59075 5.23845 2.26256 5.56664C1.93437 5.89483 1.75 6.33995 1.75 6.80408V20.8041C1.75 21.2682 1.93437 21.7133 2.26256 22.0415C2.59075 22.3697 3.03587 22.5541 3.5 22.5541H24.5C24.9641 22.5541 25.4092 22.3697 25.7374 22.0415C26.0656 21.7133 26.25 21.2682 26.25 20.8041V6.80408C26.25 6.33995 26.0656 5.89483 25.7374 5.56664C25.4092 5.23845 24.9641 5.05408 24.5 5.05408ZM22.575 6.80408L14 12.7366L5.425 6.80408H22.575ZM3.5 20.8041V7.60033L13.5013 14.5216C13.6477 14.6232 13.8217 14.6776 14 14.6776C14.1783 14.6776 14.3523 14.6232 14.4987 14.5216L24.5 7.60033V20.8041H3.5Z"
                      fill="#212B36"
                    />
                  </svg>
                </div>
                <div className="one-card-text">
                  <h6>Talk to us</h6>
                  {/* <p>hello@example.com</p> */}
                  <p> {factoryDetails?.repEmail}</p>
                </div>
              </div>
              {/* <div className="one-card">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M14 26.25C11.5772 26.25 9.20877 25.5316 7.19427 24.1855C5.17977 22.8395 3.60965 20.9263 2.68248 18.6879C1.75531 16.4495 1.51272 13.9864 1.98539 11.6101C2.45805 9.23388 3.62475 7.05114 5.33795 5.33795C7.05114 3.62475 9.23388 2.45805 11.6101 1.98539C13.9864 1.51272 16.4495 1.75531 18.6879 2.68248C20.9263 3.60965 22.8395 5.17977 24.1855 7.19427C25.5316 9.20877 26.25 11.5772 26.25 14C26.25 17.2489 24.9594 20.3647 22.6621 22.6621C20.3647 24.9594 17.2489 26.25 14 26.25ZM14 3.50001C11.9233 3.50001 9.89323 4.11582 8.16652 5.26957C6.4398 6.42333 5.09399 8.06321 4.29927 9.98183C3.50455 11.9005 3.29662 14.0117 3.70176 16.0485C4.1069 18.0853 5.10693 19.9562 6.57538 21.4246C8.04384 22.8931 9.91476 23.8931 11.9516 24.2983C13.9884 24.7034 16.0996 24.4955 18.0182 23.7007C19.9368 22.906 21.5767 21.5602 22.7304 19.8335C23.8842 18.1068 24.5 16.0767 24.5 14C24.5 11.2152 23.3938 8.54452 21.4246 6.57538C19.4555 4.60625 16.7848 3.50001 14 3.50001Z"
                      fill="#212B36"
                    />
                    <path
                      d="M18.0163 19.25L13.125 14.3588V6.12501H14.875V13.6325L19.25 18.0163L18.0163 19.25Z"
                      fill="#212B36"
                    />
                  </svg>
                </div>
                <div className="one-card-text">
                  <h6>Working Hours</h6>
                  <p>Mon-Fri: 9 am — 6 pm</p>
                </div>
              </div> */}

              <button
                className="contact-btn ms-4"
                onClick={() => {
                  handleIsLoggedInBtn(
                    `contactsupplier?userId=${factoryDetails?.userId}&factoryName=${factoryDetails?.name}`
                  );
                }}
              >
                Contact Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-map">
        <div className="container">
          <div>
            <img className="map-contact" src={contact2} alt="map" />
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactSupplierFactoryPg;
