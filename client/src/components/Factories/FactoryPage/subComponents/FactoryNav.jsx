import { Link as LinkScroll } from "react-scroll";
import { useState } from "react";

export default function FactoryNav({ factoryDetails, handleIsLoggedInBtn }) {
  const [activeMenu, setActiveMenu] = useState("about");

  const handleSetActive = (to) => {
    if (to == null || to == "") {
      setActiveMenu("about");
    }
    setActiveMenu(to);
  };
  return (
    <>
      <LinkScroll
        onSetActive={handleSetActive}
        activeClass={`btn-warning`}
        spy={true}
        smooth={true}
        duration={200}
        hashSpy={true}
        offset={-175}
        isDynamic={true}
        to="about"
      >
        <button
          className={`btn ${activeMenu === "about" ? "btn-warning" : ""}`}
        >
          About
        </button>
      </LinkScroll>

      <LinkScroll
        onSetActive={handleSetActive}
        activeClass={activeMenu === "products" ? "btn-warning" : ""}
        spy={true}
        smooth={true}
        duration={200}
        offset={-147}
        to="products"
      >
        <button className="btn">Products</button>
      </LinkScroll>

      {factoryDetails?.qualityCertificates ? (
        <LinkScroll
          onSetActive={handleSetActive}
          activeClass={activeMenu === "certifications" ? "btn-warning" : ""}
          spy={true}
          smooth={true}
          duration={500}
          offset={-146}
          isDynamic={true}
          to="certifications"
        >
          <button className="btn">Certifications</button>
        </LinkScroll>
      ) : (
        <button className=" btn text-muted not-allowed">Certifications</button>
      )}

      {factoryDetails?.teamMembers?.length > 0 ? (
        <LinkScroll
          onSetActive={handleSetActive}
          activeClass={`btn-warning`}
          spy={true}
          smooth={true}
          duration={500}
          hashSpy={true}
          offset={-175}
          isDynamic={true}
          to="ourPeople"
        >
          <button className="btn">Our People</button>
        </LinkScroll>
      ) : (
        <button className="btn text-muted not-allowed">Our People</button>
      )}

      {factoryDetails?.importingCountries ? (
        <LinkScroll
          onSetActive={handleSetActive}
          activeClass={`btn-warning`}
          spy={true}
          smooth={true}
          duration={200}
          hashSpy={true}
          offset={-175}
          isDynamic={true}
          to="exportedCountries"
        >
          <button className="btn">Exported Countries</button>
        </LinkScroll>
      ) : (
        <button className="btn text-muted not-allowed">
          Exported Countries
        </button>
      )}

      <LinkScroll
        onSetActive={handleSetActive}
        activeClass={`btn-warning`}
        spy={true}
        smooth={true}
        duration={200}
        hashSpy={true}
        offset={-177}
        isDynamic={true}
        to="Endorsements"
      >
        <button className="btn">Endorsements</button>
      </LinkScroll>

      <button
        onSetActive={handleSetActive}
        className="btn contact"
        onClick={() => {
          handleIsLoggedInBtn(
            `contactCompany?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`
          );
        }}
      >
        Contact Supplier
      </button>

      <hr />
    </>
  );
}
