import "./Header.css";

export default function Header(props) {
  return (
    <section className="top-header">
      <div className="header-overlay">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="container">
            <h2 className="header-titile fs-md-25 ">{props.title}</h2>
            <div className="link-page d-flex justify-content-start align-content-center w-100 d-none">
              <div className="arrow-icon  d-flex justify-content-center align-items-center"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
