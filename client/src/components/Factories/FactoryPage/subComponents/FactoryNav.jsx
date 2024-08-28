export default function FactoryNav({
  factoryDetails,
  handleIsLoggedInBtn,
  handleSetActive,
  activeMenu,
}) {
  function scrollToView(elementId) {
    handleSetActive(elementId);
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 78 - 103 - 50;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }
  return (
    <>
      <button
        onClick={() => {
          scrollToView("about");
        }}
        className={`btn ${activeMenu === "about" ? "btn-warning" : ""}`}
      >
        About
      </button>

      <button
        className={`btn ${activeMenu === "products" ? "btn-warning" : ""}`}
        onClick={() => {
          scrollToView("products");
        }}
      >
        Products
      </button>

      {factoryDetails?.qualityCertificates ? (
        <button
          className={`btn ${
            activeMenu === "certifications" ? "btn-warning" : ""
          }`}
          onClick={() => {
            scrollToView("certifications");
          }}
        >
          Certifications
        </button>
      ) : (
        <button className=" btn text-muted not-allowed">Certifications</button>
      )}

      {factoryDetails?.teamMembers?.length > 0 ? (
        <button
          className={`btn ${activeMenu === "ourPeople" ? "btn-warning" : ""}`}
          onClick={() => {
            scrollToView("ourPeople");
          }}
        >
          Our People
        </button>
      ) : (
        <button className="btn text-muted not-allowed">Our People</button>
      )}

      {factoryDetails?.importingCountries ? (
        <button
          className={`btn ${
            activeMenu === "exportedCountries" ? "btn-warning" : ""
          }`}
          onClick={() => {
            scrollToView("exportedCountries");
          }}
        >
          Exported Countries
        </button>
      ) : (
        <button className="btn text-muted not-allowed">
          Exported Countries
        </button>
      )}

      <button
        className={`btn ${activeMenu === "Endorsements" ? "btn-warning" : ""}`}
        onClick={() => {
          scrollToView("Endorsements");
        }}
      >
        Endorsements
      </button>

      <button
        onSetActive={handleSetActive}
        className="btn contact"
        onClick={() => {
          handleIsLoggedInBtn(
            `contactsupplier?userId=${factoryDetails?.userId}&factoryName=${factoryDetails?.name}`
          );
        }}
      >
        Contact Supplier
      </button>

      <hr />
    </>
  );
}
