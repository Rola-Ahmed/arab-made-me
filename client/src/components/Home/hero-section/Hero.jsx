import "./hero.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logo } from "constants/Images";
import { useAppTranslation } from "config.js";

function Hero() {
  let navigate = useNavigate();
  let [dropdownValue, setDropdownValue] = useState("Product");
  const { trans: t, currentLang } = useAppTranslation();

  const [searchTermSecotr, setsearchTermSecotr] = useState("");

  function filterSearchIcon(value) {
    if (value == "") {
      return;
    }

    if (dropdownValue.toLowerCase() == "product") {
      navigate(`productMarketPlace?filterSearch=${value}`);
    } else {
      navigate(`factoryGallery?filterSearch=${value}`, {
        state: {
          filterBy: value,
        },
      });
    }
    setsearchTermSecotr("");
  }

  return (
    <section className="hero-section">
      {/* <div className="ddede"></div> */}
      <div className="overlay-hero">
        <div className="container">
          <div className="hero">
            <div className="hero-1">
              <div>
                <img className="photo-logo" src={logo} alt="logo" />
              </div>

              <div>
                {/* <h2 className="text-2">Top Arabic Platform for Trading</h2> */}
                {/* <h3 className="text-2">Leading Arab Factories B2B Private Label Sourcing Platform</h3> */}
                <h3 className="text-2">
                  Arab B2B platform for Private Label services
                </h3>

                <p className="text-3">
                  Powerful, self-serve product and growth analytics to help
                  launch you product, and retain more buyers.
                </p>
              </div>
              <div className="w-100 mb-3 cont-5">
                <div className="input-group">
                  <button
                    className=" btn-warning dropdown-toggle btn-size"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {dropdownValue}
                    {/* {Dropdown} */}
                  </button>
                  <ul className="dropdown-menu">
                    <li
                      className=" cursor"
                      onClick={() => setDropdownValue("Factory")}
                    >
                      <div className="dropdown-item hover-drop cursor">
                        Factory
                      </div>
                    </li>
                    <li
                      className=" cursor"
                      onClick={() => setDropdownValue("Product")}
                    >
                      <div className="dropdown-item hover-drop cursor">
                        Product
                      </div>
                    </li>
                  </ul>
                  <input
                    type="text"
                    placeholder="Search.."
                    className="form-control form-control-lg  seach"
                    aria-label="Text input with dropdown button"
                    value={searchTermSecotr}
                    id="searchTermSecotr"
                    onChange={(e) => setsearchTermSecotr(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // Enter key was pressed
                        // Perform your desired action here
                        filterSearchIcon(
                          document.getElementById("searchTermSecotr").value
                        );
                      }

                      // filterSearchIcon(
                      //   document.getElementById("searchTermSecotr").value
                      // );
                    }}
                    autoComplete="off"
                  />

                  <div
                    className="col-auto"
                    onClick={(e) => {
                      filterSearchIcon(
                        document.getElementById("searchTermSecotr").value
                      );
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary ms-2 btn-sea"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="btns-group">
              <Link
                className="btn2 btn-1 text-decoration-none"
                to="/productMarketPlace"
              >
               {t("translation:marketPlace")}
              </Link>
              <Link
                className="btn2 btn-2 text-decoration-none"
                to="/factoryGallery/"
              >
               
               {t("translation:factoryGallery")}

              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
